import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '@/config/site';
import { getSiteUrl } from '@/utils/getUrls';

// Genera /llms.txt (https://llmstxt.org) a partir de las colecciones de contenido, de forma que
// se mantenga al día automáticamente al publicar nuevas guías, destinos o historias de viajeros.
export const GET: APIRoute = async () => {
  const [posts, destinations, customers] = await Promise.all([
    getCollection('blog'),
    getCollection('destinations'),
    getCollection('customers'),
  ]);

  const slug = (id: string) => id.replace(/\.md$/, '');
  const item = (title: string, path: string, description: string) =>
    `- [${title}](${getSiteUrl(path)}): ${description}`;

  // Guías: más recientes primero
  const guides = [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  // Destinos: destacados primero y luego por orden alfabético
  const sortedDestinations = [...destinations].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.name.localeCompare(b.data.name, 'es');
  });

  const lines: string[] = [
    `# ${SITE_CONFIG.company.name}`,
    '',
    `> ${SITE_CONFIG.seo.defaultDescription}`,
    '',
    'Kilómetros por Explorar es un servicio español de planificación de ' +
      'viajes personalizados (con sede en Madrid) que diseña itinerarios a ' +
      'medida según los intereses y el presupuesto de cada viajero. No somos ' +
      'una agencia de viajes: planificamos tu ruta y te damos las ' +
      'recomendaciones, pero las reservas las haces tú directamente. Además ' +
      'del servicio de planificación, publicamos guías de viaje detalladas ' +
      '—presupuestos reales, rutas día a día y consejos prácticos— escritas a ' +
      'partir de experiencia propia.',
    '',
    '## Información y contacto',
    '',
    item(
      'Sobre nosotros',
      '/sobre-nosotros',
      'Quiénes somos y cómo planificamos los viajes.'
    ),
    item(
      'Contacto',
      '/contacto',
      `Solicita la planificación de tu viaje. Email: ${SITE_CONFIG.company.email}.`
    ),
    item('Blog', '/blog', 'Todas las guías de viaje, itinerarios y consejos.'),
    item('Destinos', '/destinos', 'Catálogo de destinos que planificamos.'),
    '',
    '## Guías de viaje',
    '',
    ...guides.map(p =>
      item(p.data.title, `/blog/${slug(p.id)}`, p.data.description)
    ),
    '',
    '## Destinos',
    '',
    ...sortedDestinations.map(d =>
      item(d.data.name, `/destinos/${slug(d.id)}`, d.data.shortDescription)
    ),
    '',
    '## Historias de viajeros',
    '',
    ...customers.map(c =>
      item(c.data.name, `/viajeros/${slug(c.id)}`, c.data.metaDescription)
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
