import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, isTrialExpired } from "@/lib/auth-store";

interface Props {
  children: React.ReactNode;
}

/** Wraps routes that require authentication + active trial */
export function ProtectedRoute({ children }: Props) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isTrialExpired()) {
    return <Navigate to="/pricing" state={{ trialExpired: true }} replace />;
  }

  return <>{children}</>;
}
