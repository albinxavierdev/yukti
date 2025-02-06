import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface TogetherAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  stream: boolean;
}

export async function TogetherAIStream(payload: TogetherAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    const res = await fetch("https://together.helicone.ai/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API request failed: ${res.status} - ${errorBody}`);
    }

    let counter = 0;
    const readableStream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;
            controller.enqueue(encoder.encode(data));
          }
        };

        const parser = createParser(onParse);
        
        try {
          if (!res.body) throw new Error("No response body");
          const reader = res.body.getReader();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.feed(decoder.decode(value));
          }
        } catch (e) {
          controller.error(`Stream parsing error: ${e}`);
        } finally {
          controller.close();
        }
      },
    });

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        try {
          const data = decoder.decode(chunk);
          if (data === "[DONE]") {
            controller.terminate();
            return;
          }

          const json = JSON.parse(data);
          const text = json.choices?.[0]?.delta?.content || "";
          
          // Skip initial empty messages and newlines
          if (counter < 2 && text.trim() === "") return;

          const payload = { text };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
          counter++;
        } catch (e) {
          console.error("Transform error:", e);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream parsing error" })}\n\n`)
          );
        }
      },
      flush(controller) {
        controller.terminate();
      }
    });

    return readableStream.pipeThrough(transformStream);

  } catch (e) {
    console.error("TogetherAIStream error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to create stream" }),
      { status: 500 }
    );
  }
}