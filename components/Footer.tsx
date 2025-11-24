export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-niyya-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="text-lg font-bold text-niyya-lime mb-4">Niyya Tools</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plateforme d'outils internes développée par{" "}
              <a
                href="https://niyya.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-niyya-lime hover:underline"
              >
                Niyya Agency
              </a>
              , agence web spécialisée en création de sites internet.
            </p>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/#outils"
                  className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
                >
                  Nos outils
                </a>
              </li>
              <li>
                <a
                  href="https://niyya.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-niyya-lime transition-colors"
                >
                  Niyya Agency
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Des questions ou besoin d'un site web ?
            </p>
            <a
              href="https://niyya.fr/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-niyya-lime text-niyya-lime hover:bg-niyya-lime hover:text-niyya-darker transition-all"
            >
              Contactez-nous
            </a>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Niyya Agency. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
