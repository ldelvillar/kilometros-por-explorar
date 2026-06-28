import { SITE_CONFIG } from '@/config/site';
import { getSiteUrl } from '@/utils/getUrls';

// IDs estables para enlazar nodos dentro del @graph (evita entidades duplicadas)
export const ORGANIZATION_ID = `${SITE_CONFIG.domain}/#organization`;
export const WEBSITE_ID = `${SITE_CONFIG.domain}/#website`;

// Schema base para la organización (TravelAgency es un subtipo de LocalBusiness)
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': ORGANIZATION_ID,
  name: SITE_CONFIG.company.name,
  url: SITE_CONFIG.domain,
  logo: getSiteUrl('/images/brand/logo.png'),
  image: getSiteUrl('/images/brand/logo.png'),
  description: SITE_CONFIG.seo.defaultDescription,
  email: SITE_CONFIG.company.email,
  telephone: SITE_CONFIG.company.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Madrid',
    addressRegion: 'Madrid',
    addressCountry: 'ES',
  },
  areaServed: {
    '@type': 'Country',
    name: 'España',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: SITE_CONFIG.company.phone,
    email: SITE_CONFIG.company.email,
    areaServed: 'ES',
    availableLanguage: 'Spanish',
  },
  sameAs: [
    SITE_CONFIG.social.instagram,
    SITE_CONFIG.social.facebook,
    SITE_CONFIG.social.tiktok,
    SITE_CONFIG.social.googleBusiness,
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
  inLanguage: 'es-ES',
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_CONFIG.company.name,
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
  '@id': WEBSITE_ID,
  name: SITE_CONFIG.company.name,
  description: SITE_CONFIG.seo.defaultDescription,
  url: SITE_CONFIG.domain,
  inLanguage: 'es-ES',
  publisher: { '@id': ORGANIZATION_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_CONFIG.domain}/destinos?q={search_term_string}`,
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
  country?: string,
  pathname?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  ...(pathname && { '@id': `${getSiteUrl(pathname)}#destination` }),
  name: destinationName,
  description: description,
  ...(pathname && { url: getSiteUrl(pathname) }),
  ...(imageUrl && {
    image: imageUrl.startsWith('http') ? imageUrl : getSiteUrl(imageUrl),
  }),
  ...(country && { containedInPlace: { '@type': 'Country', name: country } }),
  touristType: 'international visitors',
});

// Schema para un viaje turístico personalizado (TouristTrip) hacia un destino.
// Representa "un viaje a medida que planificamos", enlazando el destino y la agencia.
export const getTouristTripSchema = (
  tripName: string,
  description: string,
  pathname: string,
  imageUrl?: string,
  country?: string,
  touristType?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  '@id': `${getSiteUrl(pathname)}#trip`,
  name: tripName,
  description: description,
  url: getSiteUrl(pathname),
  ...(imageUrl && {
    image: imageUrl.startsWith('http') ? imageUrl : getSiteUrl(imageUrl),
  }),
  ...(touristType && { touristType }),
  itinerary: {
    '@type': 'ItemList',
    numberOfItems: 1,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: { '@id': `${getSiteUrl(pathname)}#destination` },
      },
    ],
  },
  ...(country && { arrivalLocation: { '@type': 'Country', name: country } }),
  provider: { '@id': ORGANIZATION_ID },
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
  inLanguage: 'es-ES',
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

// Schema para reseñas de clientes
export const getReviewSchema = (review: {
  reviewBody: string;
  authorName: string;
  pathname: string;
  name?: string;
  rating?: { ratingValue: number; bestRating?: number };
  datePublished?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  ...(review.name && { name: review.name }),
  reviewBody: review.reviewBody,
  author: {
    '@type': 'Person',
    name: review.authorName,
  },
  itemReviewed: {
    '@type': 'TravelAgency',
    name: SITE_CONFIG.company.name,
    url: SITE_CONFIG.domain,
  },
  url: getSiteUrl(review.pathname),
  ...(review.datePublished && { datePublished: review.datePublished }),
  ...(review.rating && {
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.ratingValue,
      bestRating: review.rating.bestRating ?? 5,
      worstRating: 1,
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
export const getCombinedSchema = (
  pageSchema: object,
  ...extraSchemas: object[]
) => ({
  '@context': 'https://schema.org',
  '@graph': [
    getOrganizationSchema(),
    getWebSiteSchema(),
    pageSchema,
    ...extraSchemas,
  ],
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
