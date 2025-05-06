import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import apiClient from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";

export default function FriendList() {
  const { userId } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate(); // ← añadido

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await apiClient.get("/friends/listOfFriends");
        setFriends(response.data);
      } catch (error) {
        console.error("Error al obtener amigos:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleUnfriend = async (friendId) => {
    try {
      await apiClient.delete(`/friends/deleteFriend/${friendId}`);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
    } catch (err) {
      console.error("Error al eliminar amigo:", err);
    }
  };

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-4 bg-[var(--color-card)] rounded-xl shadow-md"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                friend.profilePicture
                  ? `${import.meta.env.VITE_MEDIA_URL}${friend.profilePicture}`
                  : "/default_avatar.png"
              }
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <span className="font-medium">{friend.username}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/chat/${friend.id}`)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:brightness-110"
            >
              Enviar Mensaje
            </button>
            <button
              onClick={() => handleUnfriend(friend.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:brightness-110"
            >
              Dejar de ser amigos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
