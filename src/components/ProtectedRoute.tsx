import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Temporarily non-blocking for demo — all routes are accessible
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}