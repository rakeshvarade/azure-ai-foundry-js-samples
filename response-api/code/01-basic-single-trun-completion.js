import OpenAI from "openai";
import { DefaultAzureCredential } from "@azure/identity";

async function getToken() {
    const credential = new DefaultAzureCredential();

    const tokenResponse = await credential.getToken(
        "https://ai.azure.com/.default"
    );

    return tokenResponse.token;
}

async function main() {

    const projectEndpoint =
        "https://rakeshvarade-ai103-project.services.ai.azure.com/api/projects/rakeshvarade-1667";

    const deploymentName = "gpt-5.4-mini";

    const baseURL =
        projectEndpoint.replace(/\/+$/, "") + "/openai/v1";

    const token = await getToken();

    const client = new OpenAI({
        baseURL: baseURL,
        apiKey: token
    });

    const response = await client.responses.create({
        model: deploymentName,
        input: "Explain Azure Landing Zone in simple language in 5 bullet points.",
        max_output_tokens: 500
    });

    console.log("\nAI Response:\n");
    console.log(response.output_text);

    console.log("\nStatus:");
    console.log(response.status);

    console.log("\nModel:");
    console.log(response.model);

    console.log("\nUsage:");
    console.log(response.usage);
}

main().catch(console.error);