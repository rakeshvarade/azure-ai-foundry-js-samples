// ai-tools/code/01-tools-code-interpreter.js

import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

import { config } from "../../shared/config.js";


async function main() {
  try {
    console.log("Starting Code Interpreter sample...\n");

    // DefaultAzureCredential can use your Azure CLI login
    // during local development.
    const credential = new DefaultAzureCredential();


    // Endpoint and model are loaded centrally by:
    // shared/config.js
    const projectClient = new AIProjectClient(
      config.foundry.projectEndpoint,
      credential
    );


    //  Get the OpenAI-compatible client

    const openai = await projectClient.getOpenAIClient();

    console.log(`Model: ${config.foundry.model}`);
    console.log("Sending request to Code Interpreter...\n");


    // 4. Create the response
    // Code Interpreter allows the model to write and execute
    // Python code inside a sandboxed environment.
    const response = await openai.responses.create({
      model: config.foundry.model,

      instructions:
        "You are a banking assistant. " +
        "Use Code Interpreter to perform financial calculations. " +
        "Show the formula, calculated values, and a concise explanation.",

      tools: [
        {
          type: "code_interpreter",
          container: {
            type: "auto",
          },
        },
      ],

      input:
        "A customer borrows INR 2,500,000 for 20 years " +
        "at an annual interest rate of 8.5%. " +
        "Use Python to calculate the monthly EMI, " +
        "total amount repaid, and total interest paid.",
    });

    // ---------------------------------------------------------
    // 5. Display the result
    // ---------------------------------------------------------
    console.log("Code Interpreter response:\n");
    console.log(response.output_text);
  } catch (error) {
    console.error("\nCode Interpreter sample failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  }
}

main();