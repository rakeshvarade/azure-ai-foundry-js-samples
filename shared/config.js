import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envFile = resolve(process.cwd(), ".env");

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

export const config = Object.freeze({
  foundry: Object.freeze({
    projectEndpoint: required("AZURE_FOUNDRY_PROJECT_ENDPOINT"),
    model: required("AZURE_FOUNDRY_MODEL"),
  }),
});