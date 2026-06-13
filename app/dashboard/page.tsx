import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signIn');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-[#134E4A] font-bold mb-4">
            Dashboard
          </h1>
          <div className="mb-6">
            <p className="text-[#134E4A] mb-2">
              Bienvenido, <span className="font-semibold">{session?.user?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
