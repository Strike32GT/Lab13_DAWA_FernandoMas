"use client";

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signIn' })}
      className="bg-[#0F766E] text-[#F8FAFC] py-2 px-4 rounded hover:bg-[#0B5F59] transition"
    >
      Cerrar Sesión
    </button>
  );
}
