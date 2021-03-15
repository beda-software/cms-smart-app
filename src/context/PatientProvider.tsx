import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useFHIRClient } from "./FhirClient";

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientContext = createContext<fhir.Patient | null>(null);

export const PatientProvider: FC<PatientProviderProps> = ({ children }) => {
  const client = useFHIRClient();
  const [patient, setPatient] = useState<any | null>(null);
  useEffect(() => {
    if (client?.patient?.id) {
      client.patient.read().then((res: any) => {
        setPatient(res);
      });
    }
  }, [client]);
  return patient == null ? (
    <div>Loading...</div>
  ) : (
    <PatientContext.Provider value={patient}>
      {children}
    </PatientContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePatient = (): fhir.Patient => useContext(PatientContext)!;
