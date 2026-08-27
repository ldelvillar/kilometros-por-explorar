import { SITE_CONFIG } from '@/config/site';

// Utility function to construct full URLs for the site
export const getSiteUrl = (path: string = '') => {
  // Ensure the path starts with a slash, then strip any trailing slash
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  return `${SITE_CONFIG.domain}${normalizedPath}`;
};

// Phone numbers are stored with spaces for display; a tel: URI must not have them
export const getTelHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;
