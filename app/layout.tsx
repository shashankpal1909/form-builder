import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { ABeeZee, Inter, Lato, Montserrat, Open_Sans, Poppins } from "next/font/google";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
  ],
});
const montserrat = Montserrat({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
});
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext", "devanagari"],
});
const abeezee = ABeeZee({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});
const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "300", "400", "700", "900"],
});
const openSans = Open_Sans({
  subsets: [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "hebrew",
    "math",
    "symbols",
    "vietnamese",
  ],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Form Builder Pro",
  description: "build your custom forms in minutes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={cn(inter.className, "flex flex-col h-dvh")}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
