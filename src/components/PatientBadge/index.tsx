import React from "react";
import classes from "./index.module.css";
import { getIn } from "../../lib/getIn";
import { obsValue } from "../../lib/fhirHelpers";

interface IPatientBadgeProps {
  patient: any;
  observations?: [];
}

const PatientBadge: React.FC<IPatientBadgeProps> = ({
  patient,
  observations,
}) => {
  if (!Object.keys(patient).length) {
    return null;
  }
  const innerPatient = patient;
  innerPatient.extension = patient.extension || [];
  const raceExt = innerPatient.extension.find((e: any) => {
    return (
      e.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"
    );
  });

  let race;
  if (raceExt) {
    race =
      raceExt.extension[0].valueString ||
      raceExt.extension[0].valueCoding.display;
  } else {
    race = null;
  }

  const ethExt = innerPatient.extension.find((e: any) => {
    return (
      e.url ===
      "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
    );
  });
  let ethnicity;
  if (ethExt) {
    ethnicity =
      ethExt.extension[0].valueString ||
      ethExt.extension[0].valueCoding.display;
  } else {
    ethnicity = null;
  }

  const language =
    patient?.communication?.[0]?.language?.coding?.[0]?.display || null;

  const causeOfDeathObs = null;
  const observation = observations || [];

  const searchableObs = observation.slice().reverse();
  const heightObs = searchableObs.find(
    (o: any) => o.code.coding[0].display === "Body Height"
  );
  const weightObs = searchableObs.find(
    (o: any) => o.code.coding[0].display === "Body Weight"
  );

  return (
    <div>
      <div className={classes.header}>
        <span>Patient</span>
      </div>
      <div className={classes.root}>
        <div className={classes.column}>
          <div className={classes.row}>
            <span className={classes.label}>Name</span>
            <span className={classes.value}>
              {patient?.name?.[0]?.family},{" "}
              {patient?.name?.[0].given?.join(" ") || []}
            </span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Gender</span>
            <span className={classes.value}>{patient?.gender}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Date of Birth</span>
            <span className={classes.value}>{patient?.birthDate}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Address</span>
            <span className={classes.value}>
              {patient?.address?.[0]?.line?.join(" ")}
            </span>
          </div>

          <div className={classes.row}>
            <span className={classes.label}>City, State</span>
            <span className={classes.value}>
              {patient?.address?.[0]?.city}, {patient?.address?.[0]?.state}
            </span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Postal Code</span>
            <span className={classes.value}>
              {patient?.address?.[0]?.postalCode}
            </span>
          </div>
          {patient.deceasedDateTime && (
            <div className={classes.row}>
              <span className={classes.label}>Cause of Death</span>
              <span className={classes.value}>{causeOfDeathObs}</span>
            </div>
          )}
        </div>
        <div className={classes.column}>
          <div className={classes.row}>
            <span className={classes.label}>Height</span>
            <span className={classes.value}>
              {obsValue(heightObs) || "unk."}
            </span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Weight</span>
            <span className={classes.value}>
              {obsValue(weightObs) || "unk."}
            </span>
          </div>

          <div className={classes.row}>
            <span className={classes.label}>Race</span>
            <span className={classes.value}>{race || "unk."}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Ethnicity</span>
            <span className={classes.value}>{ethnicity || "unk."}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Language</span>
            <span className={classes.value}>{language || "unk."}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Blood Type</span>
            <span className={classes.value}>unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBadge;

/*
    let lat, lng;
    if (patient.address[0].extension) {
      const geolocation = patient.address[0].extension.find(e => e.url === 'http://hl7.org/fhir/StructureDefinition/geolocation');

      if (geolocation && geolocation.extension.length > 1) {
        lat = geolocation.extension.find(e => e.url === 'latitude').valueDecimal;
        lng = geolocation.extension.find(e => e.url === 'longitude').valueDecimal;
      }
    }
* */
