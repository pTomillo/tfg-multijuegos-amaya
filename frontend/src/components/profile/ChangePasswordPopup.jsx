import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function ChangePasswordPopup({ userId, onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[!@#$%^&*(),.?":{}|<>]/g.test(password) &&
      /\d/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "La nueva contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }

    try {
      await apiClient.put(`/user/${userId}/password`, {
        password: currentPassword,
        newPassword: newPassword,
      });
      onSuccess(); // Para recargar o mostrar éxito
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        "Error al cambiar la contraseña. Verifica tu contraseña actual."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none bg-transparent"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none bg-transparent"
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none bg-transparent"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:brightness-110"
          >
            Cambiar Contraseña
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
