import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import Layout from "../layout/Layout";
import FriendsPage from "../pages/Friends/FriendsPage";
import GamesPage from "../pages/Games/GamesPage";
import LobbyPage from "../pages/Lobby/LobbyPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="/games/:gameId/lobby" element={<LobbyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
