"use client";

import Answer from "@/components/Answer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InputArea from "@/components/InputArea";
import SimilarTopics from "@/components/SimilarTopics";
import Sources from "@/components/Sources";
import ChatHistory from "@/components/ChatHistory";
import Image from "next/image";
import { useRef, useState } from "react";
import { createParser } from "eventsource-parser";

export default function Home() {
  const [promptValue, setPromptValue] = useState("");
  const [question, setQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [answer, setAnswer] = useState("");
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleDisplayResult = async (newQuestion?: string) => {
    newQuestion = newQuestion || promptValue;

    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");
    setChatHistory((prev) => [...prev, newQuestion!]);

    // Get the last four questions from chat history
    const previousQuestions = chatHistory.slice(-4);

    await Promise.all([
      handleSourcesAndAnswer(newQuestion, previousQuestions),
      handleSimilarQuestions(newQuestion),
    ]);

    setLoading(false);
  };

  async function handleSourcesAndAnswer(question: string, previousQuestions: string[]) {
    setIsLoadingSources(true);
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    if (sourcesResponse.ok) {
      let sources = await sourcesResponse.json();

      setSources(sources);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const response = await fetch("/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, sources, previousQuestions }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 202) {
      const fullAnswer = await response.text();
      setAnswer(fullAnswer);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setAnswer((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
  }

  async function handleSimilarQuestions(question: string) {
    let res = await fetch("/api/getSimilarQuestions", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    let questions = await res.json();
    setSimilarQuestions(questions);
  }

  const reset = () => {
    setShowResult(false);
    setPromptValue("");
    setQuestion("");
    setAnswer("");
    setSources([]);
    setSimilarQuestions([]);
  };

  return (
    <>
      <Header />
      <main className="h-full px-4 pb-4">
        {!showResult && (
          <Hero
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        )}

        {showResult && (
          <div className="flex h-[calc(100vh-140px)] w-full gap-4">
            {/* Left Column - Chat History */}
            <div className="w-1/4 min-w-[300px] rounded-lg border border-[#C2C2C2] bg-white p-4">
              <ChatHistory 
                chats={chatHistory}
                onChatSelect={(selectedChat: string) => {
                  setQuestion(selectedChat);
                  handleDisplayResult(selectedChat);
                }}
                onClear={() => setChatHistory([])}
              />
            </div>

            {/* Middle Column - Answer & Similar Topics */}
            <div className="flex w-2/4 flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 rounded-lg border border-[#C2C2C2] bg-white p-4">
                  <Image
                    unoptimized
                    src={"/img/message-question-circle.svg"}
                    alt="message"
                    width={30}
                    height={30}
                    className="size-[24px]"
                  />
                  <div className="flex-1">
                    <p className="font-bold uppercase text-black">Question:</p>
                    <p className="text-gray-600">"{question}"</p>
                  </div>
                </div>
                
                <Answer answer={answer} />
                <SimilarTopics
                  similarQuestions={similarQuestions}
                  handleDisplayResult={handleDisplayResult}
                  reset={reset}
                />
              </div>
              <div ref={chatContainerRef}></div>
            </div>

            {/* Right Column - Sources */}
            <div className="w-1/4 min-w-[300px] overflow-y-auto rounded-lg border border-[#C2C2C2] bg-white p-4">
              <Sources sources={sources} isLoading={isLoadingSources} />
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
