export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-niyya-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Info */}
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {currentYear} <span className="text-white font-semibold">Niyya Agency</span> - Outils internes
            </p>
          </div>

          {/* Liens */}
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
            >
              Accueil
            </a>
            <a
              href="https://www.niyya-agency.com/admin/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
            >
              Dashboard
            </a>
            <a
              href="https://www.niyya-agency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
            >
              Site Web
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
