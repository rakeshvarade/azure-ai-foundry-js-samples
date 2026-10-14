import {
  config,
  createOpenAIClient,
} from "../../shared/foundry.js";

// This is the JavaScript function the model can ask our app to run.
function getWeather(location) {
  if (typeof location !== "string" || location.length > 100) {
    throw new Error("Invalid location.");
  }

  // Demo data keeps this sample simple and avoids another API key.
  return {
    location: location.trim(),
    temperature: 27,
    unit: "celsius",
    condition: "Partly cloudy",
  };
}

// Describe the function so the model knows when and how to call it.
const weatherTool = {
  type: "function",
  name: "get_weather",
  description: "Get the current demo weather for a location.",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city name, for example Bengaluru.",
      },
    },
    required: ["location"],
    additionalProperties: false,
  },
};

async function main() {
  const client = createOpenAIClient();

  // Step 1: Ask the model a question and give it access to our function.
  const firstResponse = await client.responses.create({
    model: config.foundry.model,
    input: "What is the weather in Bengaluru?",
    tools: [weatherTool],
  });

  // Step 2: Find the function call requested by the model.
  const functionCall = firstResponse.output.find(
    (item) => item.type === "function_call"
  );

  if (!functionCall || functionCall.name !== "get_weather") {
    throw new Error("The model did not request the expected function.");
  }

  // Model-generated arguments are untrusted, so parse and validate them.
  const args = JSON.parse(functionCall.arguments);
  const weather = getWeather(args.location);

  console.log("Function result:", weather);

  // Step 3: Send the function result back so the model can answer the user.
  const finalResponse = await client.responses.create({
    model: config.foundry.model,
    previous_response_id: firstResponse.id,
    input: [
      {
        type: "function_call_output",
        call_id: functionCall.call_id,
        output: JSON.stringify(weather),
      },
    ],
    tools: [weatherTool],
  });

  console.log("\nAI response:");
  console.log(finalResponse.output_text);
}

main().catch((error) => {
  console.error("Sample failed:", error.message);
  process.exitCode = 1;
});
