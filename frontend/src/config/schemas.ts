import type { ImageMetadata } from 'astro';
import { SITE_CONFIG } from '@/config/site';
import { getSiteUrl } from '@/utils/getUrls';

// IDs estables para enlazar nodos dentro del @graph (evita entidades duplicadas)
export const ORGANIZATION_ID = `${SITE_CONFIG.domain}/#organization`;
export const WEBSITE_ID = `${SITE_CONFIG.domain}/#website`;

// Cada página es un nodo WebPage del que cuelgan el resto de entidades
export const getWebPageId = (pathname: string) =>
  `${getSiteUrl(pathname)}#webpage`;

// El nombre del viaje debe coincidir en /destinos y en las reseñas que lo enlazan
export const getTripName = (destinationName: string, isSurprise: boolean) =>
  isSurprise ? destinationName : `Viaje a ${destinationName} a tu medida`;

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
  pathname: string,
  // Solo enlaza el breadcrumb en las páginas que lo publican
  hasBreadcrumb = false,
  // Subtipo de WebPage para páginas con una semántica más específica (p. ej. ContactPage)
  type: string = 'WebPage'
) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': getWebPageId(pathname),
  name: title,
  description: description,
  url: getSiteUrl(pathname),
  inLanguage: 'es-ES',
  isPartOf: { '@id': WEBSITE_ID },
  author: { '@id': ORGANIZATION_ID },
  ...(hasBreadcrumb && {
    breadcrumb: { '@id': `${getSiteUrl(pathname)}#breadcrumb` },
  }),
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
  touristType?: string,
  // Los packs sorpresa no declaran TouristDestination
  linkDestination = true
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
  ...(linkDestination && {
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
  }),
  ...(country && { arrivalLocation: { '@type': 'Country', name: country } }),
  provider: { '@id': ORGANIZATION_ID },
});

// Tipo para items del FAQ
export interface FAQItem {
  question: string;
  answer: string;
}

// Schema para FAQ
export const getFAQSchema = (faqs: FAQItem[], pathname: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${getSiteUrl(pathname)}#faq`,
  isPartOf: { '@id': getWebPageId(pathname) },
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
  image?: ImageMetadata,
  aboutName?: string,
  readingTimeMinutes?: number
) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${getSiteUrl(pathname)}#article`,
  headline: title,
  description: description,
  url: getSiteUrl(pathname),
  inLanguage: 'es-ES',
  datePublished: publishDate,
  dateModified: modifyDate || publishDate,
  author: { '@id': ORGANIZATION_ID },
  publisher: { '@id': ORGANIZATION_ID },
  ...(image && {
    image: {
      '@type': 'ImageObject',
      url: getSiteUrl(image.src),
      width: image.width,
      height: image.height,
    },
  }),
  mainEntityOfPage: { '@id': getWebPageId(pathname) },
  ...(aboutName && {
    about: {
      '@type': 'Place',
      name: aboutName.charAt(0).toUpperCase() + aboutName.slice(1),
    },
  }),
  ...(readingTimeMinutes && { timeRequired: `PT${readingTimeMinutes}M` }),
});

// Schema para reseñas de clientes
export const getReviewSchema = (review: {
  reviewBody: string;
  authorName: string;
  pathname: string;
  // Reseñar el propio negocio es una reseña interesada: se reseña el viaje
  trip: { name: string; pathname: string };
  name?: string;
  rating?: { ratingValue: number; bestRating?: number };
  datePublished?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  '@id': `${getSiteUrl(review.pathname)}#review`,
  ...(review.name && { name: review.name }),
  reviewBody: review.reviewBody,
  author: {
    '@type': 'Person',
    name: review.authorName,
  },
  itemReviewed: {
    '@type': 'TouristTrip',
    '@id': `${getSiteUrl(review.trip.pathname)}#trip`,
    name: review.trip.name,
    url: getSiteUrl(review.trip.pathname),
    provider: { '@id': ORGANIZATION_ID },
  },
  isPartOf: { '@id': getWebPageId(review.pathname) },
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
export const getBreadcrumbSchema = (
  items: BreadcrumbItem[],
  pathname: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${getSiteUrl(pathname)}#breadcrumb`,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.href && { item: getSiteUrl(item.href) }),
  })),
});

// Tipo para items de un listado
export interface ListItem {
  name: string;
  href: string;
}

// Schema para el listado de una página hub (/blog, /destinos, /viajeros)
export const getItemListSchema = (items: ListItem[], pathname: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${getSiteUrl(pathname)}#itemlist`,
  mainEntityOfPage: { '@id': getWebPageId(pathname) },
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: getSiteUrl(item.href),
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
