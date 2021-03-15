import React, { useEffect, useState } from "react";
import Client from "fhirclient/lib/Client";
import { useStore } from "effector-react";
import { FHIRClientProvider } from "../context/FhirClient";
import { initSmartClient } from "../lib";
import Header from "../components/Header";
import Home from "./home/Home";
import { $user } from "../stores/auth";

const IndexPage: React.FC = () => {
  const [client, setClient] = useState<null | Client>(null);
  const { loading, data: user, fhir } = useStore($user);

  useEffect(() => {
    if (fhir) {
      initSmartClient(fhir).then((smartClient) => {
        setClient(smartClient);
      });
    }
  }, [fhir]);
  if (client === null || loading) {
    return <div>Loading...</div>;
  }

  return (
    <FHIRClientProvider client={client}>
      <Header user={user} />
      <main style={{ padding: "1rem" }}>
        <Home client={client} />
      </main>
      <footer />
    </FHIRClientProvider>
  );
};

export default IndexPage;
