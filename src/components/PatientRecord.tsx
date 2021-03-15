import React, { FC } from "react";
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
    <div>
      <PatientBadge patient={patient} />
      <ExplanationOfBenefits items={explanationOfBenefits} />
    </div>
  );
};

export default PatientRecord;
