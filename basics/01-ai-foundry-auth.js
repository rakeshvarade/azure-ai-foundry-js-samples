/*
 * Default authentication in Azure AI Foundry
 *
 * This sample uses DefaultAzureCredential to authenticate with Microsoft Entra
 * ID instead of an API key. It tries supported credential sources in order,
 * such as environment credentials, managed identity, and signed-in developer
 * tools. Locally, you can sign in with the Azure CLI using `az login`.
 * Creating a credential or client does not prove authentication succeeded;
 * the SDK obtains a token when the first service request needs one.
 *
 * Program flow:
 * 1. Read the endpoint and model deployment name from shared/config.js.
 * 2. Create a credential and pass it to the Foundry project client.
 * 3. Get an authenticated OpenAI client and send a small Responses API request.
 * 4. Print the model's answer, or report a failure without logging credentials.
 *
 * Before running:
 * - Use Node.js 22 LTS or newer and install dependencies with `npm install`.
 * - In the repository-root .env file, set AZURE_FOUNDRY_PROJECT_ENDPOINT and
 *   AZURE_FOUNDRY_MODEL. The model value must be your deployment name.
 *   shared/config.js loads this file from the current working directory.
 * - Use a project endpoint in this form:
 *   https://<resource>.services.ai.azure.com/api/projects/<project>
 * - Sign in to the tenant containing your project with `az login`.
 * - Have an administrator grant your identity an appropriate data-plane role,
 *   such as Azure AI User, scoped to the project.
 * - From the repository root, run: node .\basics\01-ai-foundry-auth.js
 *
 * Security:
 * - No API key or client secret is required for Azure CLI authentication.
 * - Never commit .env files or print access tokens.
 * - The SDK handles token acquisition and refresh; do not store tokens yourself.
 * - For Azure-hosted production apps, prefer an explicitly configured
 *   ManagedIdentityCredential so the identity choice is deterministic.
 *
 * No custom helper functions are defined; configuration stays in its shared
 * module, while the authentication steps remain visible here.
 */

import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import { config } from "../shared/config.js";

try {
  const projectEndpoint = config.foundry.projectEndpoint;
  const deploymentName = config.foundry.model;

  // A credential chain is not a login prompt. Sign in before running locally.
  const credential = new DefaultAzureCredential();
  const projectClient = new AIProjectClient(projectEndpoint, credential);

  // Reuse the project's endpoint and credential without manually handling tokens.
  const client = projectClient.getOpenAIClient();

  // A successful request verifies both authentication and access to the model.
  const response = await client.responses.create({
    model: deploymentName,
    input: "Explain keyless authentication in Azure AI Foundry in three short sentences.",
    max_output_tokens: 300,
    store: false,
  });

  if (!response.output_text?.trim()) {
    throw new Error("The model returned no text.");
  }

  console.log("Authenticated request succeeded.\n");
  console.log(response.output_text);
} catch (error) {
  // Avoid dumping SDK errors: they can contain request or environment details.
  console.error("The Foundry authentication sample failed.");

  if (error.status === 401 || error.name === "AggregateAuthenticationError"
      || error.name === "CredentialUnavailableError"
      || error.name === "AuthenticationRequiredError") {
    console.error("Check your Azure sign-in and tenant. For local use, run az login.");
  } else if (error.status === 403) {
    console.error("Check your identity's project permissions and network access.");
  } else if (error.status === 404) {
    console.error("Check the project endpoint and model deployment name in .env.");
  } else {
    console.error(
      "Check your configuration, credential setup, network connection, and model availability.",
    );
  }

  process.exitCode = 1;
}