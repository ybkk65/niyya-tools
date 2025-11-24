"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

interface RemovalResult {
  originalFile: File;
  originalPreview: string;
  resultPreview: string | null;
  resultBlob: Blob | null;
  originalSize: number;
  resultSize: number;
}

export default function BackgroundRemoverPage() {
  const [result, setResult] = useState<RemovalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/webp",
  ];

  const removeBackground = async (file: File): Promise<Blob> => {
    // Option 1: Utiliser Remove.bg API (nécessite une clé API)
    // Vous pouvez obtenir une clé gratuite sur https://www.remove.bg/api
    const API_KEY = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY || 'YOUR_API_KEY';
    
    if (API_KEY === 'YOUR_API_KEY') {
      throw new Error('Veuillez configurer votre clé API Remove.bg dans les variables d\'environnement');
    }

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');
    formData.append('format', outputFormat);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du fond');
    }

    return await response.blob();
  };

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      alert("Format non supporté. Formats acceptés : JPG, PNG, WEBP");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image trop volumineuse. Taille maximale : 10 MB");
      return;
    }

    setLoading(true);

    try {
      const originalPreview = URL.createObjectURL(file);
      const resultBlob = await removeBackground(file);
      const resultPreview = URL.createObjectURL(resultBlob);

      setResult({
        originalFile: file,
        originalPreview,
        resultPreview,
        resultBlob,
        originalSize: file.size,
        resultSize: resultBlob.size,
      });
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du fond"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownload = () => {
    if (!result?.resultBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(result.resultBlob);
    const originalName = result.originalFile.name
      .split(".")
      .slice(0, -1)
      .join(".");
    link.download = `${originalName || "image"}-no-bg.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
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
            <FontAwesomeIcon icon={faScissors} className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Suppresseur de Fond
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Supprimez automatiquement le fond de vos images. 100% gratuit et privé.
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${
                  isDragging
                    ? "border-niyya-lime bg-niyya-lime/10"
                    : "border-white/20 hover:border-niyya-lime/50 hover:bg-white/5"
                }
                ${loading ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FORMATS.join(",")}
                onChange={handleFileInputChange}
                className="hidden"
                disabled={loading}
              />

              {loading ? (
                <div className="space-y-4">
                  <div className="animate-spin h-12 w-12 border-4 border-niyya-lime border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-white font-semibold">
                    Suppression du fond en cours...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="w-16 h-16 text-niyya-lime/50" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Glissez-déposez votre image ici
                  </h3>
                  <p className="text-gray-400 mb-4">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <div className="inline-flex flex-wrap gap-2 justify-center text-xs text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-white/5 rounded">JPG</span>
                    <span className="px-2 py-1 bg-white/5 rounded">PNG</span>
                    <span className="px-2 py-1 bg-white/5 rounded">WEBP</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Taille maximale : 10 MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Image Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Image originale
                </h3>
                <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={result.originalPreview}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Result */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-niyya-lime mb-4">
                  Fond supprimé
                </h3>
                <div
                  className="relative aspect-square rounded-lg overflow-hidden"
                  style={{
                    background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px",
                  }}
                >
                  <img
                    src={result.resultPreview || ""}
                    alt="Sans fond"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} variant="primary">
                Télécharger
              </Button>
              <Button onClick={handleReset} variant="outline">
                Nouvelle image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
