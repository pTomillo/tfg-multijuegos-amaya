import { useState } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      setError("Por favor, introduce un nombre de usuario.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }

    try {
      await authService.register({ username, email, password });
      navigate("/login"); // Redirige a login tras registrarse
    } catch (err) {
      console.error(err);
      setError("Error al registrar. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-260px)] flex items-center justify-center bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] transition-colors duration-500">
      <div className="bg-[color:var(--color-card)] shadow-md rounded-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center mb-4">Crear cuenta</h2>

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
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:brightness-110 transition"
          >
            Registrarse
          </button>
        </form>

        {/* Volver a login */}
        <div className="border-t pt-4 mt-4 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="text-[color:var(--color-link)] hover:text-[color:var(--color-link-hover)] font-bold transition"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
