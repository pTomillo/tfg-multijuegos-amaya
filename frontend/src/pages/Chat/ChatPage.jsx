import { useParams } from "react-router-dom";
import ChatComponent from "../../components/chat/ChatComponent";
export default function ChatPage() {
  const { recipientId } = useParams(); // o prop directamente

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] p-6">
      <ChatComponent recipientId={parseInt(recipientId)} />
    </div>
  );
}
