import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components";


export const metadata: Metadata = {
  title: "Rathod Pratik - Portfolio",
  description: "My Portfolio Website",
  verification: {
    google: "XZnkdFGBxwJbabv9bIKetd3LJw91kXGZaDjpdksXqow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-full flex flex-col">

        <Navbar />
        <div className="flex-1 pt-18">
          {children}
        </div>
        <Footer />
      </div>
  );
}
