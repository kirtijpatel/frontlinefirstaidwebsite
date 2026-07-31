import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components/site-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://uvafrontlinefirstaid.com"),
  title: { default: "Frontline Firstaid", template: "%s | Frontline Firstaid" },
  description: "UVA medical students teaching practical CPR and first aid skills to the Charlottesville community.",
  openGraph: {
    type: "website",
    siteName: "Frontline Firstaid",
    title: "Frontline Firstaid",
    description: "UVA medical students teaching practical CPR and first aid skills to the Charlottesville community.",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "Frontline Firstaid community CPR education" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontline Firstaid",
    description: "Skills that matter. Confidence that lasts.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
