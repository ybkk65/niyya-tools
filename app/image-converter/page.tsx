"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

interface ConversionResult {
  originalFile: File;
  originalPreview: string;
  convertedPreview: string | null;
  convertedBlob: Blob | null;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
}

export default function ImageConverterPage() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [quality, setQuality] = useState(0.92);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const FORMATS = [
    { value: "png", label: "PNG", mime: "image/png", quality: false },
    { value: "jpg", label: "JPG/JPEG", mime: "image/jpeg", quality: true },
    { value: "webp", label: "WEBP", mime: "image/webp", quality: true },
    { value: "bmp", label: "BMP", mime: "image/bmp", quality: false },
    { value: "gif", label: "GIF", mime: "image/gif", quality: false },
    { value: "ico", label: "ICO", mime: "image/x-icon", quality: false },
    { value: "svg", label: "SVG", mime: "image/svg+xml", quality: false },
  ];

  const ACCEPTED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
    "image/tiff",
  ];

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFormatFromMime = (mimeType: string): string => {
    const map: { [key: string]: string } = {
      "image/jpeg": "JPG",
      "image/jpg": "JPG",
      "image/png": "PNG",
      "image/webp": "WEBP",
      "image/gif": "GIF",
      "image/bmp": "BMP",
      "image/svg+xml": "SVG",
      "image/tiff": "TIFF",
    };
    return map[mimeType] || "Unknown";
  };

  const convertImage = async (file: File, format: string): Promise<Blob> => {
    // Si SVG vers SVG, garder le fichier original
    if (file.type === "image/svg+xml" && format === "svg") {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error("Canvas non disponible"));
          return;
        }

        // Définir les dimensions du canvas
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Contexte 2D non disponible"));
          return;
        }

        // Pour les formats avec transparence (PNG, WEBP)
        if (format === "png" || format === "webp") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          // Pour JPG, BMP, etc., fond blanc
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Dessiner l'image
        ctx.drawImage(img, 0, 0);

        // Convertir au format cible
        const formatConfig = FORMATS.find((f) => f.value === format);
        if (!formatConfig) {
          reject(new Error("Format non supporté"));
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Erreur de conversion"));
            }
          },
          formatConfig.mime,
          formatConfig.quality ? quality : undefined
        );
      };

      img.onerror = () => {
        reject(new Error("Erreur de chargement de l'image"));
      };

      reader.onerror = () => {
        reject(new Error("Erreur de lecture du fichier"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      alert(
        "Format non supporté. Formats acceptés : JPG, PNG, WEBP, GIF, BMP, SVG, TIFF"
      );
      return;
    }

    setLoading(true);

    try {
      const originalPreview = URL.createObjectURL(file);
      const originalFormat = getFormatFromMime(file.type);

      // Conversion
      const convertedBlob = await convertImage(file, targetFormat);
      const convertedPreview = URL.createObjectURL(convertedBlob);

      setResult({
        originalFile: file,
        originalPreview,
        convertedPreview,
        convertedBlob,
        originalFormat,
        targetFormat: targetFormat.toUpperCase(),
        originalSize: file.size,
        convertedSize: convertedBlob.size,
      });
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de la conversion de l'image"
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
    if (!result?.convertedBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(result.convertedBlob);
    const originalName = result.originalFile.name.split(".").slice(0, -1).join(".");
    link.download = `${originalName || "converted"}.${targetFormat}`;
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

  const selectedFormat = FORMATS.find((f) => f.value === targetFormat);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Canvas caché pour conversion */}
        <canvas ref={canvasRef} className="hidden" />

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
            <FontAwesomeIcon icon={faArrowsRotate} className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Convertisseur d'Images
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Convertissez vos images entre différents formats en un clic. Support
            de tous les formats populaires.
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            {/* Format Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-white mb-4">
                Format de sortie
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {FORMATS.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setTargetFormat(format.value)}
                    className={`
                      px-4 py-3 rounded-lg font-semibold text-sm transition-all
                      ${
                        targetFormat === format.value
                          ? "bg-niyya-lime text-niyya-darker"
                          : "bg-white/5 text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Setting (only for JPG, WEBP) */}
            {selectedFormat?.quality && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-white mb-2">
                  Qualité ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-niyya-lime"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Basse</span>
                  <span>Haute</span>
                </div>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${
                  isDragging
                    ? "border-niyya-lime bg-niyya-lime/10"
                    : "border-white/20 hover:border-niyya-lime/50 hover:bg-white/5"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FORMATS.join(",")}
                onChange={handleFileInputChange}
                className="hidden"
              />

              {loading ? (
                <div className="space-y-4">
                  <div className="animate-spin h-12 w-12 border-4 border-niyya-lime border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-white font-semibold">
                    Conversion en cours vers {targetFormat.toUpperCase()}...
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
                  <div className="inline-flex flex-wrap gap-2 justify-center text-xs text-gray-500">
                    <span className="px-2 py-1 bg-white/5 rounded">JPG</span>
                    <span className="px-2 py-1 bg-white/5 rounded">PNG</span>
                    <span className="px-2 py-1 bg-white/5 rounded">WEBP</span>
                    <span className="px-2 py-1 bg-white/5 rounded">GIF</span>
                    <span className="px-2 py-1 bg-white/5 rounded">BMP</span>
                    <span className="px-2 py-1 bg-white/5 rounded">SVG</span>
                    <span className="px-2 py-1 bg-white/5 rounded">TIFF</span>
                  </div>
                  <p className="text-niyya-lime font-semibold mt-4">
                    → Conversion vers {targetFormat.toUpperCase()}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Conversion Info Card */}
            <div className="bg-niyya-lime/10 border border-niyya-lime/30 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-4 text-center flex-wrap">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {result.originalFormat}
                  </div>
                  <div className="text-sm text-gray-400">Format d'origine</div>
                </div>
                <div className="text-3xl text-niyya-lime">→</div>
                <div>
                  <div className="text-2xl font-bold text-niyya-lime mb-1">
                    {result.targetFormat}
                  </div>
                  <div className="text-sm text-gray-400">Format converti</div>
                </div>
              </div>
            </div>

            {/* Size Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatFileSize(result.originalSize)}
                </div>
                <div className="text-sm text-gray-400">Taille originale</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-niyya-lime mb-2">
                  {formatFileSize(result.convertedSize)}
                </div>
                <div className="text-sm text-gray-400">Taille convertie</div>
              </div>
            </div>

            {/* Image Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Image originale ({result.originalFormat})
                </h3>
                <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={result.originalPreview}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Converted */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-niyya-lime mb-4">
                  Image convertie ({result.targetFormat})
                </h3>
                <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={result.convertedPreview || ""}
                    alt="Converted"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} variant="primary">
                Télécharger image convertie
              </Button>
              <Button onClick={handleReset} variant="outline">
                Nouvelle conversion
              </Button>
            </div>
          </div>
        )}

        {/* Conversion Matrix */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Conversions supportées
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-semibold py-3 px-4">
                    De →
                  </th>
                  {FORMATS.map((format) => (
                    <th
                      key={format.value}
                      className="text-center text-niyya-lime font-semibold py-3 px-2"
                    >
                      {format.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["JPG", "PNG", "WEBP", "GIF", "BMP", "SVG", "TIFF"].map(
                  (source) => (
                    <tr key={source} className="border-b border-white/5">
                      <td className="text-white font-semibold py-3 px-4">
                        {source}
                      </td>
                      {FORMATS.map((target) => (
                        <td key={target.value} className="text-center py-3 px-2">
                          <span className="text-niyya-lime text-xl">✓</span>
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
