import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function UserSearchItem({ user, isFriend, onRequestSent }) {
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async () => {
    try {
      await apiClient.post(`/friends/request/${user.id}`);
      setRequested(true);
      if (onRequestSent) onRequestSent(user.id);
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar la solicitud.");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-4">
        <img
          src={
            user.profilePicture
              ? `${import.meta.env.VITE_MEDIA_URL}${user.profilePicture}`
              : "/default_avatar.png"
          }
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-medium">{user.username}</span>
      </div>

      {requested ? (
        <span className="text-sm text-gray-500">Enviada</span>
      ) : (
        <button
          onClick={handleSendRequest}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:brightness-110 text-sm"
          disabled={isFriend}
        >
          Enviar solicitud
        </button>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
