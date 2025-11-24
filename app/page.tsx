import ToolCard from "@/components/ToolCard";

export default function Home() {
  const tools = [
    {
      title: "Générateur de QR Code",
      description: "Créez des QR codes personnalisés en quelques secondes. Idéal pour vos campagnes marketing, cartes de visite ou sites web.",
      href: "/qr-code",
      icon: "📱",
    },
    // Vous pouvez ajouter d'autres outils ici plus tard
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-niyya-lime/5 to-transparent pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-niyya-lime/10 border border-niyya-lime/20">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-semibold text-niyya-lime">
                Outils internes Niyya Agency
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight">
            Les outils qui{" "}
            <span className="text-niyya-lime">simplifient</span>
            <br />
            votre quotidien
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg sm:text-xl text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            Plateforme d'outils internes développée par{" "}
            <a
              href="https://niyya.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-niyya-lime font-semibold hover:underline"
            >
              Niyya Agency
            </a>
            . Accédez à une suite d'outils professionnels pour booster votre productivité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#outils"
              className="inline-flex items-center px-8 py-4 text-base font-semibold rounded-lg bg-niyya-lime text-niyya-darker hover:bg-niyya-lime/90 transition-all hover:scale-105"
            >
              Découvrir les outils →
            </a>
            <a
              href="https://niyya.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 text-base font-semibold rounded-lg border-2 border-white/10 text-white hover:border-niyya-lime/50 hover:bg-white/5 transition-all"
            >
              Visiter Niyya Agency
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-niyya-lime mb-2">
                {tools.length}+
              </div>
              <div className="text-sm text-gray-400">Outils disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-niyya-lime mb-2">100%</div>
              <div className="text-sm text-gray-400">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-niyya-lime mb-2">24/7</div>
              <div className="text-sm text-gray-400">Accessible</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-niyya-lime mb-2">Pro</div>
              <div className="text-sm text-gray-400">Qualité agence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="outils" className="py-20 px-4 sm:px-6 lg:px-8 bg-niyya-dark/30">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Nos <span className="text-niyya-lime">Outils</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Une sélection d'outils professionnels conçus pour vous faire gagner du temps
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
              />
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              💡 D'autres outils arrivent bientôt...
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
