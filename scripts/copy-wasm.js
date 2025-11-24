const fs = require('fs');
const path = require('path');

// Créer le dossier public/models s'il n'existe pas
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Créer le dossier public/wasm s'il n'existe pas
const wasmDir = path.join(__dirname, '../public/wasm');
if (!fs.existsSync(wasmDir)) {
  fs.mkdirSync(wasmDir, { recursive: true });
}

console.log('✅ Dossiers créés pour les fichiers WASM');
