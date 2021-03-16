import React, { useEffect, useState } from "react";
import Client from "fhirclient/lib/Client";
import { getPatientRecord } from "../../lib";
import PatientRecord from "../../components/PatientRecord";

const Home = ({ client }: { client: Client | null }) => {
  const [patientRecords, setPatientRecords] = useState<Array<any>>([]);
  useEffect(() => {
    if (client) {
      getPatientRecord(client)
        .then((records: Array<any>) => {
          if (records) {
            setPatientRecords(records);
          }
        })
        .catch((e) => console.log("error", e));
    }
  }, [client]);
  return <PatientRecord />;
};

export default Home;
