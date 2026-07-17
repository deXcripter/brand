import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SiteChrome from "@/components/site-chrome";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Johnpaul Nnaji",
    default: "Johnpaul Nnaji | Software Engineer & SEO Builder",
  },
  description:
    "Johnpaul Nnaji is a software engineer building AI tools for search visibility. Currently working on SEORCE.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.exeolabs.xyz" />
        <link rel="preconnect" href="https://plausible.io" />
        <Script
          src="https://cdn.exeolabs.xyz/script.js"
          strategy="lazyOnload"
          data-site="334616476419637248"
        />

        {/* Privacy-friendly analytics by Plausible */}
        <Script
          src="https://plausible.io/js/pa-mWVg99n-SGc-rg0JU2FGr.js"
          strategy="lazyOnload"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SiteChrome>
            <main>{children}</main>
          </SiteChrome>
        </ThemeProvider>
        {/* Person JSON-LD — tells search engines who I am */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Johnpaul Nnaji",
              givenName: "Johnpaul",
              familyName: "Nnaji",
              username: "dexcripter",
              url: "https://dexcripter.me",
              jobTitle: "Software Engineer",
              description:
                "Software engineer building AI tools for search visibility. Currently working on SEORCE.",
              sameAs: [
                "https://github.com/dexcripter",
                "https://x.com/dexcripter",
                "https://linkedin.com/in/dexcripter",
              ],
              knowsAbout: [
                "Search Engine Optimization",
                "Artificial Intelligence",
                "Generative Engine Optimization",
                "Software Engineering",
                "Technical SEO",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
