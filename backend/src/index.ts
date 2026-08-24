import express from 'express';
import { corsMiddleware } from './middlewares/cors.ts';
import { chatbotRouter } from './routes/chatbot.ts';
import { CONFIG } from './config/index.ts';

const app = express();
app.use(express.json());
app.use(corsMiddleware());

app.disable('x-powered-by');

app.use('/chatbot', chatbotRouter);

app.listen(CONFIG.PORT, () => {
  console.log(
    `Servidor escuchando en el puerto http://localhost:${CONFIG.PORT}`
  );
});
