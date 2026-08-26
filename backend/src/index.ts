import express from 'express';
import { corsMiddleware } from './middlewares/cors.ts';
import { chatbotRouter } from './routes/chatbot.ts';
import { contactRouter } from './routes/contact.ts';
import { CONFIG } from './config/index.ts';

const app = express();
app.use(express.json());
app.use(corsMiddleware());

app.disable('x-powered-by');

app.set('trust proxy', 1);

app.use('/chatbot', chatbotRouter);
app.use('/contact', contactRouter);

app.listen(CONFIG.PORT, () => {
  console.log(
    `Servidor escuchando en el puerto http://localhost:${CONFIG.PORT}`
  );
});
