import React, { FC, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "effector-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import PatientBadge from "./PatientBadge/PatientBadge";
import { $client, $user, initSmartClientFx } from "../stores/auth";
import { $patient, fetchPatientFx } from "../stores/patient";
import { Button } from "./ui";
import UserBadge from "./UserBadge/UserBadge";

const PatientRecord: FC = () => {
  const client = useStore($client);
  const { data: user } = useStore($user);
  const patient = useStore($patient);

  const link = React.useMemo(
    () => user?.link.find((l: any) => l.link.resourceType === "Patient"),
    [user?.link]
  );

  useEffect(() => {
    if (client) {
      fetchPatientFx({ client, patient: link.link.id });
    }
  }, [client, link]);

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
          {!client ? (
            <Button
              title="Get data from server"
              onClick={() => initSmartClientFx(link.link.id)}
            />
          ) : (
            <ExplanationOfBenefits patientId={link.link.id} />
          )}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default PatientRecord;
