import fs from 'node:fs';

if (fs.existsSync('.env')) process.loadEnvFile();

export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
};
