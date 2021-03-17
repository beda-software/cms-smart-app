import React from "react";
import { Navigate, PartialRouteObject } from "react-router";
import { useStore } from "effector-react";
import { $token } from "./stores/auth";
import SignIn from "./pages/auth/Signin";
import EobDetail from "./pages/eob-detail";
import PatientRecord from "./components/PatientRecord";
import Layout from "./pages/layout";

const Routes = (): PartialRouteObject[] => {
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
};

export default Routes;
