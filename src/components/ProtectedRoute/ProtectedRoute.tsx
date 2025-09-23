import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/",
}: ProtectedRouteProps) => {
  const { state } = useAppContext();
  const location = useLocation();

  if (!state.auth.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
