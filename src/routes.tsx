import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "effector-react";
import { $token } from "./stores/auth";
import SignIn from "./pages/auth/Signin";
import IndexPage from "./pages";

const Routes = (): any => {
  const token = useStore($token);

  if (!token) {
    return [
      {
        path: "/",
        element: <SignIn />,
      },
      { path: "*", element: <Navigate to="/" /> },
    ];
  }
  if (token) {
    return [
      {
        path: "/",
        element: <IndexPage />,
      },
      { path: "*", element: <Navigate to="/" /> },
    ];
  }
  return null;
};

export default Routes;
