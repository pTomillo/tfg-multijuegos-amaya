import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function ChangeAvatarPopup({ userId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo y tamaño de imagen
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("El archivo no puede superar 2MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona una imagen válida.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(); // Actualizar avatar mostrado
      onClose(); // Cerrar popup
    } catch (error) {
      console.error("Error al subir avatar:", error);
      setError("Error al subir imagen.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-xl p-6 w-full max-w-sm shadow-lg space-y-6">
        <h2 className="text-lg font-bold text-center">Cambiar Avatar</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-blue-500 file:text-white hover:file:brightness-110 cursor-pointer"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleUpload}
            className="py-2 bg-[var(--color-primary)] text-white rounded hover:brightness-110"
          >
            Subir Imagen
          </button>
          <button
            onClick={onClose}
            className="py-2 bg-gray-500 text-white rounded hover:brightness-110"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
