import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { cookies } from "next/headers";
import { validateUserSession } from "@/actions/auth/validateUserSession";
import { getBalances } from "@/actions/balance/getBalances";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TradeUp",
  description: "Trade safely on a user friendly app.",
  openGraph: {
    title: "TradeUp",
    description: "Trade safely on a user-friendly app.",
    type: "website",
    url: "https://ryanbez.dev",
    images: [
      {
        url: "/Images/ogImage.png",
        width: 1200,
        height: 630,
        alt: "TradeUp - Safe and User-Friendly Trading",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken")?.value;
  const email = (await cookieStore).get("email")?.value;

  const initialUser =
    sessionToken && email
      ? await validateUserSession(email, sessionToken)
      : null;

  const initialBalances = initialUser
    ? await getBalances(initialUser.id)
    : null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-black dark:bg-black antialiased`}
      >
        <AuthProvider
          initialUser={initialUser}
          initialBalances={initialBalances}
        >
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
