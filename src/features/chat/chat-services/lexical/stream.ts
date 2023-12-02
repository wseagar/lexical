import database from "@/features/common/database";
import { OpenAIInstance } from "@/features/common/openai";
import { ModelConfig } from "@/lib/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessageParam } from "openai/resources";
import { getTokenCount } from "./token-counter";

async function createOpenAIStream(
  messages: ChatCompletionMessageParam[],
  model: string,
  apiKey: string,
  onCompletion: (completion: string) => void
) {
  const openAI = OpenAIInstance(apiKey);

  const response = await openAI.chat.completions.create({
    messages: messages,
    model: model,
    stream: true,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      return onCompletion(completion);
    },
  });
  return new StreamingTextResponse(stream);
}

function createAnthropicStream(
  messages: ChatCompletionMessageParam[],
  model: string
) {
  throw new Error("Not implemented");
}

export async function createStream(
  messages: ChatCompletionMessageParam[],
  onCompletion: (completion: string) => void
) {
  const config = await database.config.findFirst({
    where: {
      key: "llm",
    },
  });

  if (!config) {
    throw new Error("Missing config");
  }

  const llm = config.value as ModelConfig;

  switch (llm.provider) {
    case "openai":
      return await createOpenAIStream(
        messages,
        llm.openai.model,
        llm.openai.apiKey,
        onCompletion
      );
    case "anthropic":
      return await createAnthropicStream(messages, llm.anthropic.model);
    default:
      throw new Error("Invalid provider");
  }
}
