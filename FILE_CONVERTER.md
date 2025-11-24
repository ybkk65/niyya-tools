# 📄 Convertisseur de Fichiers

## 🎯 Fonctionnalités

### Formats Supportés

**Entrée :**
- PDF (.pdf)
- Word (.doc, .docx)
- Texte (.txt)
- HTML (.html, .htm)
- Markdown (.md)

**Sortie :**
- PDF (.pdf)
- Word (.docx)
- Texte (.txt)
- HTML (.html)
- Markdown (.md)

## 🚀 Utilisation

1. **Sélectionner le format de sortie** : Choisir le format dans lequel vous voulez convertir votre fichier
2. **Uploader le fichier** : Glisser-déposer ou cliquer pour sélectionner
3. **Télécharger** : Une fois la conversion terminée, télécharger le résultat

## ⚡ Limites

- Taille maximale : **10 MB**
- Formats supportés : Documents textuels principalement

## 🔧 Version Actuelle (Démo)

Cette version est une **démonstration** qui simule la conversion. Elle :
- ✅ Gère l'upload de fichiers
- ✅ Valide les formats
- ✅ Simule la conversion
- ✅ Permet le téléchargement

### Pour une version production

Pour une vraie conversion de documents, vous devriez :

#### Option 1 : API Backend avec bibliothèques Python
```python
# Exemple avec Python
from pdf2docx import Converter
from docx2pdf import convert
import pypandoc

# PDF → DOCX
cv = Converter("input.pdf")
cv.convert("output.docx")
cv.close()

# DOCX → PDF
convert("input.docx", "output.pdf")

# Conversions multiples avec Pandoc
pypandoc.convert_file('input.md', 'html', outputfile="output.html")
```

**Bibliothèques recommandées :**
- `pdf2docx` - PDF vers Word
- `python-docx` - Manipulation Word
- `pypdf2` / `pdfplumber` - Lecture PDF
- `pypandoc` - Conversions universelles
- `mammoth` - DOCX vers HTML
- `markdown2` / `mistune` - Markdown vers HTML

#### Option 2 : Services Cloud (API)
- **CloudConvert** : https://cloudconvert.com/api/v2
- **Zamzar** : https://developers.zamzar.com/
- **ConvertAPI** : https://www.convertapi.com/
- **PDF.co** : https://pdf.co/
- **Adobe PDF Services** : https://developer.adobe.com/

#### Option 3 : LibreOffice en headless
```bash
# Conversion via LibreOffice CLI
soffice --headless --convert-to pdf input.docx
soffice --headless --convert-to docx input.pdf
```

## 📊 Exemple d'Intégration API Backend

### Backend (Node.js + Express)
```javascript
const express = require('express');
const multer = require('multer');
const { convertFile } = require('./converter');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    const { format } = req.body;
    const inputPath = req.file.path;
    
    // Conversion
    const outputPath = await convertFile(inputPath, format);
    
    // Envoyer le fichier converti
    res.download(outputPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend (React)
```typescript
const convertFile = async (file: File, format: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);
  
  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Conversion failed');
  
  const blob = await response.blob();
  return blob;
};
```

## 🎨 Interface Utilisateur

- **Design moderne** avec Tailwind CSS
- **Drag & drop** pour l'upload
- **Sélection de format** interactive
- **Feedback visuel** pendant la conversion
- **Téléchargement direct** du résultat

## 🔒 Sécurité

Pour une version production :
- ✅ Valider les fichiers côté serveur
- ✅ Scanner les fichiers (antivirus)
- ✅ Limiter la taille des uploads
- ✅ Timeout pour les conversions longues
- ✅ Nettoyer les fichiers temporaires
- ✅ Rate limiting

## 📈 Améliorations Futures

1. **Conversion par lot** : Convertir plusieurs fichiers en même temps
2. **Aperçu** : Prévisualiser le document avant téléchargement
3. **OCR** : Extraire le texte des PDF scannés
4. **Compression** : Optimiser la taille des fichiers
5. **Cloud storage** : Intégration Google Drive, Dropbox
6. **Historique** : Sauvegarder les conversions récentes
7. **Paramètres avancés** : Qualité, mise en page, etc.

## 🧪 Tests

```bash
# Tester l'outil
npm run dev
open http://localhost:3006/file-converter
```

## 📝 Notes

- Cette version est une démo pour illustrer l'interface
- Pour une utilisation réelle, implémentez une API backend
- Considérez les coûts des services cloud pour la conversion
- Les conversions complexes (PDF → DOCX) peuvent nécessiter de l'OCR

## 🔗 Ressources

- [pdf2docx](https://github.com/dothinking/pdf2docx)
- [python-docx](https://python-docx.readthedocs.io/)
- [Pandoc](https://pandoc.org/)
- [CloudConvert API](https://cloudconvert.com/api/v2)
- [LibreOffice Headless](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html)
