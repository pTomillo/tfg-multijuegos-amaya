import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function EditUserPopup({
  userId,
  userData,
  onClose,
  onSuccess,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await apiClient.put(`/user/${userId}`, {
        username,
        email,
        profilePicture: userData.profilePicture,
      });
      onSuccess(); // Notificar éxito y recargar perfil
      onClose(); // Cerrar el popup
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al actualizar los datos.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Introduzca los datos que desea cambiar
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none bg-transparent"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none bg-transparent"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:brightness-110"
          >
            Cambiar datos del usuario
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-gray-500 text-white rounded hover:brightness-110"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
