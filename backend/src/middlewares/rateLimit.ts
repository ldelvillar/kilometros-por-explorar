import rateLimit from 'express-rate-limit';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 30;

export const chatbotRateLimit = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error:
      'Has enviado demasiados mensajes seguidos. Vuelve a intentarlo dentro de un rato.',
  },
});
