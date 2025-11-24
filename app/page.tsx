"use client";

import { useEffect, useState } from "react";
import ToolCard from "@/components/ToolCard";
import { 
  faQrcode, 
  faCompressAlt, 
  faArrowsRotate, 
  faScissors 
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAIReady, setIsAIReady] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Précharger le modèle IA dès le chargement de la page d'accueil
  useEffect(() => {
    const preloadAI = async (attempt = 1) => {
      try {
        setIsAILoading(true);
        setAiError(null);
        console.log(`🚀 Tentative ${attempt}/3 : Préchargement du modèle IA...`);
        
        // Timeout de 90 secondes
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 90000)
        );
        
        const loadPromise = (async () => {
          const { preload } = await import("@imgly/background-removal");
          await preload({
            model: "isnet",
          });
        })();
        
        await Promise.race([loadPromise, timeoutPromise]);
        
        setIsAIReady(true);
        setRetryCount(0);
        console.log("✅ Modèle IA préchargé et prêt !");
      } catch (error) {
        console.error(`❌ Tentative ${attempt} échouée:`, error);
        
        // Retry jusqu'à 3 fois
        if (attempt < 3) {
          setRetryCount(attempt);
          console.log(`🔄 Nouvelle tentative dans 5 secondes...`);
          setTimeout(() => preloadAI(attempt + 1), 5000);
        } else {
          // Après 3 tentatives, on abandonne mais on permet quand même l'utilisation
          setAiError(
            error instanceof Error && error.message === 'Timeout'
              ? "Connexion trop lente. Le modèle se chargera lors de l'utilisation."
              : "Impossible de précharger le modèle. Il se chargera lors de l'utilisation."
          );
          setIsAIReady(false);
          setRetryCount(0);
          console.log("⚠️ Préchargement abandonné. Le modèle se chargera à la demande.");
        }
      } finally {
        if (attempt >= 3 || isAIReady) {
          setIsAILoading(false);
        }
      }
    };

    // Lancer le préchargement après 2 secondes
    const timer = setTimeout(() => {
      preloadAI();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Indicateur de préchargement IA */}
          {isAILoading && (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-niyya-lime/10 border border-niyya-lime/30 rounded-lg">
                <div className="animate-spin h-5 w-5 border-2 border-niyya-lime border-t-transparent rounded-full"></div>
                <div className="text-left">
                  <p className="text-sm text-niyya-lime font-semibold">
                    Préchargement du modèle IA...
                    {retryCount > 0 && ` (Tentative ${retryCount + 1}/3)`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {retryCount > 0 
                      ? "Connexion lente détectée, nouvelle tentative..."
                      : "Le suppresseur de fond sera instantané"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {isAIReady && !aiError && (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-green-500 text-xl">✅</span>
                <div className="text-left">
                  <p className="text-sm text-green-400 font-semibold">
                    Modèle IA prêt !
                  </p>
                  <p className="text-xs text-gray-400">
                    Suppression de fond instantanée disponible
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur avec fallback */}
          {aiError && (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <span className="text-orange-500 text-xl">⚠️</span>
                <div className="text-left">
                  <p className="text-sm text-orange-400 font-semibold">
                    Connexion lente détectée
                  </p>
                  <p className="text-xs text-gray-400">
                    {aiError}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    L'outil fonctionnera quand même, avec un temps de chargement initial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message outils en cours */}
          {!isAILoading && !isAIReady && !aiError && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                D'autres outils sont en cours de développement...
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
