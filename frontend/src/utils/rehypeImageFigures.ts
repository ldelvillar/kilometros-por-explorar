type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const PROSE_IMAGE_SIZES = '(min-width: 896px) 864px, calc(100vw - 2rem)';

export function rehypeImageFigures() {
  return function transform(node: HastNode) {
    if (!node.children) return;

    node.children = node.children.map(child => {
      transform(child);

      if (child.tagName === 'img') {
        child.properties = { ...child.properties, sizes: PROSE_IMAGE_SIZES };
      }

      if (child.type !== 'element' || child.tagName !== 'p') return child;

      // Solo los párrafos cuyo único contenido es una imagen con alt.
      const content = (child.children ?? []).filter(
        n => n.type !== 'text' || n.value?.trim() !== ''
      );
      const image = content[0];
      if (content.length !== 1 || image.tagName !== 'img') return child;

      const alt = image.properties?.alt;
      if (typeof alt !== 'string' || !alt) return child;

      return {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          image,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: alt }],
          },
        ],
      };
    });
  };
}
