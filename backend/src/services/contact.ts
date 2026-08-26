import { CONFIG } from '../config/index.ts';

export type ContactResult =
  | { success: true }
  | { success: false; error: string };

export interface ContactPayload {
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  message: string;
  privacy?: string;
}

const GENERIC_ERROR =
  'No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.';

// Reenviar la consulta al webhook de Make.com que gestiona el buzón
export const sendContact = async (
  payload: ContactPayload
): Promise<ContactResult> => {
  const webhookUrl = CONFIG.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('CONTACT_WEBHOOK_URL no está configurado');
    return { success: false, error: GENERIC_ERROR };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Error del webhook de contacto:', response.status);
      return { success: false, error: GENERIC_ERROR };
    }

    return { success: true };
  } catch (error) {
    console.error(
      'Error en servicio de contacto:',
      error instanceof Error ? error.message : error
    );
    return { success: false, error: GENERIC_ERROR };
  }
};
