import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";

import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

import { config } from "../../shared/config.js";

async function main() {
  let openai;
  let uploadedFile;
  let vectorStore;

  try {
    console.log("Starting File Search sample...\n");

    // DefaultAzureCredential uses secure Microsoft Entra ID authentication.
    // For local development, run "az login" before starting this sample.
    const credential = new DefaultAzureCredential();
    const projectClient = new AIProjectClient(
      config.foundry.projectEndpoint,
      credential
    );
    openai = projectClient.getOpenAIClient();

    // This sample uploads only the repository's File Search README.
    // Do not upload secrets or documents you are not authorized to process.
    const documentPath = fileURLToPath(
      new URL("../README.MD", import.meta.url)
    );

    console.log("Uploading the sample document...");
    uploadedFile = await openai.files.create({
      file: createReadStream(documentPath),
      purpose: "assistants",
    });

    console.log("Creating a temporary vector store...");
    vectorStore = await openai.vectorStores.create({
      name: "file-search-javascript-sample",
    });

    console.log("Indexing the document...");
    const indexedFile = await openai.vectorStores.files.createAndPoll(
      vectorStore.id,
      {
        file_id: uploadedFile.id,
      }
    );

    if (indexedFile.status !== "completed") {
      throw new Error(
        `Document indexing ended with status: ${indexedFile.status}`
      );
    }

    console.log("Asking a question grounded in the uploaded document...\n");
    const response = await openai.responses.create({
      model: config.foundry.model,
      instructions:
        "Answer only from the uploaded document. " +
        "If the document does not contain the answer, say so clearly.",
      input: "What tools are described in this document?",
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStore.id],
          max_num_results: 5,
        },
      ],
      include: ["file_search_call.results"],
    });

    console.log("File Search response:\n");
    console.log(response.output_text);
  } finally {
    // Delete temporary cloud resources even when the request fails.
    if (openai && vectorStore) {
      try {
        await openai.vectorStores.delete(vectorStore.id);
        console.log("\nDeleted the temporary vector store.");
      } catch (error) {
        console.error("\nCould not delete the temporary vector store:", error);
        process.exitCode = 1;
      }
    }

    if (openai && uploadedFile) {
      try {
        await openai.files.delete(uploadedFile.id);
        console.log("Deleted the temporary uploaded file.");
      } catch (error) {
        console.error("Could not delete the temporary uploaded file:", error);
        process.exitCode = 1;
      }
    }
  }
}

main().catch((error) => {
  console.error("\nFile Search sample failed.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});