import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/app/components/SessionProvider";

const geistSans = Geist({});
const geistMono = Geist_Mono({});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={geistSans.className}>
      <body className={`${geistMono.className} antialiased`}>
        <nav className="w-full bg-[#134E4A] text-[#F8FAFC] shadow-sm">
          <div className="mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              MyAuthApp
            </Link>
            <ul className="flex items-center justify-center gap-6 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-[#E2E8F0]">
                  Dashboard
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link href="/profile" className="hover:text-[#E2E8F0]">
                    Profile
                  </Link>
                </li>
              )}
              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}
              {session?.user?.image && (
                <li>
                  <Image
                    height={100}
                    width={100}
                    src={session?.user?.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </li>
              )}
            </ul>
          </div>
        </nav>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
