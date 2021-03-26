import React, { useEffect } from "react";
import { fhirclient } from "fhirclient/lib/types";
import { useNavigate } from "react-router-dom";
import { Header, Table } from "semantic-ui-react";
import { useStore } from "effector-react";
import classes from "./index.module.css";
import { Button } from "../ui";
import { $eob, fetchEobFx } from "../../stores/patient";
import { $client } from "../../stores/auth";

const ExplanationOfBenefit: React.FC<{
  patientId: string;
}> = ({ patientId }) => {
  const client = useStore($client);
  const { loading, data: items } = useStore($eob);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) fetchEobFx({ client, patient: patientId });
  }, [client, loading, patientId]);

  return (
    <>
      <div className={classes.group}>
        <Header as="h2">Claims</Header>
        <Button
          title={loading ? "Loading..." : "Reload"}
          onClick={() => fetchEobFx({ client, patient: patientId })}
        />
      </div>

      <Table stackable selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Billable period</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Provider</Table.HeaderCell>
            <Table.HeaderCell>Insurer</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!items?.length && (
            <Table.Row>
              <Table.Cell singleLine textAlign="center">
                <b>You don&apos;t have records</b>
              </Table.Cell>
            </Table.Row>
          )}

          {items?.length > 0 &&
            items.map((item: fhirclient.FHIR.Resource) => (
              <Table.Row
                key={item.id}
                onClick={() => navigate(`/eob/${item.id}`)}
              >
                <Table.Cell>
                  <div>{item?.billablePeriod?.start}</div>
                  <div>{item?.billablePeriod?.end}</div>
                </Table.Cell>
                <Table.Cell>{item?.type?.text}</Table.Cell>
                <Table.Cell
                  className={classes["table-cell"]}
                  title={item?.provider?.display}
                >
                  {item?.provider?.display}
                </Table.Cell>
                <Table.Cell
                  className={classes["table-cell "]}
                  title={item?.insurer?.display}
                >
                  {item?.insurer?.display}
                </Table.Cell>

                <Table.Cell textAlign="right">{item?.outcome}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default ExplanationOfBenefit;
