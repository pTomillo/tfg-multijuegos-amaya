import apiClient from "../../api/apiClient";

export default function DeleteAccountPopup({ userId, onClose, onSuccess }) {
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/user/${userId}`);
      onSuccess(); // Para cerrar sesión, redirigir o actualizar la vista
      onClose();
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      // Opcionalmente puedes mostrar algún mensaje de error
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-xl p-6 w-full max-w-sm shadow-lg space-y-6 text-center">
        <h2 className="text-lg font-bold">
          ¿Estás seguro de que deseas eliminar tu cuenta?
        </h2>
        <p className="text-[var(--color-textSecondary)] text-sm">
          Esta acción es irreversible. Todos tus datos serán eliminados.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleDelete}
            className="py-2 bg-red-500 text-white rounded hover:brightness-110"
          >
            Sí, eliminar cuenta
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
