import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-brand-gold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-gold text-white rounded-lg hover:opacity-90 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}