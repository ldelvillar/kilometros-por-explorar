import fs from 'node:fs';

// Forma mínima de vercel.json: solo lo que hace falta para llegar a la CSP.
type VercelHeader = { key: string; value: string };
type VercelConfig = { headers?: { headers?: VercelHeader[] }[] };

const VERCEL_CONFIG = 'vercel.json';

// Endpoints que el navegador llama con fetch: cada uno necesita su origen
// declarado en connect-src o la petición se bloquea.
const ENDPOINT_VARS = [
  'PUBLIC_CONTACT_FORM_ENDPOINT',
  'PUBLIC_CHATBOT_WEBHOOK_ENDPOINT',
];

// Las variables reales del entorno (Vercel) mandan; `.env` cubre el resto
// en local, igual que hace el backend.
const loadEnv = () => {
  if (fs.existsSync('.env')) process.loadEnvFile();
};

// Los orígenes permitidos por la directiva connect-src de la CSP.
const getConnectSrc = () => {
  const config: VercelConfig = JSON.parse(
    fs.readFileSync(VERCEL_CONFIG, 'utf8')
  );

  const csp = (config.headers ?? [])
    .flatMap(rule => rule.headers ?? [])
    .find(header => header.key.toLowerCase() === 'content-security-policy');

  const directive = (csp?.value ?? '')
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('connect-src'));

  if (!directive) {
    throw new Error(
      `No se ha encontrado la directiva "connect-src" en la CSP de ${VERCEL_CONFIG}, así que no se puede comprobar que los endpoints estén permitidos.`
    );
  }

  return directive.split(/\s+/).slice(1);
};

/**
 * La CSP de `vercel.json` repite los hosts que viven en las variables
 * `PUBLIC_*`. Cambiar uno sin el otro solo falla en producción —`astro dev` no
 * envía cabeceras CSP—, así que la discrepancia se comprueba aquí, al construir.
 */
export const assertCspAllowsEndpoints = () => {
  loadEnv();
  const connectSrc = getConnectSrc();

  for (const name of ENDPOINT_VARS) {
    const endpoint = process.env[name];
    // Que falte la variable ya lo reporta el `env.schema` de Astro, y mejor.
    if (!endpoint) continue;

    let origin: string;
    try {
      origin = new URL(endpoint).origin;
    } catch {
      throw new Error(
        `El valor de "${name}" no es una URL válida: "${endpoint}".`
      );
    }

    if (!connectSrc.includes(origin)) {
      throw new Error(
        `El origen "${origin}" de "${name}" no está en la directiva "connect-src" de la CSP de ${VERCEL_CONFIG}, así que el navegador bloquearía la petición en producción. Añádelo a la cabecera.`
      );
    }
  }
};
