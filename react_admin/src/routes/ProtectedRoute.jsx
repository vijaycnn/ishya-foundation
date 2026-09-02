import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, loading = false, children }) => {
  if (loading) {
    return null; // avoid redirect flicker while auth state is restoring
  }
  if (!isAuthenticated) {
    // return <Navigate to="/admin" />;
  }
  return children;
};

export default ProtectedRoute;
