'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Une erreur est survenue</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-niyya-lime text-black font-semibold rounded-lg hover:bg-niyya-lime/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
