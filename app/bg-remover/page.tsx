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
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [outputResolution, setOutputResolution] = useState<number>(99999); // Original par défaut
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  // Note: Le modèle IA est préchargé dès la page d'accueil pour une expérience instantanée

  const removeBackground = async (file: File): Promise<Blob> => {
    try {
      // Vérifier qu'on est bien côté client
      if (typeof window === 'undefined') {
        throw new Error('Cette fonction doit être exécutée côté client');
      }

      // Vérifier que file est bien un File
      if (!(file instanceof File)) {
        throw new Error('Le fichier fourni n\'est pas valide');
      }

      console.log('🚀 Début suppression fond pour:', file.name, 'Type:', file.type, 'Taille:', file.size);

      // Importer la bibliothèque
      let removeBg;
      try {
        const bgRemovalModule = await import("@imgly/background-removal");
        
        if (!bgRemovalModule || !bgRemovalModule.removeBackground) {
          throw new Error('Module de suppression de fond non disponible');
        }
        
        removeBg = bgRemovalModule.removeBackground;
        console.log('✅ Module @imgly/background-removal chargé');
      } catch (importError) {
        console.error("❌ Erreur import module:", importError);
        throw new Error('Le module de suppression de fond n\'a pas pu être chargé. Veuillez rafraîchir la page.');
      }

      // Configuration avec callback de progression
      const config = {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          console.log(`📊 Progression ${key}: ${percentage}%`);
          setProgress(percentage);
        },
      };

      // Suppression du fond
      let blob;
      try {
        console.log('⏳ Appel removeBackground...');
        blob = await removeBg(file, config);
        console.log('✅ Suppression terminée, blob:', blob);
      } catch (removeBgError) {
        console.error("❌ Erreur lors de la suppression:", removeBgError);
        
        // Vérifier si c'est l'erreur url.replace
        const errorStr = String(removeBgError);
        if (errorStr.includes('url.replace')) {
          console.log('⚠️ Erreur url.replace détectée, essai sans config...');
          try {
            blob = await removeBg(file);
          } catch (secondError) {
            console.error("❌ Échec même sans config:", secondError);
            throw new Error('Impossible de traiter l\'image. La bibliothèque IA rencontre des difficultés.');
          }
        } else {
          throw removeBgError;
        }
      }

      // Vérifier que le blob est valide
      if (!blob || !(blob instanceof Blob)) {
        throw new Error('Le résultat de la suppression n\'est pas valide');
      }
      
      console.log('🎨 Traitement de l\'image de sortie...');
      // Redimensionner si nécessaire et convertir au format choisi
      blob = await processOutputImage(blob);
      console.log('✅ Traitement terminé');
      
      return blob;
    } catch (error) {
      console.error("❌ Erreur suppression fond:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Messages d'erreur plus clairs
      if (errorMessage.includes('wasm') || errorMessage.includes('env') || errorMessage.includes('undefined') || errorMessage.includes('url.replace')) {
        throw new Error('Le système de suppression de fond rencontre une erreur technique. Veuillez rafraîchir la page et réessayer avec une autre image.');
      }
      
      throw error;
    }
  };

  const processOutputImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionner si nécessaire
        if (outputResolution !== 99999 && width > outputResolution) {
          const ratio = outputResolution / width;
          width = outputResolution;
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error("Canvas context non disponible"));
          return;
        }

        // Pour JPG, fond blanc, sinon transparent
        if (outputFormat === "jpg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (resultBlob) => {
            if (resultBlob) {
              resolve(resultBlob);
            } else {
              reject(new Error("Erreur conversion blob"));
            }
          },
          outputFormat === "jpg" ? "image/jpeg" : "image/png",
          outputFormat === "jpg" ? 0.95 : undefined
        );
      };

      img.onerror = () => reject(new Error("Erreur chargement image"));
      img.src = URL.createObjectURL(blob);
    });
  };


  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      alert("Format non supporté. Formats acceptés : JPG, PNG, WEBP");
      return;
    }

    // Limite de taille (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image trop volumineuse. Taille maximale : 10 MB");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const originalPreview = URL.createObjectURL(file);

      // Suppression du fond avec IA
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
      setProgress(0);
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
    const suffix = outputFormat === "png" ? "transparent" : "no-bg";
    link.download = `${originalName || "image"}-${suffix}.${outputFormat}`;
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
            Supprimez automatiquement le fond de vos images avec l'intelligence
            artificielle. Choisissez le format et la résolution de sortie. 100% gratuit et privé.
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Format de sortie
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-niyya-lime focus:ring-2 focus:ring-niyya-lime/20 transition-all"
                >
                  <option value="png">PNG (avec transparence)</option>
                  <option value="jpg">JPG (fond blanc)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Résolution de sortie
                </label>
                <select
                  value={outputResolution}
                  onChange={(e) => setOutputResolution(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-niyya-lime focus:ring-2 focus:ring-niyya-lime/20 transition-all"
                >
                  <option value={1024}>1024px</option>
                  <option value={1920}>1920px (Full HD)</option>
                  <option value={2560}>2560px (2K)</option>
                  <option value={3840}>3840px (4K)</option>
                  <option value={99999}>Original</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop Zone */}
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
                  <div className="max-w-xs mx-auto">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-niyya-lime h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{progress}%</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    L'IA analyse votre image... Cela peut prendre quelques
                    secondes.
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
            {/* Stats */}
            <div className="bg-niyya-lime/10 border border-niyya-lime/30 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatFileSize(result.originalSize)}
                  </div>
                  <div className="text-sm text-gray-400">Taille originale</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-niyya-lime mb-1">
                    {formatFileSize(result.resultSize)}
                  </div>
                  <div className="text-sm text-gray-400">Avec fond supprimé</div>
                </div>
              </div>
            </div>

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

              {/* Result with transparent background pattern */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-niyya-lime mb-4">
                  Fond supprimé ({outputFormat.toUpperCase()})
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
                Télécharger {outputFormat.toUpperCase()}
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
