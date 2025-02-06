import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const inter = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yukti | Debugshala's AI Assistant",
  description: "Search smarter and faster with Yukti by Debugshala",
  metadataBase: new URL("https://chat.debugshala.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="debugshala.com" />
      </head>
      <body className={`${inter.className} h-full bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white`}>
        <div className="flex flex-col h-full">
          {children}
        </div>
      </body>
    </html>
  );
}