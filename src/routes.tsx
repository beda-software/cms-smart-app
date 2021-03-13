import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "effector-react";
import { $auth } from "./stores/auth";
import SignIn from "./pages/auth/Signin";
import Home from "./pages/home/Home";

const Loading = () => <div>Loading...</div>;

const Routes = (): any => {
  const { loading, ready } = useStore($auth);
  if (loading) {
    return [
      {
        path: "/",
        element: <Loading />,
      },
      { path: "*", element: <Navigate to="/" /> },
    ];
  }

  if (!loading) {
    return [
      {
        path: "/",
        element: <SignIn />,
      },
      { path: "*", element: <Navigate to="/" /> },
    ];
  }
  if (!loading && ready) {
    return [
      {
        path: "/",
        element: <Home />,
      },
      { path: "*", element: <Navigate to="/" /> },
    ];
  }
  return null;
};

export default Routes;
