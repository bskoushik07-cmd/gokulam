import type { Metadata } from "next";
import { Playfair_Display, Libre_Franklin } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageProvider } from "@/context/ImageContext";
import { ReelsProvider } from "@/context/ReelsContext";
import { MenuProvider } from "@/context/MenuContext";

/* Premium editorial type pairing — Playfair Display + Libre Franklin */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gokulam.in"),
  title: {
    default: "Gokulam — The Soul of South India, On Your Plate",
    template: "%s · Gokulam",
  },
  description:
    "Gokulam is a growing South Indian restaurant brand. Authentic flavours, timeless recipes and the warmth of a meal made with heart — now in Delhi and Noida.",
  openGraph: {
    type: "website",
    siteName: "Gokulam",
    title: "Gokulam — The Soul of South India, On Your Plate",
    description:
      "Authentic South Indian flavours, timeless recipes and the warmth of a meal made with heart.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${libreFranklin.variable} antialiased`}
    >
      <body className="font-body min-h-screen flex flex-col bg-cream text-ink">
        <ImageProvider>
          <ReelsProvider>
            <MenuProvider>
              <SmoothScroll>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </SmoothScroll>
            </MenuProvider>
          </ReelsProvider>
        </ImageProvider>
      </body>
    </html>
  );
}
