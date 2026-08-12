const WORDS_PER_MINUTE = 200;

export const getReadingTime = (body: string = '') => {
  const text = body
    // Las imágenes no se leen y su ruta contaría como palabras
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // De los enlaces solo se lee el texto, nunca la URL
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  const words = text.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
