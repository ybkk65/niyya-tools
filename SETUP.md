# 🚀 Installation et Démarrage - Niyya Tools

## ⚡ Installation rapide

### Étape 1 : Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande va installer :
- ✅ Next.js 14
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ QRCode library
- ✅ Tous les types TypeScript nécessaires

---

### Étape 2 : Lancer le serveur de développement

```bash
npm run dev
```

Le serveur démarrera sur **http://localhost:3000**

Vous verrez dans le terminal :
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

---

### Étape 3 : Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur :
👉 **http://localhost:3000**

Vous verrez la page d'accueil de Niyya Tools !

---

## 📱 Tester les fonctionnalités

### 1. Page d'accueil
- Vérifiez que le logo Niyya s'affiche correctement
- Le header avec navigation doit être fixe en haut
- La carte "Générateur de QR Code" doit être visible
- Les stats (1+, 100%, 24/7, Pro) doivent s'afficher

### 2. Générateur de QR Code
Cliquez sur la carte "Générateur de QR Code" ou allez sur :
👉 **http://localhost:3000/qr-code**

**Testez** :
1. Entrez une URL valide (ex: `https://niyya.fr`)
2. Cliquez sur "Générer le QR Code"
3. Le QR code doit apparaître
4. Cliquez sur "Télécharger en PNG" pour le sauvegarder

**Testez les validations** :
- URL vide → Message d'erreur
- URL invalide (ex: `test`) → Message d'erreur
- URL valide → QR code généré ✅

---

## 🛠️ Build pour la production

Quand vous êtes prêt à déployer :

```bash
# Build l'application
npm run build

# Lancer en mode production
npm start
```

---

## 🎨 Personnalisation

### Modifier les couleurs

Les couleurs sont définies dans `tailwind.config.ts` :

```typescript
colors: {
  niyya: {
    lime: "#BEFF00",      // Vert principal
    dark: "#0A0A0A",      // Fond secondaire
    darker: "#000000",    // Fond principal
  },
}
```

### Modifier le logo

Remplacez le fichier :
- `public/images/logo_NIYYA_QR.webp`
- `public/favicon.png`

---

## 🔧 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (hot reload) |
| `npm run build` | Build pour production |
| `npm start` | Serveur production |
| `npm run lint` | Vérifier le code |

---

## 📂 Fichiers importants

```
niyya-tools/
├── app/
│   ├── page.tsx              ← Page d'accueil
│   ├── qr-code/page.tsx      ← Page QR Code
│   └── api/qr-code/route.ts  ← API Backend
├── components/               ← Composants réutilisables
├── tailwind.config.ts        ← Config Tailwind
└── package.json              ← Dépendances
```

---

## ❓ Problèmes courants

### Le serveur ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur de port déjà utilisé
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
npm run dev -- -p 3001
```

### Erreurs TypeScript
Les erreurs TypeScript actuelles disparaîtront après `npm install` car les types React et Next.js seront installés.

---

## 🚀 Déploiement

### Vercel (recommandé)

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Connecter votre repository GitHub
3. Cliquer sur "Deploy"
4. C'est fait ! 🎉

### Autres options
- Netlify
- Railway
- DigitalOcean App Platform

---

## 📞 Support

Besoin d'aide ?
- 📧 Contact : [https://niyya.fr/contact](https://niyya.fr/contact)
- 🌐 Site web : [https://niyya.fr](https://niyya.fr)

---

**Bon développement ! 🚀**

*Niyya Agency - Agence web spécialisée*
