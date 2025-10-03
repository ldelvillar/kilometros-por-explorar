type Category = 'cultural' | 'playa' | 'naturaleza' | 'ciudad' | 'destacados';

export interface Destination {
  name: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  href: string;
  category: Category;
  featured?: boolean;
}

export const allDestinationsData: Destination[] = [
  // Culturales
  {
    name: 'Recorrido por Japón',
    shortDescription:
      'Sumérgete en la fascinante cultura japonesa, desde los templos zen de Kyoto hasta los rascacielos de Tokio. Descubre la perfecta armonía entre tradición milenaria y modernidad.',
    longDescription:
      'Descubre la perfecta armonía entre tradición y modernidad en Japón. Explora Tokio con sus rascacielos y santuarios, viaja en el tren bala hasta Kyoto para caminar entre templos zen y torii rojos. Vive la experiencia única de hospedarte en un ryokan tradicional y contemplar el majestuoso monte Fuji mientras te relajas en aguas termales naturales.',
    image: '/images/destinations/japan.webp',
    href: 'japon',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Marrakech y sus Alrededores',
    shortDescription:
      'Explora los vibrantes zocos, palacios y jardines de Marrakech. Sumérgete en la cultura marroquí y descubre la magia del desierto del Sahara y los montes del Atlas.',
    longDescription:
      'Sumérgete en la magia de las Mil y Una Noches explorando los zocos aromáticos y palacios de Marrakech. Aventúrate en el desierto del Sahara montando camellos hasta campamentos beréberes bajo cielos estrellados. Completa la experiencia visitando pueblos tradicionales del Atlas y relajándote en un hammam auténtico.',
    image: '/images/destinations/marrakech.webp',
    href: 'marrakech',
    category: 'cultural',
  },
  {
    name: 'Tailanda Exótica',
    shortDescription:
      'Explora templos dorados de Bangkok, relájate en playas paradisíacas de Phuket y saborea la auténtica cocina tailandesa. El país de las sonrisas te espera.',
    longDescription:
      'Combina cultura milenaria y playas paradisíacas en el país de las sonrisas. Explora templos dorados y palacios reales en Bangkok, aprende a cocinar auténtica comida tailandesa en Chiang Mai y relájate en las cristalinas aguas de Phuket. Una experiencia completa que incluye masajes tradicionales, snorkel en corales tropicales y atardeceres espectaculares.',
    image: '/images/destinations/thailand.webp',
    href: 'tailandia',
    category: 'cultural',
  },
  {
    name: 'Kenia Salvaje',
    shortDescription:
      'Presencia la Gran Migración en el Masai Mara y conecta con la naturaleza más salvaje de África. Safari auténtico entre leones, elefantes y la cultura masái.',
    longDescription:
      'Vive la Gran Migración en Masai Mara y observa millones de ñus, cebras y gacelas cruzar el río mientras depredadores acechan en la sabana. Disfruta de vuelos en globo aerostático al amanecer, visitas auténticas a poblados masái y noches bajo el cielo estrellado africano. Una experiencia única en la cuna de la humanidad con vistas al Kilimanjaro.',
    image: '/images/destinations/kenya.webp',
    href: 'kenia',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Estambul',
    shortDescription:
      'Descubre la ciudad donde Oriente y Occidente se encuentran, con su rica historia, mezquitas impresionantes y bazares vibrantes.',
    longDescription:
      'Explora la única ciudad que abraza dos continentes, desde Santa Sofía y la Mezquita Azul hasta la misteriosa Cisterna Basílica. Regatea en el Gran Bazar, navega por el Bósforo admirando palacios otomanos y disfruta de la auténtica cocina turca. Una experiencia completa que incluye hammam tradicional y el exótico Bazar de las Especias.',
    image: '/images/destinations/istanbul.webp',
    href: 'estambul',
    category: 'cultural',
    featured: true,
  },
  {
    name: 'Perú Histórico',
    shortDescription:
      'Camina por los senderos incas hasta la majestuosa ciudadela de Machu Picchu. Vive la magia de una civilización extraordinaria en los Andes peruanos.',
    longDescription:
      'Recorre el corazón del Imperio Inca desde Cusco hasta Machu Picchu por el legendario Camino Inca. Explora Lima y su gastronomía reconocida mundialmente, el Valle Sagrado con sus mercados tradicionales y terrazas agrícolas. Una experiencia que incluye ceremonias a la Pachamama y el amanecer en la Puerta del Sol de la ciudadela perdida.',
    image: '/images/destinations/machu-picchu.webp',
    href: 'peru',
    category: 'cultural',
  },

  // Playas
  {
    name: 'Albania Desconocida',
    shortDescription:
      'Relájate en las suaves arenas de Albania, donde la brisa marina susurra historias de relajación.',
    longDescription:
      'Descubre la joya oculta de los Balcanes con playas vírgenes en la Riviera Albania y el "Caribe albanés" de Ksamil. Explora Tirana con su arte urbano colorido, la histórica Berat con sus mil ventanas, y los Alpes Albaneses con pueblos donde las tradiciones ancestrales siguen vivas. Una experiencia auténtica con hospitalidad balcánica.',
    image: '/images/destinations/albania.webp',
    href: 'albania',
    category: 'playa',
    featured: true,
  },
  {
    name: 'Sur de Italia',
    shortDescription:
      'Encuentra tu paz en el Sur de Italia, un retiro costero donde el ritmo de las olas calma el alma.',
    longDescription:
      'Enamórate del auténtico sur italiano explorando Sicilia, Calabria y Apulia. Descubre desde los trulli únicos de Alberobello hasta las playas vírgenes de Tropea, pasando por el volcán Etna y pueblos costeros encantadores. Una experiencia gastronómica inolvidable con pasta fresca, burrata auténtica y trattorias familiares junto al mar.',
    image: '/images/destinations/sardinia.webp',
    href: 'sur-italia',
    category: 'playa',
  },
  {
    name: 'República Dominicana',
    shortDescription:
      'Escápate a un Paraíso Tropical, donde las aguas turquesas se encuentran con paisajes exuberantes, ofreciendo una perfecta mezcla de aventura y tranquilidad.',
    longDescription:
      'Vive el Caribe auténtico combinando playas paradisíacas de Punta Cana con aventura tropical en Samaná. Observa ballenas jorobadas, nada en cascadas como El Limón y explora la Ciudad Colonial de Santo Domingo. Una experiencia completa con snorkel, clases de merengue y degustaciones de ron dominicano.',
    image: '/images/destinations/dominican-republic.webp',
    href: 'republica-dominicana',
    category: 'playa',
  },
  {
    name: 'Islas Griegas',
    shortDescription:
      'Navega por aguas cristalinas del Egeo y contempla los atardeceres más espectaculares desde Santorini. Vive la esencia del Mediterráneo entre casas blancas y cúpulas azules.',
    longDescription:
      'Descubre la magia del Egeo saltando entre las islas griegas más emblemáticas. Enamórate de los atardeceres desde Oia en Santorini, el ambiente cosmopolita de Mykonos y pueblos pesqueros auténticos en Paros. Una experiencia completa con navegación en catamarán, tabernas con vista al mar y degustaciones de vinos volcánicos únicos.',
    image: '/images/destinations/santorini.webp',
    href: 'santorini',
    category: 'playa',
  },

  // Naturaleza
  {
    name: 'Ruta por Islandia',
    shortDescription:
      'Explora los paisajes surrealistas de Islandia, desde cascadas majestuosas hasta campos de lava cubiertos de musgo.',
    longDescription:
      'Embárcate en una aventura épica por la famosa Ring Road de Islandia, la tierra de hielo y fuego que te transportará a paisajes de otro mundo. Visitarás el increíble Círculo Dorado, géiseres, cascadas y cataratas que parecen sacadas de películas, y parques nacionales como Þingvellir. También verás las playas de arena negra, glaciares, acantilados dramáticos y campos de lava. Podrás bañarte en aguas termales como el Blue Lagoon y fuentes naturales ocultas, ver ballenas desde Húsavík, adentrarte en cuevas de hielo en glaciares, y si viajas en invierno, la búsqueda de las místicas auroras boreales bajo cielos despejados.',
    image: '/images/destinations/iceland.webp',
    href: 'islandia',
    category: 'naturaleza',
    featured: true,
  },
  {
    name: 'Noruega Escénica',
    shortDescription:
      'Descubre los fiordos impresionantes y la naturaleza virgen de Noruega, donde cada vista es un espectáculo para los sentidos.',
    longDescription:
      'Navega por los majestuosos fiordos como Geirangerfjord y Nærøyfjord, donde cascadas se precipitan desde acantilados verticales. Recorre carreteras panorámicas épicas como Trollstigen y descubre pueblos pesqueros en las islas Lofoten. Una experiencia completa con senderismo a Preikestolen, avistamiento de ballenas y la búsqueda de auroras boreales en invierno.',
    image: '/images/destinations/norway.webp',
    href: 'noruega',
    category: 'naturaleza',
  },
  {
    name: 'Norte de Italia',
    shortDescription:
      'Descubre la belleza de los lagos y montañas en el Norte de Italia, donde la cultura y la naturaleza se entrelazan en un paisaje impresionante.',
    longDescription:
      'Combina la romántica belleza del Lago de Como con las majestuosas Dolomitas y los canales únicos de Venecia. Explora villas aristocráticas, senderos alpinos con vistas espectaculares y degusta Amarone en bodegas del Véneto. Una experiencia completa con clases de cocina italiana, góndolas privadas y la auténtica tradición culinaria.',
    image: '/images/destinations/northern-italy.webp',
    href: 'norte-italia',
    category: 'naturaleza',
  },
  {
    name: 'Croacia Natural',
    shortDescription:
      'Navega por la costa dálmata y descubre los lagos esmeralda de Plitvice. Croacia combina historia medieval, naturaleza pristina y aguas cristalinas del Adriático.',
    longDescription:
      'Camina por pasarelas de madera sobre los 16 lagos en terrazas de Plitvice, conectados por cascadas turquesas como de cuento de hadas. Explora Dubrovnik, la "Perla del Adriático" con murallas medievales, y las islas croatas como Hvar con campos de lavanda. Incluye navegación en catamarán, degustaciones de vinos istrios y cenas de mariscos en konobas tradicionales.',
    image: '/images/destinations/croatia.webp',
    href: 'croacia',
    category: 'naturaleza',
  },

  // Ciudades
  {
    name: 'Edimburgo y las Tierras Altas',
    shortDescription:
      'Descubre la rica historia y cultura de Escocia, desde el bullicio de Edimburgo hasta los paisajes impresionantes de las Tierras Altas.',
    longDescription:
      'Explora el imponente Castillo de Edimburgo y camina por la Royal Mile hasta el Palacio de Holyroodhouse en esta ciudad medieval. Aventúrate a las Tierras Altas para descubrir lochs cristalinos, castillos en ruinas como Eilean Donan y paisajes épicos de brezo púrpura. Disfruta de degustaciones de whisky escocés, música de gaitas y la rica cultura celta.',
    image: '/images/destinations/edinburgh.webp',
    href: 'edimburgo',
    category: 'ciudad',
  },
  {
    name: 'París y Disneyland',
    shortDescription:
      'Descubre la magia de París, desde la Torre Eiffel hasta los encantos de Disneyland, donde los sueños se hacen realidad.',
    longDescription:
      'Combina los encantos clásicos de la Ciudad de la Luz con la fantasía de Disneyland Paris. Este es el viaje ideal para hacer en familia o en pareja. Los días en Disneyland Paris serán pura magia. Los más pequeños vivirán encuentros con sus personajes favoritos, mientras que toda la familia disfrutará de espectáculos y paradas únicas.',
    image: '/images/destinations/paris.webp',
    href: 'paris',
    category: 'ciudad',
  },
  {
    name: 'Praga',
    shortDescription:
      'Descubre la belleza de Praga, con su arquitectura gótica, puentes históricos y un ambiente mágico que te transportará en el tiempo.',
    longDescription:
      'Explora la "Ciudad Dorada" desde la Plaza de la Ciudad Vieja con su famoso Reloj Astronómico hasta el legendario Puente de Carlos con estatuas barrocas. Visita el Castillo de Praga, el más grande del mundo, y la Catedral de San Vito con sus impresionantes vidrieras. Descubre la tradición cervecera checa en tabernas históricas y disfruta de conciertos de música clásica en iglesias barrocas.',
    image: '/images/destinations/prague.webp',
    href: 'praga',
    category: 'ciudad',
    featured: true,
  },
  {
    name: 'Roma',
    shortDescription:
      'Explora la ciudad eterna, donde cada calle y monumento cuenta una historia milenaria de poder, arte y cultura.',
    longDescription:
      'Camina por 2.800 años de historia desde el icónico Coliseo y el Foro Romano hasta la Capilla Sixtina de Miguel Ángel en el Vaticano. Lanza tu moneda en la Fontana di Trevi, explora el auténtico barrio de Trastevere y disfruta de la dolce vita. Saborea la cocina romana auténtica con carbonara, cacio e pepe y supplì en trattorias familiares.',
    image: '/images/destinations/rome.webp',
    href: 'roma',
    category: 'ciudad',
  },
  {
    name: 'Berlín',
    shortDescription:
      'Sumérgete en la vibrante cultura de Berlín, una ciudad que combina historia, arte y modernidad en cada rincón.',
    longDescription:
      'Explora los restos del Muro de Berlín en East Side Gallery, el Memorial del Holocausto y la Puerta de Brandemburgo, testigos de la historia europea. Descubre la Isla de los Museos con el busto de Nefertiti y barrios alternativos como Kreuzberg con galerías underground. Disfruta de tours en bicicleta, la nueva cocina berlinesa y la legendaria vida nocturna.',
    image: '/images/destinations/berlin.webp',
    href: 'berlin',
    category: 'ciudad',
  },
  {
    name: 'Ámsterdam',
    shortDescription:
      'Explora los canales pintorescos, museos de clase mundial y la vibrante vida cultural de Ámsterdam, una ciudad diversa y llena de vida.',
    longDescription:
      'Navega por los famosos canales en forma de herradura, Patrimonio de la Humanidad, con casas del siglo XVII de fachadas inclinadas. Descubre obras maestras de Rembrandt y Van Gogh en el Rijksmuseum y explora barrios únicos como el Jordaan y el Barrio Rojo. Disfruta de recorridos en bicicleta, degustaciones de quesos holandeses y cruceros al atardecer con puentes iluminados.',
    image: '/images/destinations/amsterdam.webp',
    href: 'amsterdam',
    category: 'ciudad',
  },
  {
    name: 'Londres',
    shortDescription:
      'Sumérgete en el corazón de Reino Unido, una metrópolis que combina tradición real, arte vanguardista y gastronomía internacional.',
    longDescription:
      'Explora desde el Palacio de Buckingham y la Torre de Londres hasta el Big Ben y Westminster en esta metrópolis cosmopolita. Visita museos gratuitos como el British Museum, la Tate Modern y barrios icónicos como Camden y Notting Hill. Disfruta de obras en el West End, tours en autobuses rojos, pub crawls históricos y la auténtica cultura británica.',
    image: '/images/destinations/london.webp',
    href: 'londres',
    category: 'ciudad',
  },
  {
    name: 'Cracovia y Alrededores',
    shortDescription:
      'Descubre la joya histórica de Polonia, con su impresionante casco antiguo y vibrante vida nocturna. Conoce Auschwitz y las impresionantes minas de sal de Wieliczka.',
    longDescription:
      'Explora el casco histórico Patrimonio de la Humanidad con la Plaza del Mercado Principal medieval y la Basílica de Santa María con su altar gótico. Visita el emotivo memorial de Auschwitz-Birkenau y desciende a las Minas de Sal de Wieliczka con esculturas talladas en sal. Disfruta de pierogi, vodka premium y la vibrante vida nocturna del barrio judío de Kazimierz.',
    image: '/images/destinations/krakow.webp',
    href: 'cracovia',
    category: 'ciudad',
  },
  {
    name: 'Estocolmo',
    shortDescription:
      'Descubre una ciudad construida sobre 14 islas conectadas por más de 50 puentes. Disfruta de su rica historia, cultura y diseño escandinavo, y del metro más bonito del mundo.',
    longDescription:
      'Explora Gamla Stan con callejuelas empedradas hasta el Palacio Real y descubre el Museo Vasa con un barco de guerra del siglo XVII. Recorre el famoso metro considerado la galería de arte más larga del mundo y las islas como Djurgården y Södermalm. Disfruta de saunas auténticas, cocina nórdica y excursiones por el archipiélago de 30.000 islas.',
    image: '/images/destinations/stockholm.webp',
    href: 'estocolmo',
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
      dest.shortDescription.toLowerCase().includes(query.toLowerCase())
  );

export const categoryLabels: Record<Category, string> = {
  destacados: 'Destinos Destacados',
  cultural: 'Viajes Culturales',
  playa: 'Escapadas de Playa',
  naturaleza: 'Naturaleza',
  ciudad: 'Ciudades Europeas',
};
