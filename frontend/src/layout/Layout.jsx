import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-background)] text-[color:var(--color-textPrimary)] transition-colors duration-500">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
