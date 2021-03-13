import React from "react";
import {
  useSmartCreate,
  useSmartDelete,
  useSmartSearch,
  useSmartUser,
} from "../react-smart";

export interface IPatient {
  id: string;
  birthDate?: string;
  name?: { given?: string[]; family?: string }[];
}

export interface INewPatient {
  birthDate?: string;
  name?: string;
}

const PatientsPage = () => {
  const [selectedPatient, setSelectedPatient] = React.useState<IPatient | null>(
    null
  );
  const [newPatient, setNewPatient] = React.useState<INewPatient>({});
  const smartUser = useSmartUser();

  // Queries
  const {
    data: patients,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = useSmartSearch<IPatient>("Patient");

  // Mutations
  const [addPatient, { loading: addPatientLoading }] = useSmartCreate<IPatient>(
    "Patient"
  );
  const [removePatient, { loading: removePatientLoading }] = useSmartDelete(
    "Patient"
  );
  const [logOut, { loading: logOutLoading }] = useSmartDelete("Session");

  if (patientsLoading && !patients) {
    return <div className="ui loader active text">Loading...</div>;
  }

  if (!patients) {
    return null;
  }
  const onRemovePatientClick = (patientId: string) => {
    removePatient(patientId).then(refetchPatients);
  };

  const onAddPatientSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    addPatient({
      name: [{ given: [newPatient.name] }],
      birthDate: newPatient.birthDate,
    }).then(() => {
      setNewPatient({});
      setSelectedPatient(null);
      refetchPatients();
    });
  };

  const onLogOutClick = () => {
    logOut().then(() => {
      sessionStorage.clear();
      window.location.href = "/";
    });
  };

  return (
    <div className="ui container" style={{ paddingTop: 50 }}>
      {/* Toolbar */}
      {smartUser && (
        <div style={{ textAlign: "right" }}>
          <span>
            Logged in as <b>{smartUser.name.formatted}</b>
          </span>
          <button
            type="button"
            className="ui button"
            onClick={onLogOutClick}
            disabled={logOutLoading}
            style={{ marginLeft: 25 }}
          >
            Log Out
          </button>
        </div>
      )}

      {/* Patients table */}
      <div>
        <h2 className="ui header">Patients</h2>
        <table className="ui table celled">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Birth Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    {patient.id}
                  </button>
                </td>
                <td>{patient.name![0].given![0]}</td>
                <td>{patient.birthDate}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="ui circular icon button"
                    onClick={() => onRemovePatientClick(patient.id)}
                    disabled={removePatientLoading}
                  >
                    <i className="icon trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Adding Patient */}
        <h2 className="ui header">Add patient</h2>
        <form onSubmit={onAddPatientSubmit}>
          <div className="ui input">
            <input
              placeholder="Name"
              type="text"
              required
              value={newPatient.name || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
            />
          </div>
          <div className="ui input" style={{ marginLeft: 10 }}>
            <input
              placeholder="Birth Date"
              type="text"
              required
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              value={newPatient.birthDate || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, birthDate: e.target.value })
              }
            />
          </div>
          <button
            className="ui button"
            type="submit"
            style={{ marginLeft: 10 }}
            disabled={addPatientLoading}
          >
            Save
          </button>
        </form>
      </div>

      {/* Selected Patient */}
      {selectedPatient && (
        <div className="ui secondary segment">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <i
            className="ui icon times"
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => setSelectedPatient(null)}
          />
          <h2 className="ui header">
            Patient
            {selectedPatient.id}
          </h2>
          <code>
            <pre>{JSON.stringify(selectedPatient, null, 2)}</pre>
          </code>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
