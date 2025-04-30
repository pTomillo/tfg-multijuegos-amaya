import { useContext, useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import UserSearchItem from "./UserSearchItem";
import { AuthContext } from "../../context/AuthContext";

export default function UserSearch() {
  const { userId: currentUserId } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friendsIds, setFriendsIds] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, friendsRes, sentRes, receivedRes] = await Promise.all([
          apiClient.get("/users/"),
          apiClient.get("/friends/listOfFriends"),
          apiClient.get("/friends/requestSent"),
          apiClient.get("/friends/recievedRequest"),
        ]);

        const userList = usersRes.data || [];

        const friendIds = friendsRes.data?.map((f) => f.id) || [];
        const sentIds = sentRes.data?.map((r) => r.user2Id) || [];
        const receivedIds = receivedRes.data?.map((r) => r.user1Id) || [];
        const allPending = [...sentIds, ...receivedIds];

        setFriendsIds(friendIds);
        setPendingIds(allPending);

        const filtered = userList.filter(
          (u) =>
            u.id !== currentUserId &&
            !friendIds.includes(u.id) &&
            !allPending.includes(u.id)
        );

        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (err) {
        console.error("Error al obtener datos de usuario/amigos:", err);
      }
    };

    fetchAll();
  }, [currentUserId]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = search.toLowerCase();
      setFilteredUsers(
        users.filter((user) => user.username.toLowerCase().includes(lower))
      );
    }
  }, [search, users]);

  return (
    <div className="space-y-4 relative bg-[var(--color-card)] p-4 rounded-xl shadow max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-center mb-4">
          Buscar Amigos
        </h2>
        <button
          onClick={() => setShowResults(false)}
          className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:brightness-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onFocus={() => setShowResults(true)}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-transparent focus:outline-none"
      />

      {showResults && (
        <div className="max-h-80 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserSearchItem key={user.id} user={user} />
            ))
          ) : (
            <p className="text-center text-sm text-[var(--color-textSecondary)]">
              No se encontraron usuarios.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
