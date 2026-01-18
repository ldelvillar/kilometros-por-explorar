import { SITE_CONFIG, getSiteUrl } from './site';

// Schema base para la organización
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_CONFIG.company.name,
  url: SITE_CONFIG.domain,
  logo: getSiteUrl('/images/brand/logo.png'),
  description: SITE_CONFIG.seo.defaultDescription,
  email: SITE_CONFIG.company.email,
  telephone: SITE_CONFIG.company.phone,
  sameAs: [
    SITE_CONFIG.social.instagram,
    SITE_CONFIG.social.facebook,
    SITE_CONFIG.social.tiktok,
    SITE_CONFIG.social.twitter,
  ],
});

// Schema para página web
export const getWebPageSchema = (
  title: string,
  description: string,
  pathname: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description: description,
  url: getSiteUrl(pathname),
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
  },
  author: {
    '@type': 'Organization',
    name: SITE_CONFIG.company.name,
  },
});

// Schema para sitio web
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  description: SITE_CONFIG.seo.defaultDescription,
  url: SITE_CONFIG.domain,
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.company.name,
    logo: getSiteUrl('/images/brand/logo.png'),
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_CONFIG.domain}/buscar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

// Schema para servicios de viaje
export const getTravelServiceSchema = (
  serviceName: string,
  description: string,
  price?: number
) => ({
  '@context': 'https://schema.org',
  '@type': 'TravelService',
  name: serviceName,
  description: description,
  provider: {
    '@type': 'TravelAgency',
    name: SITE_CONFIG.company.name,
    url: SITE_CONFIG.domain,
  },
  ...(price && {
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  }),
});

// Schema para destinos turísticos
export const getTouristDestinationSchema = (
  destinationName: string,
  description: string,
  imageUrl?: string,
  country?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: destinationName,
  description: description,
  ...(imageUrl && {
    image: imageUrl.startsWith('http') ? imageUrl : getSiteUrl(imageUrl),
  }),
  ...(country && { containedInPlace: { '@type': 'Country', name: country } }),
  touristType: 'international visitors',
});

// Tipo para items del FAQ
export interface FAQItem {
  question: string;
  answer: string;
}

// Schema para FAQ
export const getFAQSchema = (faqs: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Schema para artículos/blog posts
export const getArticleSchema = (
  title: string,
  description: string,
  pathname: string,
  publishDate: string,
  modifyDate?: string,
  imageUrl?: string,
  authorName?: string,
  aboutName?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description: description,
  url: getSiteUrl(pathname),
  datePublished: publishDate,
  dateModified: modifyDate || publishDate,
  author: {
    '@type': 'Person',
    name: authorName || SITE_CONFIG.company.name,
    url: getSiteUrl('/sobre-nosotros'),
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.company.name,
    logo: {
      '@type': 'ImageObject',
      url: getSiteUrl('/images/brand/logo.png'),
      width: 850,
      height: 425,
    },
  },
  ...(imageUrl && {
    image: {
      '@type': 'ImageObject',
      url: imageUrl.startsWith('http') ? imageUrl : getSiteUrl(imageUrl),
      width: 1200,
      height: 630,
    },
  }),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': getSiteUrl(pathname),
  },
  ...(aboutName && {
    about: {
      '@type': 'Place',
      name: aboutName.charAt(0).toUpperCase() + aboutName.slice(1),
    },
  }),
});

// Tipo para items del breadcrumb
export interface BreadcrumbItem {
  name: string;
  href?: string;
}

// Schema para breadcrumbs
export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.href && { item: getSiteUrl(item.href) }),
  })),
});

// Schema combinado para páginas principales
export const getCombinedSchema = (pageSchema: object) => ({
  '@context': 'https://schema.org',
  '@graph': [getOrganizationSchema(), getWebSiteSchema(), pageSchema],
});

// Schema combinado para artículos del blog (incluye Article + Breadcrumb + FAQ)
export const getBlogCombinedSchema = (
  articleSchema: object,
  breadcrumbItems: BreadcrumbItem[],
  faqSchema: object
) => ({
  '@context': 'https://schema.org',
  '@graph': [
    getOrganizationSchema(),
    getWebSiteSchema(),
    articleSchema,
    getBreadcrumbSchema(breadcrumbItems),
    faqSchema,
  ],
});
