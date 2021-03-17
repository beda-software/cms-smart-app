import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "effector-react";
import { $token } from "./stores/auth";
import SignIn from "./pages/auth/Signin";
import EobDetail from "./pages/eob-detail";
import PatientRecord from "./components/PatientRecord";
import Layout from "./pages/layout";

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
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <PatientRecord />,
          },
          {
            path: "/eob/:id",
            element: <EobDetail />,
          },
        ],
      },

      { path: "*", element: <Navigate to="/" /> },
    ];
  }

  return null;
};

export default Routes;
