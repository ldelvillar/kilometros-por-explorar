import rateLimit from 'express-rate-limit';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 30;

const createRateLimit = (message: string) =>
  rateLimit({
    windowMs: WINDOW_MS,
    limit: MAX_REQUESTS,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      success: false,
      error: message,
    },
  });

export const chatbotRateLimit = createRateLimit(
  'Has enviado demasiados mensajes seguidos. Vuelve a intentarlo dentro de un rato.'
);

export const contactRateLimit = createRateLimit(
  'Has enviado demasiadas solicitudes seguidas. Vuelve a intentarlo dentro de un rato.'
);
