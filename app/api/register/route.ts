import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Completa nombre, correo y contraseña." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 8 caracteres." },
        { status: 400 },
      );
    }

    const user = await createUser({ name, email, password });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo registrar el usuario.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
