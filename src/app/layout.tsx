import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Karla as Font } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const fontSans = Font({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: {
    template: "CartoonHub | %s",
    default: "CartoonHub | Plongez dans la Nostalgie des Dessins Animés",
  },
  description:
    "Découvrez une vaste sélection de dessins animés en français, y compris des classiques Disney et des nouveautés. Profitez de dessins animés gratuits à regarder en streaming.",
  twitter: { card: "summary_large_image" },
  openGraph: { images: ["/og-image.png"] },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/simple-logo-dark.png",
        href: "/simple-logo-dark.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/simple-logo-light.png",
        href: "/simple-logo-light.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="fr" className={cn("dark", fontSans.className)}>
        <ReactQueryProvider>
          <NuqsAdapter>
            <body
              className={`flex min-h-svh flex-col overflow-x-hidden antialiased`}
            >
              <Navbar />
              <div className="container flex flex-1 flex-col">{children}</div>
              <Footer />
              <Toaster />
            </body>
          </NuqsAdapter>
        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  );
}
