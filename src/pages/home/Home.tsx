import React, { useEffect, useState } from "react";
import Client from "fhirclient/lib/Client";
import { getPatientRecord } from "../../lib";
import { PatientProvider } from "../../context/PatientProvider";
import PatientRecord from "../../components/PatientRecord";

const Home = ({ client }: { client: Client }) => {
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
  return (
    <PatientProvider>
      <PatientRecord resources={patientRecords} />
    </PatientProvider>
  );
};

export default Home;
