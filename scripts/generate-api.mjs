import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Load .env file
const envFile = readFileSync('.env', 'utf-8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

// Set environment variables
Object.assign(process.env, envVars);

// Run openapi-typescript
const apiUrl = process.env.NUXT_PUBLIC_PESONA_API_URL;
const command = `openapi-typescript ${apiUrl}/openapi.json -o app/types/pesona-hub-api.d.ts`;

console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
