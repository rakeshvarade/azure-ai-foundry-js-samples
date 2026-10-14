 Tool definitions and call structures written in JavaScript:

## Common Tools Overview (JavaScript)

* **`code_interpreter`**: Generates and runs code to execute tasks, analyze data, or solve computational problems.


```javascript
// Example call to add code_interpreter tool
const tools = [{ type: "code_interpreter" }];

```


* **`web_search`**: Finds current, up-to-date information by searching the Internet.


```javascript
// Example call to add web_search tool
const tools = [{ type: "web_search" }];

```


* **`file_search`**: Searches uploaded files and grounds the model's responses in specific, document-based knowledge.


```javascript
// Example call to add file_search tool
const tools = [{ type: "file_search" }];

```


* **`function`**: Allows the model to call custom functions defined in your application code.


```javascript
// Example call to define a custom function tool
const tools = [{
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather",
    strict: true,
    parameters: {
        type: "object",
        properties: {
            location: { type: "string" }
        },
        required: ["location"],
        additionalProperties: false
    }
}];

```

Run the complete function-calling example from the repository root:

```powershell
node .\ai-tools\code\03-tools-function-call.js
```

The example validates tool arguments, calls only functions in an explicit
allowlist, sends each result back to the model, and limits repeated tool calls.