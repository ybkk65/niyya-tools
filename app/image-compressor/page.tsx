"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import imageCompression from "browser-image-compression";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompressAlt, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

interface ImageData {
  original: File;
  compressed: File | null;
  originalPreview: string;
  compressedPreview: string | null;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export default function ImageCompressorPage() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
  ];

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      alert(
        "Format non supporté. Formats acceptés : JPG, PNG, WEBP, GIF, BMP, TIFF, SVG"
      );
      return;
    }

    setLoading(true);

    try {
      // Créer le preview de l'image originale
      const originalPreview = URL.createObjectURL(file);

      // Options de compression
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      // Compression de l'image
      const compressedFile = await imageCompression(file, options);

      // Créer le preview de l'image compressée
      const compressedPreview = URL.createObjectURL(compressedFile);

      // Calculer les stats
      const originalSize = file.size;
      const compressedSize = compressedFile.size;
      const compressionRatio =
        ((originalSize - compressedSize) / originalSize) * 100;

      setImageData({
        original: file,
        compressed: compressedFile,
        originalPreview,
        compressedPreview,
        originalSize,
        compressedSize,
        compressionRatio,
      });
    } catch (error) {
      console.error("Erreur lors de la compression:", error);
      alert("Erreur lors de la compression de l'image");
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
    if (!imageData?.compressed) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(imageData.compressed);
    link.download = `compressed-${imageData.original.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImageData(null);
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
            <FontAwesomeIcon icon={faCompressAlt} className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Compresseur d'Images
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Réduisez la taille de vos images sans perte de qualité visible.
            Support multi-formats pour tous vos besoins web.
          </p>
        </div>

        {/* Upload Zone */}
        {!imageData && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Qualité de compression ({quality}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-niyya-lime"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimum</span>
                  <span>Maximum</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Largeur maximale (px)
                </label>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-niyya-lime focus:ring-2 focus:ring-niyya-lime/20 transition-all"
                >
                  <option value={1024}>1024px</option>
                  <option value={1280}>1280px</option>
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
                    Compression en cours...
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
                    <span className="px-2 py-1 bg-white/5 rounded">TIFF</span>
                    <span className="px-2 py-1 bg-white/5 rounded">SVG</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {imageData && (
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-niyya-lime/10 border border-niyya-lime/30 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-niyya-lime mb-1">
                    {formatFileSize(imageData.originalSize)}
                  </div>
                  <div className="text-sm text-gray-400">Taille originale</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-niyya-lime mb-1">
                    {formatFileSize(imageData.compressedSize)}
                  </div>
                  <div className="text-sm text-gray-400">Taille compressée</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-niyya-lime mb-1">
                    -{Math.round(imageData.compressionRatio)}%
                  </div>
                  <div className="text-sm text-gray-400">Gain de poids</div>
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
                <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden mb-4">
                  <img
                    src={imageData.originalPreview}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taille :</span>
                  <span className="text-white font-semibold">
                    {formatFileSize(imageData.originalSize)}
                  </span>
                </div>
              </div>

              {/* Compressed */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Image compressée
                </h3>
                <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden mb-4">
                  <img
                    src={imageData.compressedPreview || ""}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taille :</span>
                  <span className="text-niyya-lime font-semibold">
                    {formatFileSize(imageData.compressedSize)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} variant="primary">
                Télécharger image compressée
              </Button>
              <Button onClick={handleReset} variant="outline">
                Nouvelle image
              </Button>
            </div>
          </div>
        )}

        {/* Tableau des formats supportés */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Formats supportés
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-semibold py-3 px-4">Format</th>
                  <th className="text-left text-gray-400 font-semibold py-3 px-4">Extension</th>
                  <th className="text-left text-gray-400 font-semibold py-3 px-4">Type</th>
                  <th className="text-center text-gray-400 font-semibold py-3 px-4">Compression</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">JPG/JPEG</td>
                  <td className="text-gray-400 py-3 px-4">.jpg, .jpeg</td>
                  <td className="text-gray-400 py-3 px-4">Raster</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">PNG</td>
                  <td className="text-gray-400 py-3 px-4">.png</td>
                  <td className="text-gray-400 py-3 px-4">Raster</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">WEBP</td>
                  <td className="text-gray-400 py-3 px-4">.webp</td>
                  <td className="text-gray-400 py-3 px-4">Raster</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">GIF</td>
                  <td className="text-gray-400 py-3 px-4">.gif</td>
                  <td className="text-gray-400 py-3 px-4">Raster (animé)</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">BMP</td>
                  <td className="text-gray-400 py-3 px-4">.bmp</td>
                  <td className="text-gray-400 py-3 px-4">Raster</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white font-semibold py-3 px-4">TIFF</td>
                  <td className="text-gray-400 py-3 px-4">.tiff, .tif</td>
                  <td className="text-gray-400 py-3 px-4">Raster</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
                <tr>
                  <td className="text-white font-semibold py-3 px-4">SVG</td>
                  <td className="text-gray-400 py-3 px-4">.svg</td>
                  <td className="text-gray-400 py-3 px-4">Vectoriel</td>
                  <td className="text-center py-3 px-4"><span className="text-niyya-lime">✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
