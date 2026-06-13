import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signIn');
  }

  const tasks = [
    "Revisar el estado de la sesion OAuth.",
    "Actualizar datos del perfil si el proveedor los sincroniza.",
    "Probar acceso con Google, GitHub y Discord.",
    "Cerrar sesion desde el menu del avatar.",
  ];

  const providers = ["Google", "GitHub", "Discord", "Credenciales"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-lg bg-[#134E4A] p-8 text-[#F8FAFC] shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#E2E8F0]">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            Bienvenido de nuevo, {session.user?.name ?? "usuario"}
          </h1>
          <p className="mt-3 max-w-2xl text-[#E2E8F0]">
            Tu sesion esta activa y puedes administrar tu perfil desde el menu superior.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          {providers.map((provider) => (
            <div
              key={provider}
              className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-[#134E4A]/70">Proveedor</p>
              <p className="mt-2 text-xl font-bold text-[#134E4A]">{provider}</p>
              <span className="mt-4 inline-flex rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-semibold text-[#0F766E]">
                Disponible
              </span>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#134E4A]">Tareas rapidas</h2>
            <ul className="mt-5 space-y-3">
              {tasks.map((task) => (
                <li
                  key={task}
                  className="flex items-center gap-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[#134E4A]"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0F766E]" />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#134E4A]">Resumen</h2>
            <dl className="mt-5 space-y-4 text-[#134E4A]">
              <div className="rounded bg-[#F8FAFC] p-4">
                <dt className="text-sm text-[#134E4A]/70">Usuario</dt>
                <dd className="mt-1 font-semibold">{session.user?.name}</dd>
              </div>
              <div className="rounded bg-[#F8FAFC] p-4">
                <dt className="text-sm text-[#134E4A]/70">Correo</dt>
                <dd className="mt-1 break-all font-semibold">{session.user?.email}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
