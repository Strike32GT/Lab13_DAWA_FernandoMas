'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    await signIn(provider, {
      callbackUrl: '/dashboard',
    });
  };

  const handleCredentialsSignIn = async () => {
    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setMessage(
      result?.error === 'CredentialsSignin'
        ? 'Correo o contraseña incorrectos.'
        : result?.error ?? 'No se pudo iniciar sesión.',
    );
  };

  const handleRegister = async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? 'No se pudo crear la cuenta.');
      return;
    }

    setMessage('Cuenta creada. Iniciando sesión...');
    await handleCredentialsSignIn();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isRegistering) {
        await handleRegister();
      } else {
        await handleCredentialsSignIn();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between bg-[#134E4A] p-8 text-[#F8FAFC]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#E2E8F0]">
              Autenticacion OAuth
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Accede a tu panel con tus proveedores favoritos
            </h1>
            <p className="mt-4 max-w-md text-[#E2E8F0]">
              Centraliza el ingreso con Google, GitHub, Discord o una cuenta creada con credenciales.
            </p>
          </div>
          <div className="mt-10 grid gap-3 text-sm">
            {['Google habilitado', 'GitHub conectado', 'Discord activo', 'Credenciales cifradas'].map((item) => (
              <div
                key={item}
                className="rounded border border-[#E2E8F0]/20 bg-white/10 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl text-[#134E4A] font-bold mb-2">
              {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-sm text-[#134E4A]/80 mb-6">
              {isRegistering
                ? 'Regístrate con correo y contraseña.'
                : 'Ingresa con credenciales o un proveedor externo.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#134E4A]">
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 w-full rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[#134E4A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                    autoComplete="name"
                    required={isRegistering}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#134E4A]">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[#134E4A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#134E4A]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[#134E4A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  required
                />
              </div>

              {message && (
                <p className="rounded bg-[#E2E8F0] px-3 py-2 text-sm text-[#134E4A]">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F766E] text-[#F8FAFC] py-2.5 px-4 rounded font-semibold hover:bg-[#134E4A] transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading
                  ? 'Procesando...'
                  : isRegistering
                    ? 'Registrarme'
                    : 'Iniciar sesión'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E2E8F0]" />
              <span className="text-xs uppercase text-[#134E4A]/70">o</span>
              <div className="h-px flex-1 bg-[#E2E8F0]" />
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => handleOAuthSignIn('google')}
                className="w-full border border-[#E2E8F0] bg-white text-[#134E4A] py-2.5 px-4 rounded hover:border-[#0F766E] hover:bg-[#F8FAFC] transition flex items-center justify-center gap-2"
              >
                <FaGoogle />
                Continuar con Google
              </button>

              <button
                onClick={() => handleOAuthSignIn('github')}
                className="w-full border border-[#E2E8F0] bg-white text-[#134E4A] py-2.5 px-4 rounded hover:border-[#0F766E] hover:bg-[#F8FAFC] transition flex items-center justify-center gap-2"
              >
                <FaGithub />
                Continuar con GitHub
              </button>

              <button
                onClick={() => handleOAuthSignIn('discord')}
                className="w-full border border-[#E2E8F0] bg-white text-[#134E4A] py-2.5 px-4 rounded hover:border-[#0F766E] hover:bg-[#F8FAFC] transition flex items-center justify-center gap-2"
              >
                <FaDiscord />
                Continuar con Discord
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsRegistering((current) => !current);
                setMessage('');
              }}
              className="mt-6 w-full text-sm font-medium text-[#0F766E] hover:text-[#134E4A]"
            >
              {isRegistering
                ? 'Ya tengo cuenta'
                : 'No tengo cuenta, quiero registrarme'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
