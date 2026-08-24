import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:4321',
  'https://www.kilometrosporexplorar.es',
  'https://kilometrosporexplorar.es',
];

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
}: { acceptedOrigins?: string[] } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (!origin || acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  });
