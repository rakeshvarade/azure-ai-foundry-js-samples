# Azure AI Foundry JavaScript Samples

Welcome to the repository for Azure AI Foundry JavaScript examples.

## Repository Structure

* `basics/` - Beginner-friendly examples of Foundry fundamentals.
* `response-api/` - Tutorials, theory, and runnable examples for the Response API.
* `ai-tools/` - Runnable examples that use Microsoft Foundry tools.
* `shared/` - Reusable configuration, authentication, and client factories.

## Default Authentication Sample

[Default authentication](./basics/01-ai-foundry-auth.js) demonstrates
`DefaultAzureCredential` directly, without custom helper functions or API keys.
It reads configuration from [shared/config.js](./shared/config.js).

1. Use Node.js 22 LTS or newer and run `npm install`.
2. Set `AZURE_FOUNDRY_PROJECT_ENDPOINT` and `AZURE_FOUNDRY_MODEL` in your
   repository-root `.env` file. Use the model deployment name, not a catalog ID.
3. Run `az login` for the tenant containing your project. Your identity needs
   an appropriate role, such as **Azure AI User**, on the project.
4. From the repository root, run:

   ```powershell
   node .\basics\01-ai-foundry-auth.js
   ```

The sample makes one model request, which may incur usage charges. Tokens are
managed by the SDK and never printed. For Azure-hosted production applications,
prefer an explicitly configured `ManagedIdentityCredential`.

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