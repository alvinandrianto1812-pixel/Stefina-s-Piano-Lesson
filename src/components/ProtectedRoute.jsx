// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // AuthProvider handle loading state

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
