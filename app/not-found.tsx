import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#134E4A]">
          Pagina no encontrada
        </h1>
        <p className="mt-4 text-[#134E4A]/80">
          La ruta que intentas abrir no existe o fue movida.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded bg-[#0F766E] px-5 py-2 font-medium text-[#F8FAFC] transition hover:bg-[#134E4A]"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
