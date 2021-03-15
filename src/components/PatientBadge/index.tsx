import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { obsValue } from "../../lib/fhirHelpers";
import classes from "./index.module.css";

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
    <Segment>
      <Header as="h2">Patient</Header>
      <Grid columns={2}>
        <Grid.Column>
          <div className={classes.row}>
            <div className={classes.label}>Name</div>
            <div>
              {patient?.name?.[0]?.family},{" "}
              {patient?.name?.[0].given?.join(" ") || []}
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Gender</div>
            <div>{patient?.gender}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Date of Birth</div>
            <div>{patient?.birthDate}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Address</div>
            <div>{patient?.address?.[0]?.line?.join(" ")}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>City, State</div>
            <div>
              {patient?.address?.[0]?.city}, {patient?.address?.[0]?.state}
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Postal Code</div>
            <div>{patient?.address?.[0]?.postalCode}</div>
          </div>
          {patient.deceasedDateTime && (
            <div className={classes.row}>
              <span className={classes.label}>Cause of Death</span>
              <span>{causeOfDeathObs}</span>
            </div>
          )}
        </Grid.Column>
        <Grid.Column>
          <div className={classes.row}>
            <div className={classes.label}>Height</div>
            <div>{obsValue(heightObs) || "unk."}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Weight</div>
            <div>{obsValue(heightObs) || "unk."}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Race</div>
            <div>{race || "unk."}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Ethnicity</div>
            <div>{ethnicity || "unk."}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Language</div>
            <div>{language || "unk."}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Blood Type</div>
            <div>unk.</div>
          </div>
        </Grid.Column>
      </Grid>
    </Segment>
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
