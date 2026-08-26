import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Provider";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Tourism App",
  description: "Tourism application",
};
 const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/Inter_18pt-Black.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter_18pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter_18pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter_18pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter_18pt-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter_18pt-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body>
        <Providers>{children}</Providers></body>
    </html>
  );
}