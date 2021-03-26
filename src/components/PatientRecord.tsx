import React, { FC, useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";
import { useStore } from "effector-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import PatientBadge from "./PatientBadge/PatientBadge";
import { $client, $user, initSmartClientFx } from "../stores/auth";
import { $patient, fetchPatientFx } from "../stores/patient";
import { Button, Input } from "./ui";
import UserBadge from "./UserBadge/UserBadge";
import classes from "./ExplanationOfBenefits/index.module.css";

const PatientRecord: FC = () => {
  const client = useStore($client);
  const { data: user } = useStore($user);
  const [clientId, setClientID] = useState("");
  const patient = useStore($patient);

  useEffect(() => {
    if (client) {
      fetchPatientFx({ client, user });
    }
  }, [client, user]);

  return (
    <>
      <Grid container>
        <Grid.Column tablet={4} largeScreen={4} widescreen={4} mobile={16}>
          {patient ? (
            <PatientBadge patient={patient} />
          ) : (
            <UserBadge user={user} />
          )}
        </Grid.Column>

        <Grid.Column tablet={12} largeScreen={12} widescreen={12} mobile={16}>
          {!client && (
            <div>
              <Header as="h2">Claims</Header>
              <div style={{ display: "flex" }}>
                <Button
                  title="Get data from server"
                  onClick={() => initSmartClientFx(clientId)}
                />
                <Input
                  style={{ marginLeft: "1rem", marginTop: 0, marginBottom: 0 }}
                  value={clientId}
                  placeholder="Client id optional"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    setClientID(value);
                  }}
                />
              </div>
            </div>
          )}
          {patient?.id && <ExplanationOfBenefits patientId={patient.id} />}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default PatientRecord;
