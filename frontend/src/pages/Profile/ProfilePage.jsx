import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import UploadAvatar from "../../components/profile/UploadAvatar";
import EditUserPopup from "../../components/profile/EditUserPopup";
import ChangePasswordPopup from "../../components/profile/ChangePasswordPopup";
import DeleteAccountPopup from "../../components/profile/DeleteAccountPopup";

export default function ProfilePage() {
  const { userId, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-2xl shadow-md p-6 w-full max-w-md text-center space-y-4 relative">
        <div className="relative w-45 h-45 mx-auto">
          <img
            src={
              userData?.profilePicture
                ? `http://localhost:8080${userData.profilePicture}`
                : "/default_avatar.png"
            }
            alt="Avatar"
            className="rounded-full w-full h-full object-cover border-2 border-[var(--color-border)]"
          />
          <button
            onClick={() => setShowAvatarPopup(true)}
            className="absolute -bottom-0.5 -right-0.5 bg-[var(--color-primary)] text-white rounded-full p-2 shadow hover:brightness-110 transition"
            title="Cambiar avatar"
          >
            ✏️
          </button>
        </div>

        <h2 className="text-xl font-semibold">{userData?.username}</h2>
        <p className="text-[var(--color-textSecondary)]">{userData?.email}</p>

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={() => setShowEditPopup(true)}
            className="bg-blue-300 text-black px-4 py-2 rounded hover:brightness-105"
          >
            Cambiar Datos
          </button>
          <button
            onClick={() => setShowPasswordPopup(true)}
            className="bg-blue-300 text-black px-4 py-2 rounded hover:brightness-105"
          >
            Cambiar Contraseña
          </button>
        </div>

        <button
          onClick={() => setShowDeletePopup(true)}
          className="bg-red-400 text-white px-4 py-2 rounded hover:brightness-110"
        >
          Eliminar Cuenta
        </button>
      </div>

      {showEditPopup && (
        <EditUserPopup
          userId={userId}
          userData={userData}
          onClose={() => setShowEditPopup(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {showPasswordPopup && (
        <ChangePasswordPopup
          userId={userId}
          onClose={() => setShowPasswordPopup(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {showDeletePopup && (
        <DeleteAccountPopup
          userId={userId}
          onClose={() => setShowDeletePopup(false)}
          onSuccess={() => {
            logout();
            window.location.href = "/";
          }}
        />
      )}

      {showAvatarPopup && (
        <UploadAvatar
          userId={userId}
          onClose={() => setShowAvatarPopup(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
