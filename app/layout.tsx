import type { Metadata } from "next";
import {
  Inter,
  Palanquin,
  Palanquin_Dark,
  Work_Sans,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const palanquin = Palanquin({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-palanquin",
  display: "swap",
});

const palanquinDark = Palanquin_Dark({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-palanquin-dark",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RUT Post Studio",
  description: "Brand-locked social media post designer for Rolled Up Tees",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up">
      <html
        lang="en"
        className={`h-full ${inter.variable} ${palanquin.variable} ${palanquinDark.variable} ${workSans.variable}`}
      >
        <body className="min-h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
