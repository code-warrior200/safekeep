import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Student Storage Service — Store Smart. Travel Free.",
  description:
    "A secure, affordable, student-focused temporary storage booking platform for Ahmadu Bello University (ABU), Zaria students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans antialiased">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
