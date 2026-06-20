import type { FAQItem } from '@/config/schemas';

// Preguntas frecuentes de la página de inicio.
// Fuente única usada tanto por el componente Faq como por el schema FAQPage.
export const HOME_FAQS: FAQItem[] = [
  {
    question: '¿Sois una agencia de viajes?',
    answer:
      'No, no somos una agencia de viajes. Somos planificadores de viajes personalizados. Diseñamos tu itinerario a medida, optimizamos rutas y buscamos alojamientos, actividades y recomendaciones, pero las reservas las haces tú directamente con los enlaces que te facilitamos. Esto te da total transparencia, flexibilidad y control, sin paquetes cerrados ni comisiones ocultas.',
  },
  {
    question: '¿Qué incluye exactamente vuestro servicio?',
    answer:
      'Nuestro servicio incluye la planificación completa de tu viaje, totalmente personalizada según tus gustos, presupuesto y estilo de viaje. Diseñamos un itinerario detallado día por día, optimizamos rutas y transporte, seleccionamos actividades y recomendaciones, y te damos acceso a una app de viaje con mapas digitales, lugares marcados, horarios, distancias y toda la información organizada para que puedas seguirla fácilmente desde tu móvil. También podemos buscar alojamientos y vuelos si lo necesitas.',
  },
  {
    question: '¿Cómo funciona el proceso de planificación?',
    answer:
      'Es muy sencillo. Primero, nos cuentas tu idea de viaje a través de un breve formulario. Con esa información, diseñamos una propuesta inicial y, una vez confirmada, empezamos a crear tu itinerario personalizado. Cuando está listo, te lo entregamos en una app de viaje con mapas digitales, rutas, recomendaciones y toda la información organizada día por día. Si lo necesitas, también hacemos los ajustes o revisiones incluidos en tu paquete hasta dejar el viaje perfecto.',
  },
  {
    question: '¿Trabajáis con cualquier destino?',
    answer:
      'Sí, trabajamos con prácticamente cualquier destino del mundo. Podemos planificar viajes por Europa, América, Asia, África u Oceanía, tanto en ciudades como en rutas más complejas. Si tienes un destino muy concreto o poco habitual, nos lo indicas y adaptamos el itinerario a lo que necesitas. Nuestro objetivo es crear el viaje perfecto, sea donde sea. Además, si es un destino que no hemos visitado personalmente, te lo comentaremos siempre para que lo tengas en cuenta.',
  },
  {
    question: '¿Hacéis viajes para grupos, familias o lunas de miel?',
    answer:
      'Sí, planificamos viajes para todo tipo de viajeros: parejas, familias, grupos de amigos y también lunas de miel. Adaptamos el itinerario al ritmo, intereses y necesidades de cada caso, ya sea un viaje relajado en pareja, unas vacaciones familiares con actividades para todos o una ruta más dinámica para un grupo. Solo tienes que contarnos qué tipo de viaje buscas y lo diseñamos a medida.',
  },
];
