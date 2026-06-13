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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-[#134E4A] font-bold mb-4">
            Profile
          </h1>

          <div className="mb-6">
            <p className="text-[#134E4A] mb-2">
              Name: <span className="font-semibold">{session?.user?.name}</span>
            </p>
            <p className="text-[#134E4A] mb-2">
              Email: <span className="font-semibold">{session?.user?.email}</span>
            </p>
            {session?.user?.image && (
              <>
                <p className="text-[#134E4A] mb-2">
                  Image Profile:
                </p>
                <Image
                  height={100}
                  width={100}
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mt-4"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
