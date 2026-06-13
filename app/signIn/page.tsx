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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl text-gray-900 font-bold mb-2 text-center">
          {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          {isRegistering
            ? 'Regístrate con correo y contraseña.'
            : 'Ingresa con credenciales o un proveedor externo.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-700"
                autoComplete="name"
                required={isRegistering}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-700"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-700"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              required
            />
          </div>

          {message && (
            <p className="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-black transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading
              ? 'Procesando...'
              : isRegistering
                ? 'Registrarme'
                : 'Iniciar sesión'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase text-gray-500">o</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={() => handleOAuthSignIn('google')}
          className="mb-3 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
        >
          <FaGoogle />
          Continuar con Google
        </button>

        <button
          onClick={() => handleOAuthSignIn('github')}
          className="mb-3 w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
        >
          <FaGithub />
          Continuar con GitHub
        </button>

        <button
          onClick={() => handleOAuthSignIn('discord')}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <FaDiscord />
          Continuar con Discord
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegistering((current) => !current);
            setMessage('');
          }}
          className="mt-6 w-full text-sm font-medium text-gray-700 hover:text-black"
        >
          {isRegistering
            ? 'Ya tengo cuenta'
            : 'No tengo cuenta, quiero registrarme'}
        </button>
      </div>
    </div>
  );
}
