import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

import { config } from "../../shared/config.js";

async function main() {
  const projectEndpoint = config.foundry.projectEndpoint;
  const modelDeploymentName = config.foundry.model;

  console.log("Project endpoint:", projectEndpoint);
  console.log("Model deployment:", modelDeploymentName);

  const credential = new DefaultAzureCredential();

  // Preview support is required by some Foundry project features and SDK builds.
  const projectClient = new AIProjectClient(
    projectEndpoint,
    credential,
    {
      allowPreview: true,
    }
  );

  console.log("AIProjectClient created successfully.");

  const openAIClient = projectClient.getOpenAIClient();

  const response = await openAIClient.responses.create({
    model: modelDeploymentName,
    input: "What are the latest Microsoft Foundry announcements?",
    tools: [
      {
        type: "web_search",
      },
    ],
  });

  console.log("\nAnswer:");
  console.log(response.output_text);
}

main().catch((error) => {
  console.error("\nRequest failed");
  console.error("================");

  console.error("Name:", error?.name);
  console.error("Message:", error?.message);
  console.error("Code:", error?.code);
  console.error("Status:", error?.statusCode ?? error?.status);

  if (error?.details) {
    console.error("Details:", JSON.stringify(error.details, null, 2));
  }

  console.error("\nFull error:");
  console.error(error);

  process.exitCode = 1;
});