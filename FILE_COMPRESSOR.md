# 📦 Compresseur de Fichiers

## 🎯 Fonctionnalités

### Modes Disponibles

**1. Compression**
- Créer des archives ZIP
- Multi-fichiers
- Affichage du ratio de compression
- Économie d'espace

**2. Décompression**
- Extraire des archives
- Formats supportés: ZIP, RAR, 7Z, TAR.GZ
- Affichage des fichiers extraits

## 🚀 Utilisation

### Mode Compression

1. **Sélectionner "Compresser"**
2. **Ajouter des fichiers** : Glisser-déposer ou cliquer
3. **Voir la liste** : Fichiers avec tailles
4. **Compresser** : Clic sur le bouton
5. **Télécharger** : Archive ZIP générée

### Mode Décompression

1. **Sélectionner "Décompresser"**
2. **Ajouter une archive** : ZIP, RAR, 7Z, etc.
3. **Décompresser** : Extraction automatique
4. **Télécharger** : Fichiers extraits

## ⚡ Limites

### Compression
- **Taille max par fichier** : 50 MB
- **Format de sortie** : ZIP
- **Nombre de fichiers** : Illimité

### Décompression
- **Taille max archive** : 100 MB
- **Formats** : ZIP, RAR, 7Z, TAR.GZ

## 🔧 Version Actuelle (Démo)

Cette version est une **démonstration** qui simule la compression/décompression.

### Pour une version production

Pour une vraie compression/décompression :

#### Option 1 : JSZip (Client-side)

```bash
npm install jszip
```

```typescript
import JSZip from 'jszip';

// Compression
const zip = new JSZip();

files.forEach(file => {
  zip.file(file.name, file);
});

const blob = await zip.generateAsync({ 
  type: 'blob',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 }
});

// Décompression
const zip = await JSZip.loadAsync(archiveFile);
const files = [];

zip.forEach((relativePath, file) => {
  files.push({
    name: relativePath,
    content: file.async('blob')
  });
});
```

#### Option 2 : pako (Client-side GZIP)

```bash
npm install pako
```

```typescript
import pako from 'pako';

// Compression
const compressed = pako.gzip(data);

// Décompression
const decompressed = pako.ungzip(compressed);
```

#### Option 3 : API Backend (Node.js)

```javascript
const archiver = require('archiver');
const unzipper = require('unzipper');

// Compression
app.post('/compress', upload.array('files'), async (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(res);
  
  req.files.forEach(file => {
    archive.file(file.path, { name: file.originalname });
  });
  
  await archive.finalize();
});

// Décompression
app.post('/decompress', upload.single('archive'), async (req, res) => {
  const directory = await unzipper.Open.file(req.file.path);
  
  // Extraire les fichiers
  await directory.extract({ path: './extracted' });
});
```

**Bibliothèques Node.js :**
- `archiver` - Création d'archives
- `unzipper` / `yauzl` - Décompression ZIP
- `node-7z` - Support 7-Zip
- `tar` - Archives TAR
- `zlib` - Compression GZIP (natif Node.js)

#### Option 4 : Services Cloud

- **CloudConvert** : https://cloudconvert.com/api/v2
- **Archive.org API** : Extraction d'archives
- **AWS S3** : Stockage avec compression

## 📊 Exemple Complet avec JSZip

```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Fonction de compression
async function compressFiles(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  
  // Ajouter tous les fichiers
  files.forEach(file => {
    zip.file(file.name, file);
  });
  
  // Options de compression
  const options = {
    type: 'blob' as const,
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9 // Niveau max de compression
    }
  };
  
  // Générer l'archive avec progress
  const blob = await zip.generateAsync(options, (metadata) => {
    const percent = metadata.percent.toFixed(2);
    console.log(`Progression: ${percent}%`);
  });
  
  return blob;
}

// Fonction de décompression
async function decompressFile(zipFile: File): Promise<any[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const files: any[] = [];
  
  // Parcourir tous les fichiers
  for (const [path, file] of Object.entries(zip.files)) {
    if (!file.dir) {
      const content = await file.async('blob');
      files.push({
        name: path,
        size: content.size,
        blob: content
      });
    }
  }
  
  return files;
}

// Télécharger l'archive
function downloadZip(blob: Blob, filename: string) {
  saveAs(blob, filename);
}
```

## 🎨 Calcul du Ratio de Compression

```typescript
function calculateCompressionRatio(
  originalSize: number, 
  compressedSize: number
): number {
  return ((originalSize - compressedSize) / originalSize) * 100;
}

// Exemple
const original = 10485760; // 10 MB
const compressed = 7340032; // 7 MB
const ratio = calculateCompressionRatio(original, compressed);
console.log(`Économie: ${ratio.toFixed(1)}%`); // 30%
```

## 🔐 Sécurité

Pour une version production :

1. **Validation** :
   - Vérifier les types MIME
   - Limiter les tailles
   - Scanner les fichiers (antivirus)

2. **Protection** :
   - Rate limiting
   - Authentification
   - Chiffrement des archives sensibles

3. **Gestion mémoire** :
   - Stream processing pour gros fichiers
   - Cleanup automatique des fichiers temporaires
   - Limite de mémoire

```typescript
// Streaming pour gros fichiers
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';

async function streamZip(files: File[]) {
  const archive = archiver('zip');
  const output = createWriteStream('output.zip');
  
  archive.pipe(output);
  
  files.forEach(file => {
    archive.append(file.stream(), { name: file.name });
  });
  
  await archive.finalize();
}
```

## 📈 Améliorations Futures

1. **Formats supplémentaires** :
   - Support RAR (lecture)
   - Support 7-Zip
   - Support TAR/GZ

2. **Options avancées** :
   - Niveau de compression réglable
   - Protection par mot de passe
   - Chiffrement AES

3. **Fonctionnalités** :
   - Prévisualisation du contenu
   - Extraction sélective
   - Compression incrémentale
   - Multi-volumes

4. **Performance** :
   - Web Workers pour ne pas bloquer l'UI
   - Streaming pour gros fichiers
   - Cache des archives

## 🧪 Tests

```bash
# Lancer l'outil
npm run dev
open http://localhost:3006/file-compressor

# Test compression
1. Ajouter 3-5 fichiers différents
2. Observer la taille totale
3. Compresser
4. Vérifier le ratio
5. Télécharger et tester l'archive

# Test décompression
1. Upload une archive ZIP
2. Décompresser
3. Vérifier les fichiers extraits
```

## 🔗 Ressources

- [JSZip Documentation](https://stuk.github.io/jszip/)
- [pako (GZIP/DEFLATE)](https://github.com/nodeca/pako)
- [archiver (Node.js)](https://www.npmjs.com/package/archiver)
- [unzipper (Node.js)](https://www.npmjs.com/package/unzipper)
- [file-saver](https://github.com/eligrey/FileSaver.js/)

## 💡 Notes Techniques

### Compression Ratios Typiques

- **Texte** : 60-80% de réduction
- **Images JPEG** : 0-10% (déjà compressées)
- **Documents Office** : 40-70%
- **Vidéos** : 0-5% (déjà compressées)
- **Code source** : 70-85%

### Algorithmes de Compression

- **DEFLATE** : Standard ZIP (bon compromis)
- **GZIP** : Web, compatible HTTP
- **BZIP2** : Meilleur ratio mais plus lent
- **LZMA** : 7-Zip (excellent ratio)
- **LZ4** : Très rapide mais ratio moyen
