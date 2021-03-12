import React from "react";
import { useSmartCreate, useSmartDelete, useSmartSearch } from "../react-smart";

export interface IPatient {
  id: string;
  birthDate?: string;
  name?: { given?: string[]; family?: string }[];
}

const PatientsPage = () => {
  const [selectedPatient, setSelectedPatient] = React.useState<IPatient | null>(null);
  const { data: patients, loading: patientsLoading, refetch: refetchPatients } = useSmartSearch<IPatient>(
    "Patient"
  );

  const [addPatient, { loading: addPatientLoading }] = useSmartCreate<IPatient>("Patient");
  const [removePatient, { loading: removePatientLoading }] = useSmartDelete("Patient");

  if (patientsLoading && !patients) {
    return <div className="ui loader active text">Loading...</div>;
  }

  if (!patients) {
    return null;
  }

  const onRemovePatientClick = (patientId: string) => {
    removePatient(patientId).then(refetchPatients);
  };

  const onAddPatientClick = () => {
    const name = window.prompt("Patient name");
    if (!name) {
      return;
    }
    addPatient({
      name: [{ given: [name] }],
      birthDate: "2021-01-01",
    }).then(refetchPatients);
  };

  return (
    <div className="ui container" style={{ paddingTop: 50 }}>
      {/*Patients table*/}
      <div>
        <button
          className="ui right floated primary button"
          onClick={onAddPatientClick}
          disabled={addPatientLoading}
        >
          Add Patient
        </button>
        <h2 className="ui header">Patients</h2>
        <table className="ui table celled">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              return (
                <tr key={patient.id}>
                  <td>
                    <a href="#" onClick={() => setSelectedPatient(patient)}>
                      {patient.id}
                    </a>
                  </td>
                  <td>{patient.name![0].given![0]}</td>
                  <td>{patient.birthDate}</td>
                  <td>
                    <button
                      className="ui icon button"
                      onClick={() => onRemovePatientClick(patient.id)}
                      disabled={removePatientLoading}
                    >
                      <i className="icon trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/*Selected Patient view*/}
      {selectedPatient && (
        <div>
          <div className="ui divider"></div>
          <div>
            <h2 className="ui header">Patient {selectedPatient.id}</h2>
            <code>
              <pre>{JSON.stringify(selectedPatient, null, 2)}</pre>
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
