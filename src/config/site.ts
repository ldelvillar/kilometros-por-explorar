export const SITE_CONFIG = {
  domain: 'https://www.kilometrosporexplorar.es',

  name: 'Kilómetros por Explorar',
  description:
    'Descubre los destinos más increíbles del mundo con nuestras experiencias de viaje únicas.',

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

  // Configuración SEO por defecto
  seo: {
    defaultTitle: 'Kilómetros por Explorar - Viajes únicos por el mundo',
    titleTemplate: '%s | Kilómetros por Explorar',
    defaultDescription:
      'Descubre los destinos más increíbles del mundo con nuestras experiencias de viaje únicas. Aventuras personalizadas para exploradores como tú.',
    defaultImage: '/images/brand/logo.png',
    defaultImageAlt: 'Logo de Kilómetros por Explorar',
  },
} as const;

// Funciones de utilidad
export const getSiteUrl = (path: string = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${normalizedPath}`;
};

export const getCanonicalUrl = (pathname: string) => {
  return getSiteUrl(pathname);
};
