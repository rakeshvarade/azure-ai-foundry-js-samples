import {
  config,
  createAIProjectClient,
} from "../../shared/foundry.js";

async function main() {
  // Read the validated project endpoint and model deployment from .env.
  const projectEndpoint = config.foundry.projectEndpoint;
  const modelDeploymentName = config.foundry.model;

  console.log("Project endpoint:", projectEndpoint);
  console.log("Model deployment:", modelDeploymentName);

  // The shared factory authenticates with DefaultAzureCredential.
  const projectClient = createAIProjectClient();

  console.log("AIProjectClient created successfully.");

  // Obtain the OpenAI-compatible client associated with this Foundry project.
  const openAIClient = projectClient.getOpenAIClient();

  // Adding web_search allows the model to retrieve current public information.
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

// Report Azure SDK and service errors without hiding diagnostic information.
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