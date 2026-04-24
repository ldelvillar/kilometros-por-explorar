import { SITE_CONFIG } from '@/config/site';

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
