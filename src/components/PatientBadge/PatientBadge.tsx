import React from "react";
import { Card, Image } from "semantic-ui-react";
import { differenceInYears } from "date-fns";

interface IPatientBadgeProps {
  patient: any;
}

const PatientBadge: React.FC<IPatientBadgeProps> = ({ patient }) => {
  if (!patient || !Object.keys(patient).length) {
    return null;
  }
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
            <Card.Description key={i.key}>
              <b>{i.key}</b> : {i.value}
            </Card.Description>
          ))}
          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <b>Contacts</b>
          </p>

          {patient?.telecom.map((i: any) => (
            <Card.Description key={i.value}>
              <b>{i.system}</b> : {i.value}
            </Card.Description>
          ))}
        </Card.Content>
      </Card>
    </>
  );
};

export default PatientBadge;
