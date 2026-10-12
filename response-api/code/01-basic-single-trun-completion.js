import OpenAI from "openai";
import { DefaultAzureCredential } from "@azure/identity";
import { config } from "../../shared/config.js";

/**
 * Get a Microsoft Entra ID access token
 * for Microsoft Foundry.
 */
async function getToken() {
  const credential = new DefaultAzureCredential();

  const tokenResponse = await credential.getToken(
    "https://ai.azure.com/.default"
  );

  return tokenResponse.token;
}

async function main() {
  console.log("Starting Microsoft Foundry Responses API sample...\n");

  // 1. Read configuration from shared/config.js

  const projectEndpoint = config.foundry.projectEndpoint;
  const deploymentName = config.foundry.model;


  // 2. Build the OpenAI-compatible API endpoint

  const baseURL =
    projectEndpoint.replace(/\/+$/, "") + "/openai/v1";


  // 3. Get Microsoft Entra ID token

  const token = await getToken();


  // 4. Create OpenAI client

  const client = new OpenAI({
    baseURL,
    apiKey: token,
  });


  // 5. Call the Responses API

  const response = await client.responses.create({
    model: deploymentName,
    input:
      "Explain Azure Landing Zone in simple language in 5 bullet points.",
    max_output_tokens: 500,
  });

  // ---------------------------------------------------------
  // 6. Display response
  // ---------------------------------------------------------
  console.log("AI Response:\n");
  console.log(response.output_text);

  console.log("\nStatus:");
  console.log(response.status);

  console.log("\nModel:");
  console.log(response.model);

  console.log("\nUsage:");
  console.log(response.usage);
}

main().catch((error) => {
  console.error("\nApplication failed.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});