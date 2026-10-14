# Azure AI Foundry JavaScript Samples

Welcome to the repository for Azure AI Foundry JavaScript examples.

## Repository Structure

* `response-api/` - Tutorials, theory, and runnable examples for the Response API.
* `ai-tools/` - Runnable examples that use Microsoft Foundry tools.
* `shared/` - Reusable configuration, authentication, and client factories.

## Shared Microsoft Foundry Boilerplate

1. Copy `.env.example` to `.env` and set your project endpoint and model
   deployment name.
2. Sign in with a credential supported by `DefaultAzureCredential`, such as the
   Azure CLI credential used after `az login`.
3. Import the client factory required by your application:

```js
import {
  config,
  createAIProjectClient,
  createOpenAIClient,
} from "./shared/foundry.js";

const projectClient = createAIProjectClient();
const openAIClient = createOpenAIClient();

const response = await openAIClient.responses.create({
  model: config.foundry.model,
  input: "Hello from Microsoft Foundry.",
});
```

`createAIProjectClient()` is intended for the Azure AI Projects SDK.
`createOpenAIClient()` creates an OpenAI-compatible client that obtains a
Microsoft Entra ID access token for each request. Both use
`AZURE_FOUNDRY_PROJECT_ENDPOINT` from the shared configuration by default and
accept an endpoint or credential override.