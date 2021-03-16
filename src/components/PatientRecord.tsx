import React, { FC } from "react";
import { Grid } from "semantic-ui-react";
import ExplanationOfBenefits from "./ExplanationOfBenefits";

import { usePatient } from "../context/PatientProvider";
import PatientBadge from "./PatientBadge";
import { explanationOfBenefits } from "../fixtures";

type PatientRecordProps = {
  resources: ReadonlyArray<Record<string, any>>;
};

const getResourceByType = (
  patientRecord: ReadonlyArray<any>,
  resourceType: string
) => {
  return patientRecord.filter(
    (resource) => resource.resourceType === resourceType
  );
};

const PatientRecord: FC<PatientRecordProps> = ({ resources }) => {
  const patient = usePatient();
  return (
    <Grid container stretched doubling columns={2} stackable>
      <Grid.Column largeScreen={5} mobile={16}>
        <PatientBadge patient={patient} />
      </Grid.Column>
      <Grid.Column largeScreen={11} mobile={16}>
        <ExplanationOfBenefits items={explanationOfBenefits} />
      </Grid.Column>
    </Grid>
  );
};

export default PatientRecord;
