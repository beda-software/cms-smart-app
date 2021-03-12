import React, { useEffect } from "react";
import { initSmartClient, SmartContext, useSmartCreate, useSmartDelete, useSmartSearch } from "./react-smart";
import Client from "fhirclient/lib/Client";
import PatientsPage from "./components/PatientsPage";

const App: React.FC = () => {
  const [smartClient, setSmartClient] = React.useState<Client | null>(null);

  useEffect(() => {
    initSmartClient().then(setSmartClient);
  }, []);

  return (
    <SmartContext.Provider value={{ smartClient }}>
      <PatientsPage></PatientsPage>
    </SmartContext.Provider>
  );
};

export default App;
