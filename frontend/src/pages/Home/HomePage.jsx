import DarkModeToggle from "../../components/common/DarkModeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8 bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] transition-colors duration-500">
      <h1 className="text-5xl font-bold text-center">
        ¡Bienvenido a Multijuegos Amaya! 🎮
      </h1>
      <p className="text-lg text-center max-w-2xl text-[color:var(--color-textSecondary)]">
        Disfruta de una variedad de juegos online, reta a tus amigos y conquista
        la cima.
      </p>
      <DarkModeToggle />
    </div>
  );
}
