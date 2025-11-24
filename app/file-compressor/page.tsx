"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive, faCloudArrowUp, faSpinner, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";

interface FileItem {
  file: File;
  id: string;
  size: number;
}

interface CompressResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export default function FileCompressorPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"compress" | "decompress">("compress");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressFiles = async (fileList: FileItem[]): Promise<CompressResult> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Pour une vraie compression, utiliser JSZip
        // Ici on simule la compression
        
        const totalSize = fileList.reduce((sum, item) => sum + item.size, 0);
        
        // Simulation de compression (attente)
        await new Promise(r => setTimeout(r, 2000));
        
        // Créer un blob simulé (dans la vraie version, utiliser JSZip)
        const content = `Archive ZIP simulée\n\nFichiers inclus:\n${fileList.map(f => `- ${f.file.name} (${formatFileSize(f.size)})`).join('\n')}\n\nTotal: ${fileList.length} fichier(s)`;
        const blob = new Blob([content], { type: 'application/zip' });
        
        // Calculer le ratio de compression (simulation: ~30% de réduction)
        const compressedSize = blob.size;
        const compressionRatio = ((totalSize - compressedSize) / totalSize) * 100;
        
        resolve({
          blob,
          filename: 'archive.zip',
          originalSize: totalSize,
          compressedSize,
          compressionRatio: Math.max(0, compressionRatio),
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const decompressFile = async (file: File): Promise<CompressResult> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Simulation de décompression
        await new Promise(r => setTimeout(r, 1500));
        
        const content = `Fichiers extraits de ${file.name}:\n\n- document.pdf\n- image.jpg\n- data.xlsx\n\nTotal: 3 fichiers extraits`;
        const blob = new Blob([content], { type: 'text/plain' });
        
        resolve({
          blob,
          filename: 'extraction-info.txt',
          originalSize: file.size,
          compressedSize: blob.size,
          compressionRatio: 0,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      size: file.size,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
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
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      alert("Veuillez ajouter au moins un fichier");
      return;
    }

    try {
      setLoading(true);
      const result = await compressFiles(files);
      setResult(result);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la compression");
    } finally {
      setLoading(false);
    }
  };

  const handleDecompress = async () => {
    if (files.length === 0) {
      alert("Veuillez ajouter une archive");
      return;
    }

    try {
      setLoading(true);
      const result = await decompressFile(files[0].file);
      setResult(result);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la décompression");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-niyya-lime mb-4 transition-colors"
          >
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <FontAwesomeIcon icon={faFileArchive} className="text-niyya-lime" />
            Compresseur de Fichiers
          </h1>
          <p className="text-gray-400">
            Compressez vos fichiers en ZIP ou décompressez des archives
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setMode("compress");
                handleReset();
              }}
              disabled={loading}
              className={`px-6 py-4 rounded-lg font-medium transition-all ${
                mode === "compress"
                  ? "bg-niyya-lime text-black"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
              Compresser
            </button>
            <button
              onClick={() => {
                setMode("decompress");
                handleReset();
              }}
              disabled={loading}
              className={`px-6 py-4 rounded-lg font-medium transition-all ${
                mode === "decompress"
                  ? "bg-niyya-lime text-black"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Décompresser
            </button>
          </div>
        </div>

        {/* Zone de dépôt */}
        {!result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all mb-6 ${
              isDragging
                ? "border-niyya-lime bg-niyya-lime/10"
                : "border-gray-700 hover:border-gray-600"
            } ${loading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="text-5xl text-niyya-lime animate-spin"
                />
                <p className="text-gray-400">
                  {mode === "compress" ? "Compression en cours..." : "Décompression en cours..."}
                </p>
              </div>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="text-5xl text-gray-600 mb-4"
                />
                <p className="text-lg font-semibold text-white mb-2">
                  {mode === "compress"
                    ? "Glissez-déposez vos fichiers ici"
                    : "Glissez-déposez votre archive ici"}
                </p>
                <p className="text-gray-400 mb-6 text-sm">
                  {mode === "compress"
                    ? "Tous types de fichiers acceptés (max 50MB par fichier)"
                    : "ZIP, RAR, 7Z, TAR.GZ (max 100MB)"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={mode === "compress"}
                  accept={mode === "decompress" ? ".zip,.rar,.7z,.tar,.gz,.tar.gz" : undefined}
                  onChange={handleInputChange}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="mx-auto"
                >
                  Choisir {mode === "compress" ? "des fichiers" : "une archive"}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Liste des fichiers */}
        {files.length > 0 && !result && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Fichiers sélectionnés ({files.length})
              </h2>
              <p className="text-sm text-gray-400">
                Total: {formatFileSize(totalSize)}
              </p>
            </div>
            
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.file.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={mode === "compress" ? handleCompress : handleDecompress}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  {mode === "compress" ? "Compression..." : "Décompression..."}
                </>
              ) : (
                <>
                  {mode === "compress" ? "Compresser" : "Décompresser"}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              {mode === "compress" ? "Compression terminée" : "Décompression terminée"}
            </h2>

            {mode === "compress" && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Taille originale</p>
                  <p className="text-2xl font-bold text-white">
                    {formatFileSize(result.originalSize)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Taille compressée</p>
                  <p className="text-2xl font-bold text-niyya-lime">
                    {formatFileSize(result.compressedSize)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Économie</p>
                  <p className="text-2xl font-bold text-green-400">
                    {result.compressionRatio.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-400">
                <strong>Note :</strong> Cette démo simule la compression/décompression. 
                Pour une vraie implémentation, vous devriez utiliser JSZip, pako, ou une API backend 
                avec des bibliothèques comme zlib, gzip, etc.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1">
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Télécharger
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex-1"
              >
                Nouveau
              </Button>
            </div>
          </div>
        )}

        {/* Informations */}
        <div className="mt-8 bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-3">
            Formats supportés
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Compression :</strong>
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• ZIP (sortie)</li>
                <li>• Tous types de fichiers</li>
                <li>• Multi-fichiers</li>
                <li>• Max 50MB par fichier</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Décompression :</strong>
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• ZIP (.zip)</li>
                <li>• RAR (.rar)</li>
                <li>• 7-Zip (.7z)</li>
                <li>• TAR/GZ (.tar.gz)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
