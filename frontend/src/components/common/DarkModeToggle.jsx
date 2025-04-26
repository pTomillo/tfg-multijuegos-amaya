import { useDarkMode } from "../../context/DarkModeContext";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary dark:bg-darkPrimary text-white font-bold shadow-md hover:brightness-110 transition-all duration-300"
    >
      {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
    </button>
  );
}
