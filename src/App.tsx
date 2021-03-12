import React, { useEffect } from "react";
import { initSmartClient, SmartContext } from "./react-smart";
import Client from "fhirclient/lib/Client";
import PatientsPage from "./components/PatientsPage";

const App: React.FC = () => {
  const [smartClient, setSmartClient] = React.useState<Client | null>(null);
  const [smartUser, setSmartUser] = React.useState<any | null>(null);

  useEffect(() => {
    initSmartClient().then((smartClient) => {
      setSmartClient(smartClient);
      setSmartUser(smartClient.getState().tokenResponse.userinfo);
    });
  }, []);

  return (
    <SmartContext.Provider value={{ smartClient, smartUser }}>
      <PatientsPage></PatientsPage>
    </SmartContext.Provider>
  );
};

export default App;
