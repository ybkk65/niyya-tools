// Chargement d'ONNX Runtime depuis le CDN
// Ce script évite les problèmes de webpack avec les URLs

(function() {
  if (typeof window === 'undefined') return;

  // Charger ONNX Runtime depuis le CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.min.js';
  script.async = true;
  script.onload = function() {
    console.log('📦 ONNX Runtime chargé depuis CDN');
    
    // Configurer l'environnement WASM
    if (window.ort && window.ort.env) {
      window.ort.env.wasm = window.ort.env.wasm || {};
      window.ort.env.wasm.numThreads = 1;
      window.ort.env.wasm.simd = true;
      window.ort.env.wasm.proxy = false;
      window.ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/';
      
      console.log('✅ ONNX Runtime configuré:', window.ort.env.wasm);
      
      // Déclencher un événement personnalisé pour signaler que ONNX est prêt
      window.dispatchEvent(new CustomEvent('onnxruntime-loaded', { 
        detail: { version: '1.14.0' } 
      }));
    }
  };
  script.onerror = function(err) {
    console.error('❌ Erreur chargement ONNX Runtime:', err);
    window.dispatchEvent(new CustomEvent('onnxruntime-error', { 
      detail: { error: err } 
    }));
  };
  
  document.head.appendChild(script);
})();
