"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

export default function QRCodePage() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    // Reset states
    setError(null);
    setQrCode(null);

    // Validation
    if (!url.trim()) {
      setError("Veuillez entrer une URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("URL invalide. Format attendu : https://example.com");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/qr-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération du QR code");
      }

      setQrCode(data.qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setUrl("");
    setQrCode(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-niyya-lime transition-colors inline-flex items-center gap-2"
          >
            ← Retour aux outils
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-niyya-lime/10 text-niyya-lime">
            <FontAwesomeIcon icon={faQrcode} className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Générateur de QR Code
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Créez des QR codes personnalisés instantanément. Parfait pour vos campagnes marketing, cartes de visite ou partage de liens.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-white mb-2">
                URL à convertir
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="https://example.com"
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-niyya-lime focus:ring-2 focus:ring-niyya-lime/20 transition-all disabled:opacity-50"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </span>
              ) : (
                "Générer le QR Code"
              )}
            </Button>
          </div>

          {/* QR Code Display */}
          {qrCode && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="text-center space-y-6">
                <div className="inline-block p-6 bg-white rounded-2xl">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="primary"
                  >
                    Télécharger PNG
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                  >
                    Nouveau QR Code
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  QR code généré avec succès
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
