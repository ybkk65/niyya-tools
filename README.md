# 🚀 Niyya Tools

Plateforme d'outils internes développée par **Niyya Agency** - Mini SaaS professionnel avec Next.js 14, TypeScript et Tailwind CSS.

![Niyya Agency](./public/images/logo_NIYYA_QR.webp)

---

## 📋 Description

**Niyya Tools** est une plateforme SaaS interne qui centralise plusieurs outils web professionnels pour Niyya Agency. Le design premium dark/lime reflète l'identité visuelle moderne de l'agence.

### ✨ Fonctionnalités actuelles

- **Générateur de QR Code** : Créez des QR codes personnalisés instantanément
  - Validation d'URL complète
  - Export en PNG haute qualité
  - Interface intuitive et responsive

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Backend** : Next.js API Routes
- **QR Code** : librairie `qrcode`

---

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### 3. Build pour la production

```bash
npm run build
npm start
```

---

## 📁 Structure du projet

```
niyya-tools/
├── app/
│   ├── api/
│   │   └── qr-code/
│   │       └── route.ts          # API endpoint QR Code
│   ├── qr-code/
│   │   └── page.tsx              # Page Générateur QR Code
│   ├── layout.tsx                # Layout global
│   ├── page.tsx                  # Page d'accueil
│   └── globals.css               # Styles globaux
├── components/
│   ├── Button.tsx                # Composant bouton réutilisable
│   ├── Footer.tsx                # Footer du site
│   ├── Header.tsx                # Header avec navigation
│   └── ToolCard.tsx              # Carte d'outil (homepage)
├── public/
│   └── images/
│       └── logo_NIYYA_QR.webp    # Logo Niyya Agency
├── tailwind.config.ts            # Config Tailwind personnalisée
├── tsconfig.json                 # Config TypeScript
├── next.config.js                # Config Next.js
└── package.json                  # Dépendances
```

---

## 🎨 Design System

### Couleurs principales

```css
/* Vert lime Niyya */
--niyya-lime: #BEFF00

/* Backgrounds sombres */
--niyya-dark: #0A0A0A
--niyya-darker: #000000

/* Textes */
--white: #FFFFFF
--gray-light: #9CA3AF
--gray: #6B7280
```

### Composants stylisés

- **Cartes** : Fond dark avec bordures subtiles et effet hover lime
- **Boutons** : 3 variantes (primary, secondary, outline)
- **Header** : Fixed avec backdrop blur
- **Footer** : Grid responsive avec liens

---

## 🔧 API Endpoints

### POST `/api/qr-code`

Génère un QR code à partir d'une URL.

**Request Body** :
```json
{
  "url": "https://example.com"
}
```

**Response Success (200)** :
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "url": "https://example.com"
}
```

**Response Error (400)** :
```json
{
  "error": "Format d'URL invalide"
}
```

**Validations** :
- ✅ URL valide (format HTTP/HTTPS)
- ✅ Longueur max : 2048 caractères
- ✅ Type de données vérifié

---

## 🚀 Ajouter un nouvel outil

### 1. Créer la page

```bash
# Créer le dossier de la page
mkdir app/mon-outil
# Créer page.tsx
touch app/mon-outil/page.tsx
```

### 2. Créer l'API (si nécessaire)

```bash
mkdir app/api/mon-outil
touch app/api/mon-outil/route.ts
```

### 3. Ajouter la carte sur la homepage

Dans `app/page.tsx`, ajouter :

```tsx
const tools = [
  // ... outils existants
  {
    title: "Mon Nouvel Outil",
    description: "Description de l'outil",
    href: "/mon-outil",
    icon: "🔧",
  },
];
```

---

## 📱 Pages disponibles

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec grid des outils |
| `/qr-code` | Générateur de QR Code |

---

## 🎯 Prochaines étapes

- [ ] Ajouter d'autres outils (compresseur d'images, générateur de palette, etc.)
- [ ] Système d'authentification pour les outils internes
- [ ] Dashboard analytics
- [ ] Mode light/dark toggle
- [ ] Historique des générations

---

## 👨‍💻 Développement

### Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Build pour la production
npm run start    # Démarrer le serveur de production
npm run lint     # Linter le code
```

### Variables d'environnement

Créer un fichier `.env.local` si nécessaire :

```env
# Ajouter vos variables ici
```

---

## 📝 License

© 2024 Niyya Agency. Tous droits réservés.

---

## 🔗 Liens

- **Niyya Agency** : [https://niyya.fr](https://niyya.fr)
- **Contact** : [https://niyya.fr/contact](https://niyya.fr/contact)

---

**Développé avec ❤️ par Niyya Agency**
