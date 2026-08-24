import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contextPath = path.join(__dirname, '../data/context.md');

// Cargar contexto desde el archivo MD
let CHATBOT_CONTEXT = '';

try {
  CHATBOT_CONTEXT = fs.readFileSync(contextPath, 'utf-8');
  console.log('Contexto del chatbot cargado correctamente');
} catch (error) {
  console.error(
    'Error cargando contexto del chatbot:',
    error instanceof Error ? error.message : error
  );
  CHATBOT_CONTEXT = '';
}

// Crear el system prompt con el contexto
export const createSystemPrompt = () => `
Eres un asistente virtual amable y profesional de Kilómetros por Explorar.

Usa la siguiente información para responder las preguntas de los usuarios:

${CHATBOT_CONTEXT}

INSTRUCCIONES IMPORTANTES:
- Responde siempre en español
- Sé cálido, entusiasta y servicial
- Personaliza tus respuestas según el usuario
- Cuando no tengas información clara, sugiere contactar al equipo
- Proporciona recomendaciones de destinos basadas en sus preferencias
- Sé honesto sobre las limitaciones de tu información
`;
