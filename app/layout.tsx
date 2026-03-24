import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "SoccerApp - Fútbol de Barrio",
  description: "La mejor plataforma para seguir tus torneos y equipos favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebas.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Control flotante Global para el modo oscuro */}
            <div className="fixed top-6 right-6 z-[9999]">
              <ThemeToggle />
            </div>
            
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
