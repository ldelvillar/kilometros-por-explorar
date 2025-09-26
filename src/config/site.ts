// Configuración global del sitio web
export const SITE_CONFIG = {
  // Dominio principal del sitio
  domain: 'https://www.kilometrosporexplorar.es',

  // Información básica del sitio
  name: 'Kilómetros por Explorar',
  description:
    'Descubre los destinos más increíbles del mundo con nuestras experiencias de viaje únicas.',

  // Información de la empresa/organización
  company: {
    name: 'Kilómetros por Explorar',
    email: 'info@kilometrosporexplorar.es',
    phone: '+34 XXX XXX XXX', // Cambia por tu teléfono real
  },

  // Redes sociales
  social: {
    twitter: '@kilometrosporexplorar',
    instagram: '@kilometrosporexplorar',
    facebook: 'kilometrosporexplorar',
    tiktok: '@kilometrosporexplorar',
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
  // Asegurar que el path empiece con /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${normalizedPath}`;
};

export const getCanonicalUrl = (pathname: string) => {
  return getSiteUrl(pathname);
};
