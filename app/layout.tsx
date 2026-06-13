import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Provider from "@/app/components/SessionProvider";
import UserMenu from "@/app/components/UserMenu";

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
        <nav className="w-full border-b border-[#0F766E]/20 bg-[#134E4A] text-[#F8FAFC] shadow-sm">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              MyAuthApp
            </Link>
            <ul className="flex items-center justify-center gap-5 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="rounded px-3 py-2 font-medium transition hover:bg-[#0F766E]"
                >
                  Dashboard
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link
                    href="/profile"
                    className="rounded px-3 py-2 font-medium transition hover:bg-[#0F766E]"
                  >
                    Profile
                  </Link>
                </li>
              )}
              {session?.user && (
                <li>
                  <UserMenu
                    name={session.user.name}
                    email={session.user.email}
                    image={session.user.image}
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
