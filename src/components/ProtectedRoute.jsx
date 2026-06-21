import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader text="Checking access..." />;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
