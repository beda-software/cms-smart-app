import React from "react";
/* import { useStore } from "effector-react"; */
import { Outlet } from "react-router-dom";
/* import { Header } from "../components/ui"; */
/* import { $user } from "../stores/auth"; */
import { ErrorBoundary } from "../components/ErrorBoundary";
/* import { IUser } from "../lib/types"; */

const Layout: React.FC = () => {
    /* const { loading, data: user } = useStore($user); */
    /* 
     *   if (loading) {
     *     return <div>Loading...</div>;
     *   }
     *  */
  return (
    <ErrorBoundary>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
      <footer />
    </ErrorBoundary>
  );
};

export default Layout;
