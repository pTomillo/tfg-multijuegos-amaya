import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function UploadAvatar({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 2; // Tamaño máximo en MB

    if (!validTypes.includes(file.type)) {
      return "Solo se permiten archivos JPG o PNG.";
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `El archivo no puede superar ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona una imagen válida.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.avatarPath || response.data);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al subir el avatar.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--color-button)] file:text-white hover:file:brightness-110 transition"
      />
      <button
        onClick={handleUpload}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition"
      >
        Subir Avatar
      </button>
      {error && <div className="text-[color:var(--color-error)]">{error}</div>}
    </div>
  );
}
