import Image from "next/image";
import { FC } from "react";
import InputArea from "./InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: (newQuestion?: string) => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value); // Pre-fill input
    // Auto-trigger search after short delay for better UX
    setTimeout(() => handleDisplayResult(value), 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white px-4">
      {/* Powered by Badge */}
      <div className="mb-8 animate-fade-in">
        <a
          className="inline-flex items-center gap-2 rounded-full bg-[#1E1E1E] px-4 py-2 text-sm font-light text-[#A0A0A0] hover:text-white transition-all hover:bg-[#2A2A2A]"
          href="https://www.bizfy.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/img/Black Icon-01.png"
            alt="Bizfy"
            width={20}
            height={20}
            className="filter brightness-0 invert"
          />
          <span>Powered by Bizfy</span>
        </a>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#60EFFF] mb-8 leading-tight">
        Code smarter,<br />
        learn faster
      </h1>

      {/* Single Input Field */}
      <div className="w-full max-w-2xl mb-8">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
        />
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {suggestions.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E1E1E] text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] transition-all group"
            onClick={() => handleClickSuggestion(item.name)}
          >
            <Image
              src={item.icon}
              alt=""
              width={16}
              height={16}
              className="filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
              aria-hidden
            />
            <span className="text-sm max-w-[200px] truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

type SuggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: SuggestionType[] = [
  {
    id: 1,
    name: "OOP core concepts",
    icon: "/img/icon _leaf_.svg",
  },
  {
    id: 2,
    name: "Technical interview prep",
    icon: "/img/icon _dumbell_.svg",
  },
  {
    id: 3,
    name: "Clean code practices",
    icon: "/img/icon _atom_.svg",
  },
];

export default Hero;