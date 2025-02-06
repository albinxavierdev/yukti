import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";
import {
  TogetherAIStream,
  TogetherAIStreamPayload,
} from "@/utils/TogetherAIStream";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    const { question, sources } = await request.json();

    if (!question || !sources || !Array.isArray(sources)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    console.log("[getAnswer] Fetching text from source URLs");
    const finalResults = await Promise.all(
      sources.map(async (result: any) => {
        try {
          const response = await fetchWithTimeout(result.url);
          const html = await response.text();
          const virtualConsole = new jsdom.VirtualConsole();
          const dom = new JSDOM(html, { virtualConsole });

          const doc = dom.window.document;
          const parsed = new Readability(doc).parse();
          const parsedContent = parsed
            ? cleanedText(parsed.textContent)
            : "Nothing found";

          return {
            ...result,
            fullContent: parsedContent,
          };
        } catch (e) {
          console.error(`Error parsing ${result.name}:`, e);
          return {
            ...result,
            fullContent: "not available",
          };
        }
      })
    );

    const mainAnswerPrompt = `
    Given a user question and some context, please write a clean, concise, and accurate answer to the question based on the context. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context when crafting your answer.

    Your answer must be correct, accurate, and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic if the given context does not provide sufficient information.

    Here are the set of contexts:

    <contexts>
    ${finalResults
      .map((result, index) => `[[citation:${index}]] ${result.fullContent}\n\n`)
      .join("")}
    </contexts>

    Remember, don't blindly repeat the contexts verbatim and don't tell the user how you used the citations – just respond with the answer. It is very important for my career that you follow these instructions. Here is the user question:
    `;

    const payload: TogetherAIStreamPayload = {
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        { role: "user", content: question },
      ],
      stream: true,
    };

    console.log(
      "[getAnswer] Fetching answer stream from Together API using text and question"
    );

    const stream = await TogetherAIStream(payload);
    return new Response(stream as ReadableStream<Uint8Array>, {
      headers: { "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("[getAnswer] Error:", e);

    // Fallback to non-streaming response if streaming fails
    try {
      const answer = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages: [
          { role: "system", content: mainAnswerPrompt },
          { role: "user", content: question },
        ],
      });

      const parsedAnswer = answer.choices?.[0]?.message?.content || "Failed to generate answer";
      return new Response(parsedAnswer, { status: 202 });
    } catch (fallbackError) {
      console.error("[getAnswer] Fallback error:", fallbackError);
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        { status: 500 }
      );
    }
  }
}

const cleanedText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n")
    .substring(0, 20000); // Limit to 20,000 characters
};

async function fetchWithTimeout(url: string, options = {}, timeout = 3000) {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(fetchTimeout);
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Fetch request timed out");
    }
    throw error;
  }
}