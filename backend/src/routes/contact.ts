import { Router } from 'express';
import { sendContact } from '../services/contact.ts';
import { contactRateLimit } from '../middlewares/rateLimit.ts';

export const contactRouter = Router();

contactRouter.post('/', contactRateLimit, async (req, res) => {
  try {
    const { name, surname, email, phone, message, privacy } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y mensaje son requeridos',
      });
    }

    const result = await sendContact({
      name,
      surname,
      email,
      phone,
      message,
      privacy,
    });

    if (!result.success) {
      return res.status(502).json({
        success: false,
        error: result.error,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      'Error en ruta de contacto:',
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      success: false,
      error:
        'No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
    });
  }
});
