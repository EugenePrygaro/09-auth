import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your thoughts organized and accessible in one place, whether you are at home or on the go.",
  openGraph: {
    title: `NoteHub`,
    description:
      "NoteHub is a simple and efficient application designed for managing personal notes.",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Your Personal Note Management App",
      },
    ],
    url: "https://08-zustand-umber-seven.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: `NoteHub`,
    description:
      "NoteHub is a simple and efficient application designed for managing personal notes.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
