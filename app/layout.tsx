import type { Metadata } from "next";
import { Inter, Montserrat, Work_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Brand type system (matches the approved Instagram carousels):
//   Work Sans Black/ExtraBold → headlines and big numbers
//   Inter                     → body copy
//   Montserrat ExtraBold      → eyebrows, counters, "Swipe", small uppercase labels
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-work-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
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
        className={`h-full ${inter.variable} ${workSans.variable} ${montserrat.variable}`}
      >
        <body className="min-h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
