import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface SecuredRouteProps {
  children: React.ReactNode;
}

export default function SecuredRoute({ children }: SecuredRouteProps) {
  const location = useLocation();

  // Retrieve user data from localStorage
  const user = localStorage.getItem("userData");

  if (!user) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, render the children components
  return <>{children}</>;
}
