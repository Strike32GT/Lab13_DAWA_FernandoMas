import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signIn');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-md">
          <div className="h-32 bg-[#134E4A]" />
          <div className="px-8 pb-8">
            <div className="-mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-5">
                {session.user?.image ? (
                  <Image
                    height={112}
                    width={112}
                    src={session.user.image}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#0F766E] text-3xl font-bold text-[#F8FAFC] shadow-md">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div className="pb-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
                    Perfil
                  </p>
                  <h1 className="text-3xl font-bold text-[#134E4A]">
                    {session.user?.name ?? "Usuario"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#134E4A]/70">Nombre</p>
                <p className="mt-2 text-lg font-semibold text-[#134E4A]">
                  {session.user?.name ?? "Sin nombre"}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#134E4A]/70">Correo</p>
                <p className="mt-2 break-all text-lg font-semibold text-[#134E4A]">
                  {session.user?.email ?? "Sin correo"}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#134E4A]/70">Estado</p>
                <p className="mt-2 text-lg font-semibold text-[#0F766E]">
                  Sesion activa
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#134E4A]/70">Acceso</p>
                <p className="mt-2 text-lg font-semibold text-[#134E4A]">
                  Ruta protegida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
