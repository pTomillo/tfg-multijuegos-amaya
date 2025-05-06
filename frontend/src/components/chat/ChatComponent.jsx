import { useEffect, useRef, useState, useContext } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import apiClient from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";

export default function ChatComponent({ recipientId }) {
  const { userId } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [recipientData, setRecipientData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch current username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await apiClient.get(`/user/${userId}`);
        setUsername(res.data.username);
      } catch (err) {
        console.error("No se pudo obtener el username:", err);
      }
    };
    fetchUsername();
  }, [userId]);

  // Fetch recipient data and message history
  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const res = await apiClient.get(`/user/${recipientId}`);
        setRecipientData(res.data);
      } catch (err) {
        console.error("No se pudo obtener datos del destinatario:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await apiClient.get(
          `/messages/conversation/${recipientId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };

    if (recipientId) {
      fetchRecipient();
      fetchMessages();
    }
  }, [recipientId]);

  // Connect to WebSocket and subscribe
  useEffect(() => {
    if (!username) return;

    const socket = new SockJS(`${import.meta.env.VITE_WS_URL}/ws`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/topic/messages/${userId}`, (msg) => {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
    });

    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [username]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "" || !stompClient.current) return;

    const message = {
      senderId: userId,
      recipientId,
      content: newMessage,
      senderUsername: username,
      id: Date.now(), // ID temporal para el render
    };

    // Enviar por WebSocket
    stompClient.current.send("/app/chat", {}, JSON.stringify(message));

    // Agregarlo inmediatamente al historial local
    setMessages((prev) => [...prev, message]);

    // Limpiar campo
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-[var(--color-card)] rounded-xl shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-2">
        <img
          src={
            recipientData?.profilePicture
              ? `${import.meta.env.VITE_MEDIA_URL}${
                  recipientData.profilePicture
                }`
              : "/default_avatar.png"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-bold text-lg">
          {recipientData?.username || "Usuario"}
        </span>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto space-y-2 bg-[var(--color-background)] p-2 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.senderId == userId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border rounded bg-transparent focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:brightness-110"
          title="Enviar mensaje"
        >
          💬
        </button>
      </div>
    </div>
  );
}
