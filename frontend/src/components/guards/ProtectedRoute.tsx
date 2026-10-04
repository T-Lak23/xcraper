import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/auth.store";
import { Loader } from "../ui/Loader";

export const ProtectedRoute = () => {
  const { isAuthLoding, isAuthenticated } = useAuthStore();

  if (isAuthLoding) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <Loader label="Loading..." />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
