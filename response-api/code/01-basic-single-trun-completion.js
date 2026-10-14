import {
  config,
  createOpenAIClient,
} from "../../shared/foundry.js";

async function main() {
  console.log("Starting Microsoft Foundry Responses API sample...\n");

  // 1. Read configuration from shared/config.js

  const projectEndpoint = config.foundry.projectEndpoint;
  const deploymentName = config.foundry.model;


  // 2. Create an authenticated OpenAI client

  const client = createOpenAIClient({ endpoint: projectEndpoint });


  // 3. Call the Responses API

  const response = await client.responses.create({
    model: deploymentName,
    input:
      "Explain Azure Landing Zone in simple language in 5 bullet points.",
    max_output_tokens: 500,
  });

  // ---------------------------------------------------------
  // 4. Display response
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