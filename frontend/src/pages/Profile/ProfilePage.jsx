import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import UploadAvatar from "../../components/common/UploadAvatar";

export default function ProfilePage() {
  const { authToken, userId } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser(userId);
        setUser(data);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleAvatarUpload = (newAvatarPath) => {
    setUser((prev) => ({ ...prev, avatarPath: newAvatarPath }));
  };

  if (!user) return <div className="text-center">Cargando perfil...</div>;

  return (
    <div className="min-h-[calc(100vh-260px)] flex items-center justify-center bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] transition-colors duration-500">
      <div className="bg-[color:var(--color-card)] shadow-md rounded-lg p-8 w-full max-w-md space-y-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Perfil de usuario</h2>

        <img
          src={`http://localhost:8080${user.profilePicture}`}
          alt="Avatar"
          className="w-full h-full object-cover"
        />

        <div className="space-y-2">
          <div>
            <strong>Nombre:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        </div>

        <UploadAvatar onUploadSuccess={handleAvatarUpload} />
      </div>
    </div>
  );
}
