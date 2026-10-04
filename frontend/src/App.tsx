import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { RedirectedRoute } from "./components/guards/RedirectedRoute";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";

const App = () => {
  const { getUser } = useAuthStore();

  useEffect(() => {
    (async () => {
      await getUser();
    })();
  }, []);

  return (
    <Routes>
      <Route element={<RedirectedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chat/:id?" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};

export default App;
