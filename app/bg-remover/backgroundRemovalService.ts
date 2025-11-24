// Service pour gérer la suppression de fond
// Utilise une approche qui évite les problèmes de webpack avec onnxruntime-web

let bgRemovalModule: any = null;
let isInitialized = false;

export async function initializeBackgroundRemoval() {
  if (isInitialized && bgRemovalModule) {
    return bgRemovalModule;
  }

  try {
    console.log('🚀 Initialisation du service de suppression de fond...');
    
    // Attendre que ONNX Runtime soit chargé depuis le CDN
    if (typeof window !== 'undefined') {
      let attempts = 0;
      while (!(window as any).ort && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if ((window as any).ort) {
        console.log('✅ ONNX Runtime disponible depuis CDN');
      } else {
        console.warn('⚠️ ONNX Runtime non disponible, continuation...');
      }
    }
    
    // Charger @imgly/background-removal de manière dynamique
    bgRemovalModule = await import('@imgly/background-removal');
    
    if (bgRemovalModule && bgRemovalModule.removeBackground) {
      isInitialized = true;
      console.log('✅ Module de suppression de fond initialisé');
      return bgRemovalModule;
    } else {
      throw new Error('Module de suppression de fond invalide');
    }
  } catch (error) {
    console.error('❌ Erreur initialisation suppression de fond:', error);
    throw error;
  }
}

export async function removeBackground(
  file: File,
  onProgress?: (key: string, current: number, total: number) => void
): Promise<Blob> {
  try {
    const module = await initializeBackgroundRemoval();
    
    const config = {
      model: 'isnet' as const,
      output: {
        format: 'image/png' as const,
        quality: 0.8,
      },
      progress: onProgress,
    };
    
    const blob = await module.removeBackground(file, config);
    return blob;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du fond:', error);
    
    // Si erreur avec config, essayer sans
    try {
      const module = await initializeBackgroundRemoval();
      const blob = await module.removeBackground(file);
      return blob;
    } catch (fallbackError) {
      console.error('❌ Échec même sans configuration:', fallbackError);
      throw new Error('Impossible de traiter l\'image. Veuillez réessayer.');
    }
  }
}
