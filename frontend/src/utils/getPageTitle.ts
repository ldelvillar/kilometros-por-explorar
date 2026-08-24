import { SITE_CONFIG } from '@/config/site';

// Every page <title> ends with the brand, e.g. "Blog | Kilómetros por Explorar".
export const getPageTitle = (title: string) =>
  `${title} | ${SITE_CONFIG.company.name}`;
