import type { Metadata } from "next";
import "./globals.css";
import Foot from "./footer/page";



export const metadata: Metadata = {
  title: "Next.js + Supabase oAuth,LLM", 
  description: "A sample project with Google Login and Tailwind CSS and LLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Foot />
      </body>
    </html>
  );
}
