import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  // If user is not authenticated, redirect to auth page
  if (authStatus !== "authenticated") {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
}