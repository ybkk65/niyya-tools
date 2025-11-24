import { useEffect, useState } from 'react';

export function useOnnxRuntime() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initOnnx = async () => {
      try {
        console.log('🔧 Initialisation ONNX Runtime...');
        
        // @ts-ignore - Types onnxruntime-web non résolus
        const ort = await import('onnxruntime-web');
        
        // Configurer l'environnement WASM
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;
        ort.env.wasm.proxy = false;
        
        // Définir le chemin des fichiers WASM depuis le CDN
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/';
        
        console.log('✅ ONNX Runtime initialisé:', {
          numThreads: ort.env.wasm.numThreads,
          simd: ort.env.wasm.simd,
          wasmPaths: ort.env.wasm.wasmPaths
        });
        
        setIsReady(true);
      } catch (err) {
        console.error('❌ Erreur initialisation ONNX Runtime:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        // On continue quand même, la bibliothèque utilisera ses valeurs par défaut
        setIsReady(true);
      }
    };

    initOnnx();
  }, []);

  return { isReady, error };
}
