import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toolbar } from "./components/Toolbar";
import { Footer } from "./components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kyle Sutton",
  description: "Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="grid grid-rows-[3.5rem_1fr_2rem] min-h-screen">
          <Toolbar className="row-start-1" />
          <main className="flex flex-col ml-4 mr-4 h-100 row-start-2">
            {children}
          </main>
          <footer className="row-start-3 ml-4 ml-4">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
