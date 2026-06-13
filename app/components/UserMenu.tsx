"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#E2E8F0] bg-[#0F766E] text-sm font-bold text-[#F8FAFC] shadow-sm transition group-hover:border-white"
        aria-label="Menu de usuario"
      >
        {image ? (
          <Image
            height={44}
            width={44}
            src={image}
            alt={name ?? "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          initials ?? "U"
        )}
      </button>

      <div className="invisible absolute right-0 top-full z-20 w-64 translate-y-3 rounded-lg border border-[#E2E8F0] bg-white p-3 text-[#134E4A] opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
        <div className="border-b border-[#E2E8F0] pb-3">
          <p className="truncate text-sm font-semibold">{name ?? "Usuario"}</p>
          <p className="truncate text-xs text-[#134E4A]/70">{email ?? "Sesion activa"}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/signIn" })}
          className="mt-3 w-full rounded bg-[#0F766E] px-4 py-2 text-sm font-semibold text-[#F8FAFC] transition hover:bg-[#134E4A]"
        >
          Cerrar sesion
        </button>
      </div>
    </div>
  );
}
