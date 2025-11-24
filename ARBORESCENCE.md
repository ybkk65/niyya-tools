# 📁 Arborescence complète - Niyya Tools

```
niyya-tools/
│
├── 📄 package.json                    # Dépendances et scripts
├── 📄 tsconfig.json                   # Configuration TypeScript
├── 📄 tailwind.config.ts              # Configuration Tailwind CSS
├── 📄 postcss.config.js               # Configuration PostCSS
├── 📄 next.config.js                  # Configuration Next.js
├── 📄 .gitignore                      # Fichiers ignorés par Git
├── 📄 README.md                       # Documentation principale
├── 📄 SETUP.md                        # Guide d'installation
└── 📄 ARBORESCENCE.md                 # Ce fichier
│
├── 📁 app/                            # Dossier principal Next.js (App Router)
│   │
│   ├── 📄 layout.tsx                  # Layout racine (Header + Footer)
│   ├── 📄 page.tsx                    # 🏠 Page d'accueil (/)
│   ├── 📄 globals.css                 # Styles globaux Tailwind
│   │
│   ├── 📁 api/                        # Routes API Backend
│   │   └── 📁 qr-code/
│   │       └── 📄 route.ts            # POST /api/qr-code
│   │
│   └── 📁 qr-code/                    # Page Générateur QR Code
│       └── 📄 page.tsx                # 📱 Page /qr-code
│
├── 📁 components/                     # Composants React réutilisables
│   ├── 📄 Header.tsx                  # 🎯 Header avec navigation
│   ├── 📄 Footer.tsx                  # 📍 Footer du site
│   ├── 📄 Button.tsx                  # 🔘 Composant bouton (3 variantes)
│   └── 📄 ToolCard.tsx                # 🃏 Carte d'outil (homepage)
│
├── 📁 public/                         # Fichiers statiques publics
│   ├── 📄 favicon.png                 # Favicon du site
│   └── 📁 images/
│       └── 📄 logo_NIYYA_QR.webp      # 🎨 Logo Niyya Agency
│
└── 📁 images/                         # Dossier source des images
    └── 📄 logo_NIYYA_QR.webp          # Logo original
```

---

## 📊 Statistiques du projet

### Fichiers créés
- **12 fichiers TypeScript/React** (.tsx, .ts)
- **5 fichiers de configuration** (config.js, config.ts, json)
- **3 fichiers de documentation** (README, SETUP, ARBORESCENCE)
- **2 fichiers CSS** (globals.css)
- **1 logo** (webp)

### Lignes de code
- **~1200+ lignes** de code TypeScript/React
- **~150 lignes** de configuration
- **~350 lignes** de documentation

### Pages créées
1. **Page d'accueil** (`/`) - Présentation + Grid outils
2. **QR Code Generator** (`/qr-code`) - Outil fonctionnel

### API Endpoints
1. **POST /api/qr-code** - Génération QR codes

### Composants
4 composants réutilisables (Header, Footer, Button, ToolCard)

---

## 🎯 Structure des dossiers expliquée

### `/app`
C'est le cœur de Next.js 14 avec l'App Router. Chaque dossier = une route.

**Exemples** :
- `app/page.tsx` → Route `/`
- `app/qr-code/page.tsx` → Route `/qr-code`
- `app/api/qr-code/route.ts` → API `/api/qr-code`

### `/components`
Composants React réutilisables partagés dans toute l'application.

### `/public`
Fichiers statiques accessibles directement via URL.

**Exemple** :
- `public/images/logo.webp` → `http://localhost:3000/images/logo.webp`

---

## 🔗 Relations entre fichiers

### Page d'accueil (`/`)
```
app/page.tsx
  ├── utilise → components/ToolCard.tsx
  └── wrapped by → app/layout.tsx
      ├── utilise → components/Header.tsx
      └── utilise → components/Footer.tsx
```

### Page QR Code (`/qr-code`)
```
app/qr-code/page.tsx
  ├── utilise → components/Button.tsx
  ├── appelle → app/api/qr-code/route.ts (fetch)
  └── wrapped by → app/layout.tsx
```

### API QR Code
```
app/api/qr-code/route.ts
  ├── utilise → librairie qrcode (npm)
  └── appelé par → app/qr-code/page.tsx (fetch)
```

---

## 🎨 Fichiers de style

### Tailwind CSS
```
tailwind.config.ts          ← Configuration des couleurs Niyya
app/globals.css             ← Import Tailwind + styles de base
```

**Variables personnalisées** :
- `niyya-lime` : #BEFF00
- `niyya-dark` : #0A0A0A
- `niyya-darker` : #000000

---

## 🚀 Prochains fichiers à créer

Pour ajouter de nouveaux outils, créez :

```
app/
└── mon-nouvel-outil/
    ├── page.tsx           ← Interface utilisateur
    └── ...

app/api/
└── mon-nouvel-outil/
    └── route.ts           ← Logique backend (optionnel)
```

---

## 📦 Dépendances installées

### Production
- `next` - Framework React
- `react` - Librairie UI
- `react-dom` - Rendu React
- `qrcode` - Génération QR codes

### Développement
- `typescript` - Typage statique
- `@types/*` - Définitions TypeScript
- `tailwindcss` - Framework CSS
- `autoprefixer` - Préfixes CSS
- `postcss` - Processeur CSS

---

**Structure créée le : 24 novembre 2024**  
**Par : Niyya Agency**  
**Version : 1.0.0**
