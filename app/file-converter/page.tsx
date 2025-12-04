"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faCloudArrowUp, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ConversionResult {
  originalFile: File;
  originalName: string;
  resultBlob: Blob | null;
  resultName: string;
  fromFormat: string;
  toFormat: string;
}

export default function FileConverterPage() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS = {
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    text: ["text/plain", "text/html", "text/markdown"],
    data: ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/json", "application/vnd.apple.numbers"],
  };

  const OUTPUT_FORMATS = [
    { value: "pdf", label: "PDF", extension: ".pdf" },
    { value: "docx", label: "Word", extension: ".docx" },
    { value: "txt", label: "Texte", extension: ".txt" },
    { value: "html", label: "HTML", extension: ".html" },
    { value: "md", label: "Markdown", extension: ".md" },
    { value: "csv", label: "CSV", extension: ".csv" },
    { value: "json", label: "JSON", extension: ".json" },
    { value: "xlsx", label: "Excel", extension: ".xlsx" },
  ];

  const getAllAcceptedFormats = () => {
    return Object.values(ACCEPTED_FORMATS).flat().join(",");
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFormatFromType = (type: string, name: string): string => {
    const ext = getFileExtension(name);
    
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || ext === 'docx' || ext === 'doc') return 'docx';
    if (type.includes('text/plain') || ext === 'txt') return 'txt';
    if (type.includes('text/html') || ext === 'html') return 'html';
    if (type.includes('markdown') || ext === 'md') return 'md';
    if (type.includes('csv') || ext === 'csv') return 'csv';
    if (type.includes('json') || ext === 'json') return 'json';
    if (type.includes('spreadsheet') || ext === 'xlsx' || ext === 'xls') return 'xlsx';
    if (type.includes('numbers') || ext === 'numbers') return 'numbers';
    
    return ext || 'unknown';
  };

  const convertFile = async (file: File, toFormat: string): Promise<Blob> => {
    // Pour une démo, on simule la conversion
    // Dans un vrai projet, vous utiliseriez une API backend ou une bibliothèque de conversion
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          
          // Simulation de conversion
          await new Promise(r => setTimeout(r, 1500)); // Simule le traitement
          
          let blob: Blob;
          const fromFormat = getFormatFromType(file.type, file.name);
          
          if (toFormat === 'txt') {
            // Conversion vers texte
            blob = new Blob([`Contenu converti de ${fromFormat} vers TXT\n\nFichier original: ${file.name}`], { type: 'text/plain' });
          } else if (toFormat === 'html') {
            // Conversion vers HTML
            const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${file.name}</title>
</head>
<body>
  <h1>Document converti</h1>
  <p>Fichier original: ${file.name}</p>
  <p>Format source: ${fromFormat}</p>
  <p>Format cible: ${toFormat}</p>
</body>
</html>`;
            blob = new Blob([html], { type: 'text/html' });
          } else if (toFormat === 'md') {
            // Conversion vers Markdown
            const markdown = `# Document converti

**Fichier original:** ${file.name}  
**Format source:** ${fromFormat}  
**Format cible:** ${toFormat}

---

Contenu du document converti...`;
            blob = new Blob([markdown], { type: 'text/markdown' });
          } else if (toFormat === 'csv') {
            // Conversion vers CSV
            const csv = `Nom,Valeur,Description
"${file.name}","${fromFormat}","Fichier source"
"Conversion","${toFormat}","Format cible"
"Taille","${(file.size / 1024).toFixed(2)} KB","Taille du fichier"`;
            blob = new Blob([csv], { type: 'text/csv' });
          } else if (toFormat === 'json') {
            // Conversion vers JSON
            const jsonData = {
              filename: file.name,
              sourceFormat: fromFormat,
              targetFormat: toFormat,
              size: file.size,
              sizeKB: (file.size / 1024).toFixed(2),
              converted: new Date().toISOString(),
              data: {
                columns: ["Colonne1", "Colonne2", "Colonne3"],
                rows: [
                  { col1: "Valeur 1", col2: "Valeur 2", col3: "Valeur 3" },
                  { col1: "Donnée A", col2: "Donnée B", col3: "Donnée C" }
                ]
              }
            };
            blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          } else if (toFormat === 'pdf' || toFormat === 'docx' || toFormat === 'xlsx') {
            // Pour PDF, DOCX et XLSX, on retourne le fichier original
            // (nécessiterait une vraie API de conversion)
            blob = file.slice(0, file.size, file.type);
          } else {
            blob = file.slice(0, file.size, file.type);
          }
          
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur lecture fichier'));
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    try {
      setLoading(true);
      setResult(null);

      // Validation du fichier
      const allFormats = getAllAcceptedFormats().split(",");
      if (!allFormats.includes(file.type) && !file.name.match(/\.(pdf|docx?|txt|html?|md|csv|json|xlsx?|numbers)$/i)) {
        throw new Error("Format de fichier non supporté");
      }

      // Vérifier la taille (max 10MB pour les documents)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("Le fichier est trop volumineux (max 10MB)");
      }

      // Conversion
      const fromFormat = getFormatFromType(file.type, file.name);
      const blob = await convertFile(file, selectedFormat);
      
      const outputFormat = OUTPUT_FORMATS.find(f => f.value === selectedFormat);
      const resultName = file.name.replace(/\.[^.]+$/, outputFormat?.extension || `.${selectedFormat}`);

      setResult({
        originalFile: file,
        originalName: file.name,
        resultBlob: blob,
        resultName,
        fromFormat,
        toFormat: selectedFormat,
      });
    } catch (error) {
      console.error("Erreur:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la conversion");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
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
    if (file) handleFileSelect(file);
  };

  const handleDownload = () => {
    if (!result?.resultBlob) return;
    const url = URL.createObjectURL(result.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setResult(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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
            <FontAwesomeIcon icon={faFileExport} className="text-niyya-lime" />
            Convertisseur de Fichiers
          </h1>
          <p className="text-gray-400">
            Convertissez vos documents et données entre différents formats (PDF, Word, CSV, JSON, Excel, etc.)
          </p>
        </div>

        {/* Sélection du format de sortie */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Format de sortie
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {OUTPUT_FORMATS.map((format) => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                disabled={loading}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedFormat === format.value
                    ? "bg-niyya-lime text-black"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zone de dépôt */}
        {!result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
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
                <p className="text-gray-400">Conversion en cours...</p>
              </div>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="text-5xl text-gray-600 mb-4"
                />
                <p className="text-lg font-semibold text-white mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-gray-400 mb-6 text-sm">
                  PDF, Word, TXT, HTML, Markdown, CSV, JSON, Excel (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAllAcceptedFormats()}
                  onChange={handleInputChange}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="mx-auto"
                >
                  Choisir un fichier
                </Button>
              </>
            )}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              Conversion terminée
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Fichier original */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Fichier original</p>
                <p className="text-white font-medium mb-1 break-all">
                  {result.originalName}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(result.originalFile.size)} • {result.fromFormat.toUpperCase()}
                </p>
              </div>

              {/* Fichier converti */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Fichier converti</p>
                <p className="text-white font-medium mb-1 break-all">
                  {result.resultName}
                </p>
                <p className="text-sm text-gray-500">
                  {result.resultBlob ? formatFileSize(result.resultBlob.size) : "N/A"} • {result.toFormat.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Note d'information */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-400">
                <strong>Note :</strong> Cette démo simule la conversion avec des données d'exemple. 
                Pour une conversion réelle, vous auriez besoin d'une API backend avec des bibliothèques comme 
                pdf2docx, python-docx, pandas (CSV/Excel), ou des services comme CloudConvert, Zamzar, etc.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1">
                Télécharger
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex-1"
              >
                Nouveau fichier
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
                <strong className="text-white">Entrée :</strong>
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• PDF (.pdf)</li>
                <li>• Word (.doc, .docx)</li>
                <li>• Texte (.txt)</li>
                <li>• HTML (.html, .htm)</li>
                <li>• Markdown (.md)</li>
                <li>• CSV (.csv)</li>
                <li>• JSON (.json)</li>
                <li>• Excel (.xls, .xlsx)</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Sortie :</strong>
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• PDF (.pdf)</li>
                <li>• Word (.docx)</li>
                <li>• Texte (.txt)</li>
                <li>• HTML (.html)</li>
                <li>• Markdown (.md)</li>
                <li>• CSV (.csv)</li>
                <li>• JSON (.json)</li>
                <li>• Excel (.xlsx)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
