#!/bin/bash

echo "🧪 Script de test du suppresseur de fond"
echo "========================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Étape 1: Tuer les processus existants sur le port 3006
echo -e "${YELLOW}🔧 Nettoyage du port 3006...${NC}"
lsof -ti:3006 | xargs kill -9 2>/dev/null
sleep 1

# Étape 2: Nettoyer le cache Next.js
echo -e "${YELLOW}🧹 Nettoyage du cache Next.js...${NC}"
rm -rf .next
rm -rf node_modules/.cache

# Étape 3: Créer les dossiers nécessaires
echo -e "${YELLOW}📁 Création des dossiers WASM...${NC}"
node scripts/copy-wasm.js

# Étape 4: Build pour vérifier qu'il n'y a pas d'erreurs
echo -e "${YELLOW}🏗️  Build de vérification...${NC}"
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur de build${NC}"
    echo "Lancez 'npm run build' pour voir les détails"
    exit 1
fi

# Étape 5: Lancer le serveur en arrière-plan
echo -e "${YELLOW}🚀 Démarrage du serveur de développement...${NC}"
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo -e "${YELLOW}⏳ Attente du serveur...${NC}"
sleep 5

# Vérifier que le serveur tourne
if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}✅ Serveur démarré (PID: $SERVER_PID)${NC}"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Tout est prêt !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "📍 URL: http://localhost:3006/bg-remover"
    echo ""
    echo "🧪 Instructions de test :"
    echo "  1. Ouvrez http://localhost:3006/bg-remover dans votre navigateur"
    echo "  2. Ouvrez la console (F12)"
    echo "  3. Uploadez une image PNG"
    echo "  4. Observez les logs dans la console"
    echo ""
    echo "📝 Logs attendus :"
    echo "  - 🔧 Initialisation ONNX Runtime..."
    echo "  - ✅ ONNX Runtime initialisé"
    echo "  - 🚀 Début suppression fond..."
    echo "  - 📊 Progression..."
    echo "  - ✅ Suppression terminée"
    echo ""
    echo "🛑 Pour arrêter le serveur :"
    echo "   kill $SERVER_PID"
    echo ""
    
    # Ouvrir le navigateur (macOS)
    open http://localhost:3006/bg-remover
    
else
    echo -e "${RED}❌ Échec du démarrage du serveur${NC}"
    exit 1
fi
