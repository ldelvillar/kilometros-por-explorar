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
  return function transform(node: HastNode) {
    if (!node.children) return;

    for (let i = 0; i < node.children.length; i++) {
      const heading = node.children[i];

      const isIndiceHeading =
        heading.type === 'element' &&
        heading.tagName === 'h2' &&
        getText(heading).trim() === 'Índice';

      let listIndex = i + 1;
      while (
        listIndex < node.children.length &&
        node.children[listIndex].type === 'text' &&
        !(node.children[listIndex].value ?? '').trim()
      ) {
        listIndex++;
      }
      const list = node.children[listIndex];
      const isLinkList =
        list?.type === 'element' &&
        (list.tagName === 'ol' || list.tagName === 'ul');

      if (isIndiceHeading && isLinkList) {
        const items = (list.children ?? [])
          .filter(li => li.type === 'element' && li.tagName === 'li')
          .map(li => {
            const link = (li.children ?? []).find(
              c => c.type === 'element' && c.tagName === 'a'
            );
            return {
              href: (link?.properties?.href as string | undefined) ?? '#',
              text: getText(li).trim(),
            };
          });

        node.children.splice(i, listIndex - i + 1, buildToc(items));
        continue;
      }

      transform(heading);
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
