import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Affiche le texte immédiatement avec une font système
  preload: true,
});

export const metadata: Metadata = {
  title: "Niyya Tools - Outils Internes Niyya Agency",
  description: "Plateforme d'outils internes pour Niyya Agency - Agence web spécialisée en création de sites internet",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#BEFF00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={inter.className}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script src="/ort-loader.js" defer />
      </body>
    </html>
  );
}
