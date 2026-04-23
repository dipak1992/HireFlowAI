import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "HireFlow AI - Smart Job Matching & Career Growth",
    template: "%s | HireFlow AI",
  },
  description:
    "AI-powered job matching platform that helps you find the right opportunities faster. Import your LinkedIn profile, get matched with jobs, and accelerate your career.",
  keywords: [
    "job search",
    "AI job matching",
    "resume builder",
    "career growth",
    "job tracker",
    "warehouse jobs",
    "remote jobs",
    "nurse jobs",
    "software engineer jobs",
  ],
  authors: [{ name: "HireFlow AI" }],
  creator: "HireFlow AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "HireFlow AI",
    title: "HireFlow AI - Smart Job Matching & Career Growth",
    description:
      "AI-powered job matching platform. Find jobs faster, tailor your resume, and track applications — all in one place.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "HireFlow AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFlow AI - Smart Job Matching & Career Growth",
    description:
      "AI-powered job matching platform. Find jobs faster, tailor your resume, and track applications.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@hireflowai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <PageViewTracker />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
