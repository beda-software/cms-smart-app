import React, { FC, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "effector-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import PatientBadge from "./PatientBadge";
import { explanationOfBenefits } from "../fixtures";
import { $client, $user, initSmartClientFx } from "../stores/auth";
import Button from "./Button";
import UserBadge from "./UserBadge";

const PatientRecord: FC = () => {
  const { client } = useStore($client);
  const { data: user } = useStore($user);
  const link = user?.link.find((l: any) => l.link.resourceType === "Patient");

  const [patient, setPatient] = useState(null);
  useEffect(() => {
    if (client) {
      client.request(`/fhir/Patient/${link.link.id}`).then((res: any) => {
        console.log(res);
      });
    }
  }, [patient, client, link]);

  console.log(client);

  return (
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
          <ExplanationOfBenefits items={explanationOfBenefits} />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PatientRecord;
