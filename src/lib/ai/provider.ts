import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { serverEnv } from "@/lib/env";

export type AiTask = "classification" | "summary" | "final_brief" | "quality_check";

export type GenerateTextInput = {
  task: AiTask;
  system?: string;
  prompt: string;
  temperature?: number;
};

export type GenerateTextResult = {
  provider: "gemini" | "openai" | "openai_compatible" | "fallback";
  model: string;
  text: string;
};

export interface AiProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
}

function modelForTask(task: AiTask): string {
  switch (task) {
    case "classification":
      return serverEnv.AI_CLASSIFICATION_MODEL ?? "gemini-2.0-flash-lite";
    case "summary":
      return serverEnv.AI_SUMMARY_MODEL ?? "gemini-2.0-flash-lite";
    case "final_brief":
      return serverEnv.AI_FINAL_BRIEF_MODEL ?? "gemini-2.0-flash";
    case "quality_check":
      return serverEnv.AI_QUALITY_CHECK_MODEL ?? "gemini-2.0-flash-lite";
  }
}

class GeminiProvider implements AiProvider {
  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    if (!serverEnv.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = modelForTask(input.task);
    const client = new GoogleGenerativeAI(serverEnv.GEMINI_API_KEY);
    const generativeModel = client.getGenerativeModel({
      model,
      systemInstruction: input.system
    });
    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: input.prompt }] }],
      generationConfig: {
        temperature: input.temperature ?? 0.3
      }
    });

    return {
      provider: "gemini",
      model,
      text: result.response.text()
    };
  }
}

class OpenAiProvider implements AiProvider {
  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    if (!serverEnv.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const model =
      input.task === "final_brief"
        ? serverEnv.AI_FINAL_BRIEF_MODEL ?? "gpt-4.1-mini"
        : modelForTask(input.task).startsWith("gemini")
          ? "gpt-4.1-nano"
          : modelForTask(input.task);

    const client = new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY });
    const response = await client.responses.create({
      model,
      temperature: input.temperature ?? 0.3,
      input: [
        ...(input.system ? [{ role: "system" as const, content: input.system }] : []),
        { role: "user" as const, content: input.prompt }
      ]
    });

    return {
      provider: "openai",
      model,
      text: response.output_text
    };
  }
}

class OpenAiCompatibleProvider implements AiProvider {
  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    if (!serverEnv.AI_COMPATIBLE_BASE_URL || !serverEnv.AI_COMPATIBLE_MODEL) {
      throw new Error("AI_COMPATIBLE_BASE_URL and AI_COMPATIBLE_MODEL are required.");
    }

    const client = new OpenAI({
      apiKey: serverEnv.AI_COMPATIBLE_API_KEY || "local-compatible-provider",
      baseURL: serverEnv.AI_COMPATIBLE_BASE_URL
    });
    const response = await client.chat.completions.create({
      model: serverEnv.AI_COMPATIBLE_MODEL,
      temperature: input.temperature ?? 0.3,
      messages: [
        ...(input.system ? [{ role: "system" as const, content: input.system }] : []),
        { role: "user" as const, content: input.prompt }
      ]
    });

    return {
      provider: "openai_compatible",
      model: serverEnv.AI_COMPATIBLE_MODEL,
      text: response.choices[0]?.message.content ?? ""
    };
  }
}

class FallbackProvider implements AiProvider {
  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    return {
      provider: "fallback",
      model: "deterministic-local",
      text: input.prompt
    };
  }
}

export function getAiProvider(): AiProvider {
  if (serverEnv.AI_PROVIDER === "openai" && serverEnv.OPENAI_API_KEY) {
    return new OpenAiProvider();
  }

  if (serverEnv.AI_PROVIDER === "gemini" && serverEnv.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  if (
    serverEnv.AI_PROVIDER === "openai_compatible" &&
    serverEnv.AI_COMPATIBLE_BASE_URL &&
    serverEnv.AI_COMPATIBLE_MODEL
  ) {
    return new OpenAiCompatibleProvider();
  }

  return new FallbackProvider();
}
