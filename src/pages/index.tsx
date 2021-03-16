import React from "react";
import { useStore } from "effector-react";
import Header from "../components/Header";
import { $user } from "../stores/auth";
import PatientRecord from "../components/PatientRecord";

const IndexPage: React.FC = () => {
  const { loading, data: user } = useStore($user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header user={user} />
      <main style={{ padding: "1rem" }}>
        <PatientRecord />
      </main>
      <footer />
    </>
  );
};

export default IndexPage;
