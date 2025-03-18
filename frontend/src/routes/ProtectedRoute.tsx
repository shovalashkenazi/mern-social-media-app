import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.user);

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
