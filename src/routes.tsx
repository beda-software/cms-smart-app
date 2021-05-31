import React from "react";
import { Navigate, PartialRouteObject } from "react-router";
import { useStore } from "effector-react";
import { $client } from "./stores/auth";
import EobDetail from "./pages/eob-detail";
import PatientRecord from "./components/PatientRecord";
import Layout from "./pages/layout";

const Routes = (): PartialRouteObject[] => {
  const client = useStore($client);

  if (!client) {
    return [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <PatientRecord />,
          },
        ],
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
