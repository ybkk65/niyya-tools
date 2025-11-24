# Tests du Suppresseur de Fond

## ✅ Modifications apportées

### 1. Configuration ONNX Runtime
- Créé `useOnnxRuntime.ts` : Hook React qui initialise ONNX Runtime au chargement de la page
- Configuration WASM avec CDN officiel de onnxruntime-web
- Initialisation une seule fois au lieu de chaque upload

### 2. Configuration Next.js
- `next.config.js` : Support WASM complet (asyncWebAssembly, syncWebAssembly, topLevelAwait)
- Output configuration pour les fichiers WASM
- Alias onnxruntime-node → onnxruntime-web côté client

### 3. Scripts et fichiers
- `scripts/copy-wasm.js` : Création automatique des dossiers nécessaires
- `public/resources.json` : Configuration pour les modèles
- Scripts predev/prebuild dans package.json

## 🧪 Comment tester

### Étape 1: Lancer le serveur
```bash
# Tuer le processus existant
lsof -ti:3006 | xargs kill -9

# Nettoyer et relancer
rm -rf .next
npm run dev
```

### Étape 2: Ouvrir le suppresseur
- Aller sur `http://localhost:3006/bg-remover`
- Ouvrir la console (F12)

### Étape 3: Uploader une image
- Glisser-déposer une image ou cliquer pour sélectionner
- Observer les logs dans la console

## 📊 Logs attendus

### ✅ Succès complet
```
🔧 Initialisation ONNX Runtime...
✅ ONNX Runtime initialisé: { numThreads: 1, simd: true, ... }
🚀 Début suppression fond pour: image.png Type: image/png Taille: ...
📡 ONNX Runtime prêt: true
✅ Module @imgly/background-removal chargé
⏳ Appel removeBackground...
📊 Progression fetch:/models/isnet_fp16: 10%
📊 Progression fetch:/models/isnet_fp16: 20%
...
📊 Progression fetch:/models/isnet_fp16: 100%
📊 Progression compute:inference: 0%
📊 Progression compute:inference: 50%
📊 Progression compute:inference: 100%
✅ Suppression terminée, blob: Blob { ... }
🎨 Traitement de l'image de sortie...
✅ Traitement terminé
```

### ❌ Si erreur url.replace persiste
```
❌ Erreur lors de la suppression: TypeError: url.replace is not a function
⚠️ Erreur url.replace détectée, essai sans config...
```

**Actions à prendre :**
1. Vérifier que ONNX Runtime s'est bien initialisé
2. Vérifier la console réseau (onglet Network) pour voir si les fichiers WASM se chargent
3. Essayer avec une image plus petite (< 1MB)

## 🔧 Dépannage

### Si "resources.json 404"
- Fichier déjà créé dans `public/resources.json`
- Redémarrer le serveur dev

### Si "Module not found"
```bash
npm install
rm -rf .next
npm run build
```

### Si erreur persiste
1. Vérifier les logs dans la console
2. Tester avec une image PNG simple (pas WebP ou JPEG)
3. Vérifier la connexion internet (CDN onnxruntime)

## 🎯 Images de test recommandées

1. **PNG simple** (500KB - 1MB) : Portrait sur fond uni
2. **PNG complexe** (1-2MB) : Photo avec cheveux détaillés
3. **JPEG** (< 1MB) : Pour tester la conversion

## 📝 Notes importantes

- Le premier chargement télécharge le modèle IA (~176MB pour isnet_fp16)
- Le modèle est mis en cache par le navigateur
- Les chargements suivants sont instantanés
- La suppression prend 5-15 secondes selon l'image
