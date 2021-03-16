import React from "react";
import { Card, Grid, Header, Segment, Image } from "semantic-ui-react";
import { differenceInYears } from "date-fns";
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
  const ident = patient.identifier.map((i: any) => {
    return {
      key: i?.type?.coding?.[0]?.code,
      value: i?.value,
    };
  });

  return (
    <>
      <Card fluid>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          wrapped
          ui
        />
        <Card.Content>
          <Card.Header>
            {patient?.name?.[0]?.family},{" "}
            {patient?.name?.[0].given?.join(" ") || []},
            {` ${differenceInYears(
              new Date(),
              new Date(patient?.birthDate)
            )} years`}
          </Card.Header>
          <Card.Meta>
            <span className="date">{patient?.address?.[0]?.city}</span>
          </Card.Meta>
          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <b>Identifiers</b>
          </p>
          {ident.map((i: any) => (
            <Card.Description>
              <b>{i.key}</b> : {i.value}
            </Card.Description>
          ))}
          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <b>Contacts</b>
          </p>

          {patient?.telecom.map((i: any) => (
            <Card.Description>
              <b>{i.system}</b> : {i.value}
            </Card.Description>
          ))}
        </Card.Content>
      </Card>
    </>
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
