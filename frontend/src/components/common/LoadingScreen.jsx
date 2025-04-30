export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-textPrimary)] transition-colors">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold">Cargando...</p>
      </div>
    </div>
  );
}
