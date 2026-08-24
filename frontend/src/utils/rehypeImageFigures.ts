// Forma mínima de un nodo hast: @types/hast no es dependencia del proyecto.
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * Envuelve las imágenes de Markdown en un <figure> con su alt como pie de foto.
 * Se ejecuta antes que el plugin de imágenes de Astro, así que el alt todavía
 * está disponible en las propiedades del nodo.
 */
export function rehypeImageFigures() {
  return function transform(node: HastNode) {
    if (!node.children) return;

    node.children = node.children.map(child => {
      transform(child);

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
