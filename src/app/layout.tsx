import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

/**
 * Fonts: CSS <link> to Google Fonts (not next/font/google).
 * next/font/google failed on this PC for Noto_Sans_Devanagari during both
 * Turbopack and webpack static builds (loader null read). CSS links work for
 * local + GitHub Pages static export alike.
 */
export const metadata: Metadata = {
  title: "KshetraMap",
  description:
    "Booth-wise election result maps for Bihar assembly constituencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kshetramap-theme');var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(t==='light')d=false;if(!t)d=false;var r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',!d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}