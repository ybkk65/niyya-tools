# 🚀 Guide de Déploiement Vercel

## ✅ Problèmes résolus

Le projet a été configuré pour résoudre les problèmes de build liés à la bibliothèque `@imgly/background-removal` qui utilise WASM et TensorFlow.js.

### Problème initial
- **Erreur** : `Syntax Error: 'import.meta' cannot be used outside of module code`
- **Cause** : Les fichiers `.mjs` de ONNX Runtime (utilisé par @imgly/background-removal) n'étaient pas correctement traités par webpack

### Solution appliquée

Les modifications suivantes ont été apportées à `next.config.js` :

1. **Support WASM** : Activation de `asyncWebAssembly` et `layers` dans les expériences webpack
2. **Externalisation serveur** : Les packages problématiques sont externalisés côté serveur
3. **Traitement des fichiers .mjs** : Configuration pour traiter les fichiers `.mjs` comme des modules JavaScript
4. **Exclusion ONNX Runtime** : Alias pour exclure `onnxruntime-node` et `onnxruntime-web`
5. **Ignorer les source maps** : Les fichiers `.map` sont ignorés pour éviter les erreurs de parsing
6. **Fallbacks Node.js** : Configuration des fallbacks pour `fs`, `path`, et `crypto`

## 📦 Dépendances ajoutées

```bash
npm install --save-dev node-loader ignore-loader
```

Ces loaders permettent de gérer correctement les fichiers `.node` et d'ignorer les fichiers problématiques.

## 🔧 Configuration finale

Le fichier `next.config.js` contient maintenant :
- Configuration webpack avancée pour WASM
- Gestion des modules ES (.mjs)
- Externalisation des packages côté serveur
- Suppression des warnings inutiles
- Transpilation de `@imgly/background-removal`

## ✨ Résultat du build

```
Route (app)                              Size     First Load JS
┌ ○ /                                    175 B          96.3 kB
├ ○ /_not-found                          875 B          88.3 kB
├ ƒ /api/qr-code                         0 B                0 B
├ ○ /bg-remover                          3.24 kB         121 kB
├ ○ /image-compressor                    22.8 kB         140 kB
├ ○ /image-converter                     3.5 kB          121 kB
└ ○ /qr-code                             2.06 kB         120 kB
```

**Build réussi** ✅

## 🌐 Déploiement sur Vercel

### Option 1 : Interface Vercel (Recommandé)

1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub/GitLab
4. Vercel détectera automatiquement Next.js
5. Cliquez sur "Deploy"

### Option 2 : CLI Vercel

```bash
# Installer la CLI Vercel globalement
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel

# Pour un déploiement en production
vercel --prod
```

## ⚙️ Configuration Vercel

Le fichier `vercel.json` a été créé avec la configuration optimale :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

**Note** : La région `cdg1` (Paris) est configurée pour optimiser les performances en France.

## 🔍 Vérifications avant déploiement

- [x] Build local réussi (`npm run build`)
- [x] Configuration webpack pour WASM
- [x] Loaders installés (node-loader, ignore-loader)
- [x] Fichiers `.vercelignore` et `vercel.json` créés
- [x] Documentation mise à jour

## 🐛 Dépannage

### Si le build échoue sur Vercel

1. **Vérifier les logs** : Consultez les logs de build dans le dashboard Vercel
2. **Variables d'environnement** : Assurez-vous qu'aucune variable d'environnement n'est manquante
3. **Version Node.js** : Vercel utilise Node.js 18.x par défaut (compatible)

### Si l'outil de suppression de fond ne fonctionne pas

- Le package `@imgly/background-removal` fonctionne uniquement côté client
- Vérifiez que la page utilise `"use client"` en haut du fichier
- Les fichiers WASM doivent être chargés dynamiquement (déjà configuré)

## 📝 Notes importantes

1. **Taille des bundles** : L'outil de suppression de fond augmente la taille du bundle (~121 kB)
2. **Performance** : Le traitement IA se fait côté client, donc pas de coût serveur
3. **Compatibilité** : Fonctionne sur tous les navigateurs modernes supportant WASM

## 🎉 Prêt pour la production

Le projet est maintenant **100% prêt** pour être déployé sur Vercel sans erreur de build !

---

**Dernière mise à jour** : 24 novembre 2024
