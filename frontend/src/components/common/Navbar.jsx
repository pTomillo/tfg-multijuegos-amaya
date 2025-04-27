import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] shadow-md transition-colors duration-500">
      <div className="flex items-center space-x-6">
        {/* Imagen en lugar del título */}
        <Link to="/">
          <div className="bg-[color:var(--color-button)] dark:bg-transparent rounded-lg shadow-md">
            <img
              src="/Logo_MultiJuegos_Amaya.svg"
              alt="Multijuegos Amaya"
              className="h-20 w-auto"
            />
          </div>
        </Link>

        {/* Links de navegación */}
        {!authToken ? (
          <>
            <Link to="/" className="hover:underline">
              Inicio
            </Link>
            <Link to="/register" className="hover:underline">
              Registrarse
            </Link>
            <Link to="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="hover:underline">
              Inicio
            </Link>
            <Link to="/games" className="hover:underline">
              Catálogo
            </Link>
            <Link to="/profile" className="hover:underline">
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline bg-transparent border-none cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>

      {/* Toggle de modo oscuro */}
      <div className="flex items-center">
        <DarkModeToggle />
      </div>
    </nav>
  );
}
