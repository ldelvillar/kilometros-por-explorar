import { Mistral } from '@mistralai/mistralai';
import { CONFIG } from '../config/index.ts';
import { validateMessage } from '../utils/validators.ts';
import { createSystemPrompt } from '../utils/prompts.ts';

export type ChatbotResult =
  | { success: true; message: string }
  | { success: false; error: string };

const GENERIC_ERROR =
  'Error procesando tu mensaje. Por favor, intenta de nuevo.';

// Crear cliente Mistral una sola vez
const mistral = new Mistral({
  apiKey: CONFIG.MISTRAL_API_KEY,
});

// Enviar un mensaje al chatbot y obtener una respuesta
export const sendMessage = async (message: unknown): Promise<ChatbotResult> => {
  try {
    // Validar el mensaje
    const validation = validateMessage(message);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Llamar a Mistral con el system prompt que incluye el contexto
    const result = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: createSystemPrompt(),
        },
        {
          role: 'user',
          content: validation.message,
        },
      ],
    });

    const content = result.choices[0]?.message.content;
    if (typeof content !== 'string') {
      console.error('Respuesta inesperada de Mistral:', content);
      return {
        success: false,
        error: GENERIC_ERROR,
      };
    }

    return {
      success: true,
      message: content,
    };
  } catch (error) {
    console.error(
      'Error en servicio de chatbot:',
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      error: GENERIC_ERROR,
    };
  }
};
