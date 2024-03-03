import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

// Header.tsx
import Link from 'next/link';

function Header() {
  return (
    <header>
      <Link href="/">
        <div className="flex justify-center items-center">
         <span className="font-bold text-3xl tracking-tight"> 
          Study
          </span>
          <img src="/logo.png" alt="StudyHive Logo" style={{ height: '80px', display: 'inline-block' }} /> 
          <span className="font-bold text-3xl tracking-tight"> 
          Hive
          </span> 
        </div>
      
          
      </Link>
    </header>
  );
}


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "StudyHive",
  description: "The New & Improved Way to Study!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          

          <Header />
          {children}
          
          
          
          </TRPCReactProvider>
      </body>
    </html>
  );
}
