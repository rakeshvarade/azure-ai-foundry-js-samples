import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import OpenAI from "openai";

import { config } from "./config.js";

const FOUNDRY_TOKEN_SCOPE = "https://ai.azure.com/.default";

export { config };

export function createCredential(options) {
  return new DefaultAzureCredential(options);
}

export function createAIProjectClient({
  credential = createCredential(),
  endpoint = config.foundry.projectEndpoint,
  allowPreview = true,
} = {}) {
  return new AIProjectClient(endpoint, credential, { allowPreview });
}

export async function getFoundryAccessToken(
  credential = createCredential()
) {
  const tokenResponse = await credential.getToken(FOUNDRY_TOKEN_SCOPE);

  if (!tokenResponse?.token) {
    throw new Error("Microsoft Entra ID did not return a Foundry access token.");
  }

  return tokenResponse.token;
}

export function createOpenAIClient({
  credential = createCredential(),
  endpoint = config.foundry.projectEndpoint,
} = {}) {
  const baseURL = `${endpoint.replace(/\/+$/, "")}/openai/v1`;

  return new OpenAI({
    baseURL,
    apiKey: () => getFoundryAccessToken(credential),
  });
}
