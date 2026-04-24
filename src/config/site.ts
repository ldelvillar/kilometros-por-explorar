export const SITE_CONFIG = {
  domain: 'https://www.kilometrosporexplorar.es',

  company: {
    name: 'Kilómetros por Explorar',
    email: 'contacto@kilometrosporexplorar.es',
    phone: '+34 604 11 26 28',
    phone2: '+34 619 45 87 64',
    address: 'Madrid, España',
  },

  social: {
    twitter: '@kilometrosporexplorar',
    instagram: 'https://www.instagram.com/kilometrosporexplorar',
    facebook: 'https://www.facebook.com/kilometrosporexplorar',
    tiktok: 'https://www.tiktok.com/@kilometrosporexplorar',
  },

  seo: {
    defaultTitle: 'Kilómetros por Explorar - Viajes únicos por el mundo',
    defaultDescription:
      'Descubre los destinos más increíbles del mundo con nuestras experiencias de viaje únicas. Aventuras personalizadas para exploradores como tú.',
    defaultImage: '/images/brand/logo.png',
    defaultImageAlt: 'Logo de Kilómetros por Explorar',
  },
} as const;

// Utility function to construct full URLs for the site
export const getSiteUrl = (path: string = '') => {
  // Ensure the path starts with a slash and does not end with a slash (unless it's just '/')
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  return `${SITE_CONFIG.domain}${normalizedPath}`;
};

export const getCanonicalUrl = (pathname: string) => {
  return getSiteUrl(pathname);
};
