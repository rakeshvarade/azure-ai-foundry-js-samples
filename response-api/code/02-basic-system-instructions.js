import OpenAI from "openai";
import { DefaultAzureCredential } from "@azure/identity";
import { config } from "../../shared/config.js";

// Get Microsoft Entra ID token
async function getToken() {
    const credential = new DefaultAzureCredential();

    const tokenResponse = await credential.getToken(
        "https://ai.azure.com/.default"
    );

    return tokenResponse.token;
}

async function main() {

    // Read project configuration from shared/config.js
    const projectEndpoint = config.foundry.projectEndpoint;

    // IMPORTANT:
    // This should be your deployment name.
    const deploymentName = config.foundry.model;

    // Build the OpenAI-compatible endpoint
    const baseURL =
        projectEndpoint.replace(/\/+$/, "") + "/openai/v1";

    // Get Microsoft Entra ID token
    const token = await getToken();

    // Create OpenAI client
    const client = new OpenAI({
        baseURL,
        apiKey: token
    });

    // Call Responses API
    const response = await client.responses.create({

        model: deploymentName,

        // Instructions define how the AI should behave
        instructions: `
            You are an experienced Microsoft Azure Cloud Architect.

            Explain technical concepts in simple language.

            When answering:
            - Focus on Azure best practices.
            - Use bullet points where appropriate.
            - Explain architecture decisions clearly.
            - Highlight security, scalability, and availability.
            - Keep the answer suitable for an enterprise customer.
        `,

        // Actual user question
        input: `
            Explain why hub-and-spoke network architecture
            is useful for an enterprise Azure environment.
        `,

        max_output_tokens: 800
    });

    console.log("\n============================");
    console.log("AI RESPONSE");
    console.log("============================\n");

    console.log(response.output_text);

    console.log("\n============================");
    console.log("RESPONSE INFORMATION");
    console.log("============================");

    console.log("Status:", response.status);
    console.log("Model:", response.model);
    console.log("Output Tokens:", response.usage?.output_tokens);
}

main().catch((error) => {

    console.error("\nApplication failed.");

    if (error instanceof Error) {
        console.error("Message:", error.message);
    } else {
        console.error(error);
    }

    process.exitCode = 1;
});