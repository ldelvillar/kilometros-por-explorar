import GithubSlugger from 'github-slugger';

// Forma mínima de un nodo hast.
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function getText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(getText).join('');
}

export function rehypeToc() {
  return function transform(tree: HastNode) {
    const root = tree.children;
    if (!root) return;

    const slugger = new GithubSlugger();
    const items: { href: string; text: string }[] = [];
    let firstH2Index = -1;

    root.forEach((node, i) => {
      if (node.type !== 'element' || node.tagName !== 'h2') return;

      if (firstH2Index === -1) firstH2Index = i;

      const text = getText(node).trim();
      const id = slugger.slug(text);
      node.properties = { ...(node.properties ?? {}), id };
      items.push({ href: `#${id}`, text });
    });

    if (firstH2Index !== -1 && items.length > 0) {
      root.splice(firstH2Index, 0, buildToc(items));
    }
  };
}

function buildToc(items: { href: string; text: string }[]): HastNode {
  return {
    type: 'element',
    tagName: 'details',
    properties: { className: ['toc'], open: true },
    children: [
      {
        type: 'element',
        tagName: 'summary',
        properties: { className: ['toc-sum'] },
        children: [
          { type: 'text', value: 'Índice' },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['toc-count'] },
            children: [{ type: 'text', value: `· ${items.length} secciones` }],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['toc-toggle'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['toc-toggle-open'] },
                children: [{ type: 'text', value: 'Ocultar' }],
              },
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['toc-toggle-closed'] },
                children: [{ type: 'text', value: 'Ver' }],
              },
            ],
          },
        ],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['toc-list'] },
        children: items.map((item, index) => ({
          type: 'element',
          tagName: 'a',
          properties: { className: ['toc-row'], href: item.href },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['toc-n'] },
              children: [
                { type: 'text', value: String(index + 1).padStart(2, '0') },
              ],
            },
            { type: 'text', value: item.text },
          ],
        })),
      },
    ],
  };
}
