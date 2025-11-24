export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="animate-spin h-12 w-12 border-4 border-niyya-lime border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    </div>
  );
}
