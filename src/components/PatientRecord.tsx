import React, { FC, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "effector-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import PatientBadge from "./PatientBadge";
import { explanationOfBenefits } from "../fixtures";
import { $client, $user, initSmartClientFx } from "../stores/auth";
import Button from "./Button";
import UserBadge from "./UserBadge";

import env from "../env";

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

  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div></div>
        <script src="https://cdn.jsdelivr.net/npm/fhirclient@latest/build/fhir-client.min.js"></script>
        <script>
          var data = {
            iss: '${env.FHIR_SERVER}',
            clientId: '${env.CLIENT_SMART}',
            scope: '${env.SCOPE}',
            patientId: '${link.link.id}'
          }

          console.log("HELLO FROM IFRAME", window.location);


          //FHIR.oauth2.authorize(data);
        </script>
      </body>
    </html>`;

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
            <ExplanationOfBenefits items={explanationOfBenefits} />
          )}
        </Grid.Column>
      </Grid>
      <iframe
        sandbox="allow-top-navigation allow-scripts allow-forms allow-popups"
        width="500"
        height="300"
        srcDoc={html}
        name="my-iframe"
        id="my-iframe"
        title="Iframe AUTH"
      />
    </>
  );
};

export default PatientRecord;
