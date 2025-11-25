# 🎯 Guide d'Utilisation - Compresseur de Fichiers

## ✅ Implémentation Réelle avec JSZip

Le compresseur utilise maintenant **JSZip** pour une vraie compression/décompression !

### 📦 Packages Installés

```bash
npm install jszip file-saver
npm install --save-dev @types/file-saver
```

## 🗜️ Mode Compression

### Utilisation

1. **Sélectionner "Compresser"**
2. **Ajouter des fichiers** :
   - Drag & drop dans la zone
   - Ou clic sur "Choisir des fichiers"
3. **Voir la liste** des fichiers avec leurs tailles
4. **Supprimer** des fichiers individuellement (icône poubelle)
5. **Cliquer "Compresser"**
6. **Télécharger** l'archive ZIP générée

### Caractéristiques Techniques

```typescript
// Configuration JSZip
const zip = new JSZip();

// Ajout des fichiers
files.forEach(file => {
  zip.file(file.name, file);
});

// Génération avec compression maximale
const blob = await zip.generateAsync({
  type: 'blob',
  compression: 'DEFLATE',  // Algorithme standard ZIP
  compressionOptions: {
    level: 9  // Niveau maximum (0-9)
  }
});
```

### Ratios de Compression Attendus

| Type de fichier | Ratio typique |
|-----------------|---------------|
| Texte (.txt, .md) | 70-85% |
| Code source (.js, .css) | 70-80% |
| Documents Office (.docx) | 40-70% |
| PDF | 10-30% |
| Images JPEG/PNG | 0-10% (déjà compressées) |
| Vidéos | 0-5% (déjà compressées) |

### Exemple de Logs

```
🗜️ Début compression avec JSZip...
📄 Ajout fichier: document.pdf
📄 Ajout fichier: script.js
📄 Ajout fichier: styles.css
📊 Progression: 25.0%
📊 Progression: 50.0%
📊 Progression: 75.0%
📊 Progression: 100.0%
✅ Archive ZIP créée
```

### Résultats Affichés

- **Taille originale** : Somme de tous les fichiers
- **Taille compressée** : Taille de l'archive ZIP
- **Économie** : Ratio de compression en %

## 📂 Mode Décompression

### Utilisation

1. **Sélectionner "Décompresser"**
2. **Uploader une archive ZIP**
3. **Cliquer "Décompresser"**
4. **Télécharger** le fichier d'information avec la liste

### Caractéristiques Techniques

```typescript
// Chargement de l'archive
const zip = await JSZip.loadAsync(file);

// Listing des fichiers
const fileNames: string[] = [];
zip.forEach((relativePath, zipEntry) => {
  if (!zipEntry.dir) {
    fileNames.push(relativePath);
  }
});
```

### Exemple de Sortie

```
Archive décompressée: mon-projet.zip

Fichiers extraits:
1. index.html
2. styles.css
3. script.js
4. README.md
5. package.json

Total: 5 fichier(s)
```

## 🧪 Tests

### Test de Compression

```bash
# Créer des fichiers de test
echo "Contenu de test répété plusieurs fois..." > test1.txt
echo "Code JavaScript: console.log('test');" > test2.js
echo "Style CSS: body { margin: 0; }" > test3.css

# Utiliser le compresseur
1. Ajouter ces 3 fichiers
2. Compresser
3. Télécharger l'archive
4. Vérifier que c'est un vrai fichier ZIP

# Vérifier avec unzip
unzip -l archive.zip
```

### Test de Décompression

```bash
# Créer une archive ZIP
zip test-archive.zip test1.txt test2.js test3.css

# Utiliser le compresseur
1. Mode Décompression
2. Upload test-archive.zip
3. Décompresser
4. Vérifier la liste des fichiers
```

## 🎯 Cas d'Usage Réels

### 1. Backup de Projet

```
Fichiers:
- src/
- package.json
- README.md
- etc.

Résultat: Backup compressé à ~60%
```

### 2. Partage de Documents

```
Fichiers:
- rapport.pdf
- données.xlsx
- images/

Résultat: Archive facile à partager
```

### 3. Archivage de Logs

```
Fichiers:
- error.log
- access.log
- debug.log

Résultat: Compression ~80% pour logs texte
```

## 📊 Console Logs Utiles

Ouvrez la console (F12) pour voir :

```javascript
// Compression
🗜️ Début compression avec JSZip...
📄 Ajout fichier: document.pdf (2.5 MB)
📄 Ajout fichier: image.jpg (1.8 MB)
📊 Progression: 100.0%
✅ Archive ZIP créée
Taille originale: 4.3 MB
Taille compressée: 3.8 MB
Ratio: 11.6%

// Décompression
📂 Début décompression avec JSZip...
✅ Archive chargée
📄 5 fichiers trouvés
```

## 🔧 Limites Actuelles

### Compression
- **Taille max par fichier** : 50 MB
- **Format de sortie** : ZIP uniquement
- **Niveau de compression** : Fixé à 9 (maximum)

### Décompression
- **Format d'entrée** : ZIP uniquement (JSZip)
- **Taille max archive** : 100 MB
- **Sortie** : Liste des fichiers (info.txt)

### Améliorations Possibles

1. **Extraction complète** : Télécharger tous les fichiers extraits
2. **Multiple formats** : Support RAR, 7Z avec d'autres libs
3. **Niveau ajustable** : Curseur pour choisir niveau 1-9
4. **Web Workers** : Compression en arrière-plan
5. **Streaming** : Pour fichiers très volumineux
6. **Protection** : Ajouter mot de passe aux archives

## 💡 Astuces

### Meilleure Compression

- Grouper des fichiers similaires
- Fichiers texte se compressent très bien
- Images/vidéos déjà compressées : gain minimal

### Performance

- Éviter fichiers > 50 MB
- La compression niveau 9 est lente mais optimale
- Utiliser Web Workers pour gros projets

### Compatibilité

- Archives créées sont des ZIP standard
- Compatibles avec WinRAR, 7-Zip, macOS Archive Utility
- Format universel sur tous les OS

## 🎉 Résultat

**Le compresseur utilise maintenant JSZip pour une vraie compression/décompression fonctionnelle !**

Les ratios affichés sont réels et les archives générées sont de vrais fichiers ZIP utilisables partout.
