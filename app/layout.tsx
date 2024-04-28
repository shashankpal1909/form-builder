import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { Inter, Montserrat, Poppins } from "next/font/google";

import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
});
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext", "devanagari"],
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
      <body className={cn(poppins.className, "flex flex-col h-dvh")}>
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
            {/* <Footer /> */}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
