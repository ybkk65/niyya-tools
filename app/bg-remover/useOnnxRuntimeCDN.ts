"use client";

import { useEffect, useState } from 'react';

export function useOnnxRuntimeCDN() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si ONNX Runtime est déjà chargé
    if (typeof window !== 'undefined' && (window as any).ort) {
      console.log('✅ ONNX Runtime déjà disponible');
      setIsReady(true);
      return;
    }

    const handleLoaded = (event: CustomEvent) => {
      console.log('✅ ONNX Runtime chargé via CDN:', event.detail);
      setIsReady(true);
    };

    const handleError = (event: CustomEvent) => {
      console.error('❌ Erreur chargement ONNX Runtime:', event.detail);
      setError('Impossible de charger ONNX Runtime');
      // On marque quand même comme prêt pour permettre l'utilisation
      setIsReady(true);
    };

    // Écouter les événements
    window.addEventListener('onnxruntime-loaded', handleLoaded as EventListener);
    window.addEventListener('onnxruntime-error', handleError as EventListener);

    // Vérifier périodiquement si ONNX est chargé (au cas où l'événement a déjà été déclenché)
    const checkInterval = setInterval(() => {
      if ((window as any).ort) {
        console.log('✅ ONNX Runtime détecté');
        setIsReady(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout après 5 secondes
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!isReady) {
        console.warn('⚠️ Timeout ONNX Runtime - continuation sans');
        setIsReady(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('onnxruntime-loaded', handleLoaded as EventListener);
      window.removeEventListener('onnxruntime-error', handleError as EventListener);
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [isReady]);

  return { isReady, error };
}
