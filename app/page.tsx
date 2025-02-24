"use client";

import Answer from "@/components/Answer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InputArea from "@/components/InputArea";
import SimilarTopics from "@/components/SimilarTopics";
import Sources from "@/components/Sources";
import ChatHistory from "@/components/ChatHistory";
//

import { useAuth } from '../app/backend/useAuth';
import { supabase } from '../app/backend/supabase';
//
import Image from "next/image";
import { useRef, useState ,useEffect} from "react";
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
///
const { user } = useAuth();  // Add this at the top with other state declarations

// First, import supabase at the top


<<<<<<< HEAD
    // Get the last four questions from chat history
    const previousQuestions = chatHistory.slice(-4);

    await Promise.all([
      handleSourcesAndAnswer(newQuestion, previousQuestions),
      handleSimilarQuestions(newQuestion),
    ]);
=======
const handleDisplayResult = async (newQuestion?: string) => {
  newQuestion = newQuestion || promptValue;
>>>>>>> 235b5f5 (Updated handleDisplayResult function in page.tsx)

  setShowResult(true);
  setLoading(true);
  setQuestion(newQuestion);
  setPromptValue("");

  // Get the answer
  await handleSourcesAndAnswer(newQuestion);
  
  // Save to Supabase
  if (user) {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        chat_text: newQuestion,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.log('Supabase save error:', error);
    } else {
      console.log('Successfully saved to Supabase:', data);
    }
  }

  // Update local state
  setChatHistory(prev => [...prev, newQuestion!]);
  await handleSimilarQuestions(newQuestion);
  setLoading(false);
};


useEffect(() => {
  const loadChatHistory = async () => {
    if (user) {
      const { data } = await supabase
        .from('chat_history')
        .select('chat_text')
        .order('created_at', { ascending: false });
      
      if (data) {
        setChatHistory(data.map(item => item.chat_text));
      }
    }
  };

<<<<<<< HEAD
  async function handleSourcesAndAnswer(question: string, previousQuestions: string[]) {
=======
  loadChatHistory();
}, [user]);

const handleClearHistory = async () => {
  if (user) {
    await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user.id);
  }
  setChatHistory([]);
};

// comment this/
  // const handleDisplayResult = async (newQuestion?: string) => {
  //   newQuestion = newQuestion || promptValue;

  //   setShowResult(true);
  //   setLoading(true);
  //   setQuestion(newQuestion);
  //   setPromptValue("");
  //   setChatHistory((prev) => [...prev, newQuestion!]);

  //   await Promise.all([
  //     handleSourcesAndAnswer(newQuestion),
  //     handleSimilarQuestions(newQuestion),
  //   ]);

  //   setLoading(false);
  // };


  async function handleSourcesAndAnswer(question: string) {
>>>>>>> 235b5f5 (Updated handleDisplayResult function in page.tsx)
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
              {/* <ChatHistory 
                chats={chatHistory}
                onChatSelect={(selectedChat: string) => {
                  setQuestion(selectedChat);
                  handleDisplayResult(selectedChat);
                }}
                onClear={() => setChatHistory([])}
              /> */}
                  <ChatHistory 
        chats={chatHistory}
        onChatSelect={(selectedChat: string) => {
          setQuestion(selectedChat);
          handleDisplayResult(selectedChat);
        }}
        onClear={handleClearHistory}
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
                  {/* seacr box */}
                  <div className="fixed bottom-8 left-1/2 w-full max-w-xl sm:max-w-xl -translate-x-1/2 p-0 bg-white shadow-lg rounded-2xl">
 
                  <InputArea  
                   promptValue={promptValue}
                   setPromptValue={setPromptValue}
                   handleDisplayResult={handleDisplayResult}
                  />
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
