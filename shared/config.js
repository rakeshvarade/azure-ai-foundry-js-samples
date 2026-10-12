import { resolve } from "node:path";

// Expected execution location:
// C:\foundry\azure-ai-foundry-js-samples
process.loadEnvFile(resolve(process.cwd(), ".env"));

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
  foundry: {
    projectEndpoint: required("AZURE_FOUNDRY_PROJECT_ENDPOINT"),
    model: required("AZURE_FOUNDRY_MODEL"),
  },
});