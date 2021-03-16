import React from "react";
import { useStore } from "effector-react";
import { FHIRClientProvider } from "../context/FhirClient";
import Header from "../components/Header";
import Home from "./home/Home";
import { $client, $user, smartLaunchFx } from "../stores/auth";
import Button from "../components/Button";

const IndexPage: React.FC = () => {
  const { loading, data: user } = useStore($user);
  const client = useStore($client);
  const link = user?.link.find((l: any) => l.link.resourceType === "Patient");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <FHIRClientProvider client={client}>
      <Button
        title="Load patient"
        onClick={() => smartLaunchFx(link.link.id)}
      />
      {client ? (
        <>
          <Header user={user} />
          <main style={{ padding: "1rem" }}>
            <Home client={client} />
          </main>
          <footer />
        </>
      ) : (
        <Header user={user} />
      )}
    </FHIRClientProvider>
  );
};

export default IndexPage;
