import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import authService from "../../services/authService";

export default function Navbar() {
  const { authToken, userId, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const data = await authService.getCurrentUser(userId);
          setUserData(data);
        } catch (error) {
          console.error("Error al obtener usuario:", error);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[var(--color-navbar)] text-[var(--color-textPrimary)] shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="rounded bg-[var(--color-primary)] dark:bg-transparent">
          <img
            src="/Logo_MultiJuegos_Amaya.svg"
            alt="Logo_Multijuegos_Amaya"
            className="h-16"
          />
        </div>
      </div>

      {/* Enlaces */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="hover:text-[var(--color-link-hover)] flex items-center gap-1"
        >
          <span className="text-xl">🏠</span> Inicio
        </Link>

        {authToken ? (
          <>
            <Link
              to="/games"
              className="hover:text-[var(--color-link-hover)] flex items-center gap-1"
            >
              <span className="text-xl">🎮</span> ¡A Jugar!
            </Link>
            <Link
              to="/friends"
              className="hover:text-[var(--color-link-hover)] flex items-center gap-1"
            >
              <span className="text-xl">👥</span> Amigos
            </Link>

            {/* Avatar y menú */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus:outline-none"
              >
                <img
                  src={`http://localhost:8080${userData?.profilePicture}`}
                  alt="Perfil"
                  className="h-10 w-10 rounded-full border border-white"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] shadow-lg rounded-lg p-4 space-y-4 z-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={`http://localhost:8080${userData?.profilePicture}`}
                      alt="Perfil"
                      className="h-10 w-10 rounded-full border"
                    />
                    <span className="font-semibold">{userData?.username}</span>
                  </div>

                  <Link
                    to="/profile"
                    className="block w-full text-center py-1 rounded bg-blue-500 text-white font-medium hover:brightness-110 transition-all"
                  >
                    Ver Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-1 rounded bg-red-500 text-white font-medium hover:brightness-110 transition-all"
                  >
                    Cerrar Sesión
                  </button>

                  <hr className="border-t border-[var(--color-border)]" />

                  <div className="flex justify-center">
                    <DarkModeToggle />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="hover:text-[var(--color-link-hover)] flex items-center gap-1"
            >
              <span className="text-xl">📝</span> Regístrate
            </Link>
            <Link
              to="/login"
              className="hover:text-[var(--color-link-hover)] flex items-center gap-1"
            >
              <span className="text-xl">🔑</span> Iniciar sesión
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
