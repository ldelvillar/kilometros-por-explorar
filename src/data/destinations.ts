type Category = 'cultural' | 'playa' | 'naturaleza' | 'ciudad' | 'destacados';

interface Destination {
  name: string;
  description: string;
  image: string;
  href: string;
  category: Category;
  featured?: boolean;
}

export const allDestinationsData: Destination[] = [
  // Culturales
  {
    name: 'Recorrido por Japón',
    description:
      'Sumérgete en la fascinante cultura japonesa, desde los templos zen de Kyoto hasta los rascacielos de Tokio. Descubre la perfecta armonía entre tradición milenaria y modernidad.',
    image: '/images/destinations/japan.webp',
    href: 'destinos/japon',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Marrakech y sus Alrededores',
    description:
      'Explora los vibrantes zocos, palacios y jardines de Marrakech. Sumérgete en la cultura marroquí y descubre la magia del desierto del Sahara y los montes del Atlas.',
    image: '/images/destinations/marrakech.webp',
    href: 'destinos/marrakech',
    category: 'cultural',
  },
  {
    name: 'Tailanda Exótica',
    description:
      'Explora templos dorados de Bangkok, relájate en playas paradisíacas de Phuket y saborea la auténtica cocina tailandesa. El país de las sonrisas te espera.',
    image: '/images/destinations/thailand.webp',
    href: 'destinos/tailandia',
    category: 'cultural',
  },
  {
    name: 'Kenia Salvaje',
    description:
      'Presencia la Gran Migración en el Masai Mara y conecta con la naturaleza más salvaje de África. Safari auténtico entre leones, elefantes y la cultura masái.',
    image: '/images/destinations/kenya.webp',
    href: 'destinos/kenia',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Estambul',
    description:
      'Descubre la ciudad donde Oriente y Occidente se encuentran, con su rica historia, mezquitas impresionantes y bazares vibrantes.',
    image: '/images/destinations/istanbul.webp',
    href: 'destinos/estambul',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Perú Histórico',
    description:
      'Camina por los senderos incas hasta la majestuosa ciudadela de Machu Picchu. Vive la magia de una civilización extraordinaria en los Andes peruanos.',
    image: '/images/destinations/machu-picchu.webp',
    href: 'destinos/peru',
    category: 'cultural',
  },

  // Playas
  {
    name: 'Albania Desconocida',
    description:
      'Relájate en las suaves arenas de Albania, donde la brisa marina susurra historias de relajación.',
    image: '/images/destinations/albania.webp',
    href: 'destinos/albania',
    category: 'playa',
    featured: true,
  },
  {
    name: 'Sur de Italia',
    description:
      'Encuentra tu paz en el Sur de Italia, un retiro costero donde el ritmo de las olas calma el alma.',
    image: '/images/destinations/sardinia.webp',
    href: 'destinos/sur-italia',
    category: 'playa',
  },
  {
    name: 'República Dominicana',
    description:
      'Escápate a un Paraíso Tropical, donde las aguas turquesas se encuentran con paisajes exuberantes, ofreciendo una perfecta mezcla de aventura y tranquilidad.',
    image: '/images/destinations/dominican-republic.webp',
    href: 'destinos/republica-dominicana',
    category: 'playa',
  },
  {
    name: 'Islas Griegas',
    description:
      'Navega por aguas cristalinas del Egeo y contempla los atardeceres más espectaculares desde Santorini. Vive la esencia del Mediterráneo entre casas blancas y cúpulas azules.',
    image: '/images/destinations/santorini.webp',
    href: 'destinos/santorini',
    category: 'playa',
  },

  // Naturaleza
  {
    name: 'Ruta por Islandia',
    description:
      'Explora los paisajes surrealistas de Islandia, desde cascadas majestuosas hasta campos de lava cubiertos de musgo.',
    image: '/images/destinations/iceland.webp',
    href: 'destinos/islandia',
    category: 'naturaleza',
    featured: true,
  },
  {
    name: 'Noruega Escénica',
    description:
      'Descubre los fiordos impresionantes y la naturaleza virgen de Noruega, donde cada vista es un espectáculo para los sentidos.',
    image: '/images/destinations/norway.webp',
    href: 'destinos/noruega',
    category: 'naturaleza',
  },
  {
    name: 'Norte de Italia',
    description:
      'Descubre la belleza de los lagos y montañas en el Norte de Italia, donde la cultura y la naturaleza se entrelazan en un paisaje impresionante.',
    image: '/images/destinations/northern-italy.webp',
    href: 'destinos/norte-italia',
    category: 'naturaleza',
  },
  {
    name: 'Croacia Natural',
    description:
      'Navega por la costa dálmata y descubre los lagos esmeralda de Plitvice. Croacia combina historia medieval, naturaleza pristina y aguas cristalinas del Adriático.',
    image: '/images/destinations/croatia.webp',
    href: 'destinos/croacia',
    category: 'naturaleza',
  },

  // Ciudades
  {
    name: 'Edimburgo y las Tierras Altas',
    description:
      'Descubre la rica historia y cultura de Escocia, desde el bullicio de Edimburgo hasta los paisajes impresionantes de las Tierras Altas.',
    image: '/images/destinations/edinburgh.webp',
    href: 'destinos/edinburgh',
    category: 'ciudad',
  },
  {
    name: 'París y Disneyland',
    description:
      'Descubre la magia de París, desde la Torre Eiffel hasta los encantos de Disneyland, donde los sueños se hacen realidad.',
    image: '/images/destinations/paris.webp',
    href: 'destinos/paris',
    category: 'ciudad',
  },
  {
    name: 'Praga',
    description:
      'Descubre la belleza de Praga, con su arquitectura gótica, puentes históricos y un ambiente mágico que te transportará en el tiempo.',
    image: '/images/destinations/prague.webp',
    href: 'destinos/praga',
    category: 'ciudad',
    featured: true,
  },
  {
    name: 'Roma',
    description:
      'Explora la ciudad eterna, donde cada calle y monumento cuenta una historia milenaria de poder, arte y cultura.',
    image: '/images/destinations/rome.webp',
    href: 'destinos/roma',
    category: 'ciudad',
  },
  {
    name: 'Berlín',
    description:
      'Sumérgete en la vibrante cultura de Berlín, una ciudad que combina historia, arte y modernidad en cada rincón.',
    image: '/images/destinations/berlin.webp',
    href: 'destinos/berlin',
    category: 'ciudad',
  },
  {
    name: 'Ámsterdam',
    description:
      'Explora los canales pintorescos, museos de clase mundial y la vibrante vida cultural de Ámsterdam, una ciudad diversa y llena de vida.',
    image: '/images/destinations/amsterdam.webp',
    href: 'destinos/amsterdam',
    category: 'ciudad',
  },
  {
    name: 'Londres',
    description:
      'Sumérgete en el corazón de Reino Unido, una metrópolis que combina tradición real, arte vanguardista y gastronomía internacional.',
    image: '/images/destinations/london.webp',
    href: 'destinos/londres',
    category: 'ciudad',
  },
  {
    name: 'Cracovia y Alrededores',
    description:
      'Descubre la joya histórica de Polonia, con su impresionante casco antiguo y vibrante vida nocturna. Conoce Auschwitz y las impresionantes minas de sal de Wieliczka.',
    image: '/images/destinations/krakow.webp',
    href: 'destinos/cracovia',
    category: 'ciudad',
  },
  {
    name: 'Estocolmo',
    description:
      'Descubre una ciudad construida sobre 14 islas conectadas por más de 50 puentes. Disfruta de su rica historia, cultura y diseño escandinavo, y del metro más bonito del mundo.',
    image: '/images/destinations/stockholm.webp',
    href: 'destinos/estocolmo',
    category: 'ciudad',
  },
];

export const getFeaturedDestinations = () =>
  allDestinationsData.filter(dest => dest.featured);

export const getDestinationsByCategory = (category: Category) =>
  allDestinationsData.filter(dest => dest.category === category);

export const searchDestinations = (query: string) =>
  allDestinationsData.filter(
    dest =>
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.description.toLowerCase().includes(query.toLowerCase())
  );

export const categoryLabels: Record<Category, string> = {
  destacados: 'Destinos Destacados',
  cultural: 'Viajes Culturales',
  playa: 'Escapadas de Playa',
  naturaleza: 'Naturaleza',
  ciudad: 'Ciudades Europeas',
};
