export type ValidationResult =
  | { valid: true; message: string }
  | { valid: false; error: string };

// Validar que el mensaje sea válido
export const validateMessage = (message: unknown): ValidationResult => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'El mensaje es requerido' };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return { valid: false, error: 'El mensaje no puede estar vacío' };
  }

  if (trimmedMessage.length > 5000) {
    return {
      valid: false,
      error: 'El mensaje es demasiado largo (máximo 5000 caracteres)',
    };
  }

  return { valid: true, message: trimmedMessage };
};
