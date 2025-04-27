import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Por favor, introduce un nombre de usuario válido.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }

    try {
      const data = await authService.login({ username, password });
      const { jwttoken, userId } = data;
      login(jwttoken, userId);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Nombre de usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-260px)] flex items-center justify-center bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] transition-colors duration-500">
      <div className="bg-[color:var(--color-card)] shadow-md rounded-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center mb-4">Iniciar sesión</h2>

        {error && (
          <div className="text-[color:var(--color-error)] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] border border-[color:var(--color-border)] w-full"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] border border-[color:var(--color-border)] w-full"
            required
          />

          <button
            type="submit"
            className="w-full bg-[color:var(--color-button)] text-[color:var(--color-button-text)] font-bold py-3 rounded-md hover:brightness-110 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Botón de crear cuenta */}
        <div className="border-t pt-4 mt-4 flex justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition"
          >
            Crear una cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
