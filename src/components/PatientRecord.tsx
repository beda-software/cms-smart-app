import React, { FC, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "effector-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import PatientBadge from "./PatientBadge/PatientBadge";
import { $client, $user, initSmartClientFx } from "../stores/auth";
import { $patient, fetchPatientFx } from "../stores/patient";
import { Button, Input } from "./ui";
import UserBadge from "./UserBadge/UserBadge";

const PatientRecord: FC = () => {
  const client = useStore($client);
  const { data: user } = useStore($user);
  const [clientId, setClientID] = useState("");
  const patient = useStore($patient);

  useEffect(() => {
    if (client) {
      fetchPatientFx({ client, user: user.id });
    }
  }, [client, user.id]);

  return (
    <>
      <Grid container>
        <Grid.Column tablet={6} largeScreen={6} widescreen={6} mobile={16}>
          {patient ? (
            <PatientBadge patient={patient} />
          ) : (
            <UserBadge user={user} />
          )}
        </Grid.Column>

        <Grid.Column tablet={10} largeScreen={10} widescreen={10} mobile={16}>
          {!client && (
            <div>
              <span>ClientId - optional</span>
              <Input
                value={clientId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  setClientID(value);
                }}
              />
              <Button
                title="Get data from server"
                onClick={() => initSmartClientFx(clientId)}
              />
            </div>
          )}
          {patient?.id && <ExplanationOfBenefits patientId={patient.id} />}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default PatientRecord;
