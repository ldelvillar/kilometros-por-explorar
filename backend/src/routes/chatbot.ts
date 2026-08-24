import { Router } from 'express';
import { sendMessage } from '../services/chatbot.ts';
import { chatbotRateLimit } from '../middlewares/rateLimit.ts';

export const chatbotRouter = Router();

chatbotRouter.post('/', chatbotRateLimit, async (req, res) => {
  try {
    const { message } = req.body;

    console.log('Mensaje recibido para chatbot:', message);

    // Enviar mensaje al servicio de chatbot
    const result = await sendMessage(message);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(
      'Error en ruta de chatbot:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      success: false,
      error: 'Error procesando tu mensaje. Por favor, intenta de nuevo.',
    });
  }
});
