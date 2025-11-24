import ToolCard from "@/components/ToolCard";
import { 
  faQrcode, 
  faCompressAlt, 
  faArrowsRotate, 
  faScissors,
  faFileExport,
  faFileArchive
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const tools = [
    {
      title: "Générateur de QR Code",
      description: "Créez des QR codes personnalisés pour vos projets clients et campagnes marketing.",
      href: "/qr-code",
      icon: faQrcode,
    },
    {
      title: "Compresseur d'Images",
      description: "Optimisez vos images pour le web. Support multi-formats.",
      href: "/image-compressor",
      icon: faCompressAlt,
    },
    {
      title: "Convertisseur d'Images",
      description: "Convertissez vos images entre différents formats.",
      href: "/image-converter",
      icon: faArrowsRotate,
    },
    {
      title: "Suppresseur de Fond",
      description: "Suppression automatique de fond avec IA. Export PNG transparent.",
      href: "/bg-remover",
      icon: faScissors,
    },
    {
      title: "Convertisseur de Fichiers",
      description: "Convertissez vos documents et données entre différents formats (PDF, Word, TXT, etc.).",
      href: "/file-converter",
      icon: faFileExport,
    },
    {
      title: "Compresseur de Fichiers",
      description: "Compressez vos fichiers en ZIP ou décompressez des archives (ZIP, RAR, 7Z).",
      href: "/file-compressor",
      icon: faFileArchive,
    },
  ];

  return (
    <>
      {/* Hero Section - Version Interne */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Simple */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-niyya-lime/10 text-sm font-semibold text-niyya-lime mb-6">
              Usage interne
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              Niyya Tools
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl">
              Boîte à outils interne pour l'équipe Niyya Agency
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="outils" className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              Outils disponibles
            </h2>
            <p className="text-gray-500 text-sm">
              {tools.length} outils à votre disposition
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Message outils en cours */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              D'autres outils sont en cours de développement...
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
