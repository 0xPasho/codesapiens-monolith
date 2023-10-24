import { OpenAI } from "langchain/llms";
import { env } from "~/env.mjs";

if (!env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI Credentials");
}

export const openai = new OpenAI({
  temperature: 0,
  openAIApiKey: env.OPENAI_API_KEY,
});

export const openaiStream = new OpenAI({
  temperature: 0,
  streaming: true,
  callbackManager: {
    handleNewToken(token) {
      console.log(token);
    },
  },
  openAIApiKey: env.OPENAI_API_KEY,
});
