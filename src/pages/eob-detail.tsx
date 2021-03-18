import React, { FC, useState } from "react";
import { useStoreMap } from "effector-react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Accordion,
  Breadcrumb,
  Container,
  Divider,
  Icon,
} from "semantic-ui-react";
import { $eob } from "../stores/patient";
import classes from "./eob-detaill.module.css";

const Total = ({ total }: { total: Array<any> }) => {
  return (
    <div>
      <span className={classes.key}>Total:</span>
      {total?.map((t: any, index: number) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={classes.subgroup} key={index}>
            <span className={classes.key}>
              {" "}
              {t?.category?.coding[0]?.display || "N/A"} -{" "}
            </span>
            <span>
              {t?.amount?.value} {t?.amount?.currency}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Items = ({ items }: { items: Array<any> }) => {
  return (
    <div>
      <span className={classes.key}>Total:</span>
      {items?.map((t: any) => {
        return (
          <div className={classes.subgroup} key={t.sequence}>
            <span className={classes.key}>
              {t?.productOrService?.coding?.[0]?.display || "N/A"} -{" "}
            </span>
            {t?.adjudication.map((a: any, index: number) => {
              return (
                <div className={classes.subgroup} key={index}>
                  <span className={classes.key}>
                    {a?.category?.coding?.[0]?.code || "N/A"} -{" "}
                  </span>
                  <span>
                    {a?.amount?.value} {a?.amount?.currency}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Infos = ({ infos }: { infos: Array<any> }) => {
  return (
    <div>
      <span className={classes.key}>Supporting Information:</span>
      {infos?.map((t: any) => (
        <div className={classes.subgroup} key={t.sequence}>
          <span className={classes.key}>
            {t?.category?.coding?.[0]?.code || "N/A"} -{" "}
          </span>
          <span>
            {["refillnum", "dayssupply"].includes(
              t?.category?.coding?.[0]?.code
            ) && t.valueQuantity?.value}
            {[
              "dawcode",
              "billingnetworkcontractingstatus",
              "brandgenericcode",
              "rxorigincode",
              "compoundcode",
            ].includes(t?.category?.coding?.[0]?.code) &&
              t?.code?.coding?.[0]?.code}
            {t?.category?.coding?.[0]?.code === "clmrecvddate" && t?.timingDate}
          </span>
        </div>
      ))}
    </div>
  );
};

const renderKeys = (key: string, eob: any) => {
  switch (key) {
    case "total":
      return (
        <>
          <Total total={eob[key]} />
          <Divider />
        </>
      );
    case "item":
      return (
        <>
          <Items items={eob[key]} />
          <Divider />
        </>
      );
    case "supportingInfo":
      return (
        <>
          <Infos infos={eob[key]} />
          <Divider />
        </>
      );
    case "type":
      return (
        <>
          <div key={key} className={classes.group}>
            <span className={classes.key}>{key}: </span>
            <span>{eob[key]?.text || "Unspecified"}</span>
          </div>
          <Divider />
        </>
      );
    case "provider":
    case "insurer":
      return (
        <>
          <div key={key} className={classes.group}>
            <span className={classes.key}>{key}: </span>
            <span>{eob[key]?.display || "Unspecified"}</span>
          </div>
          <Divider />
        </>
      );
    case "created":
      return (
        <>
          <div key={key} className={classes.group}>
            <span className={classes.key}>{key}: </span>
            <span>{format(new Date(eob[key]), "yyyy-MM-dd")}</span>
          </div>
          <Divider />
        </>
      );
    case "identifier":
      return (
        <>
          <div className={classes.group}>
            <span className={classes.key}>Identifiers:</span>
            {eob[key].map((item: any, index: number) => (
              <div key={index} className={classes.subgroup}>
                <span className={classes.key}>
                  {item?.type?.coding?.[0]?.code} -
                </span>
                <span> {item?.value}</span>
              </div>
            ))}
          </div>
          <Divider />
        </>
      );
    case "billablePeriod":
      return (
        <>
          <div className={classes.group}>
            <span className={classes.key}>Billable Period:</span>
            <div className={classes.subgroup}>
              <span className={classes.key}>Start - </span>
              <span>{eob[key].start}</span>
            </div>
            <div className={classes.subgroup}>
              <span className={classes.key}>End - </span>
              <span>{eob[key].end}</span>
            </div>
          </div>
          <Divider />
        </>
      );
    case "insurance":
    case "use":
    case "patient":
    case "text":
    case "id":
    case "resourceType":
    case "meta":
      return null;
    case "prescription":
      return (
        <>
          <div className={classes.group}>
            <span className={classes.key}>Prescription: </span>
            <span>{eob[key]?.reference || ""}</span>
          </div>
          <Divider />
        </>
      );
    case "careTeam":
      return (
        <>
          <div className={classes.group}>
            {eob[key]?.map((item: any, index: number) => (
              <div key={index}>
                <span className={classes.key}>
                  {item.role?.coding[0]?.display}:{" "}
                </span>
                <span>{item?.provider?.reference || ""}</span>
              </div>
            )) || "N/A"}
          </div>
          <Divider />
        </>
      );
    default:
      return (
        <>
          <div key={key} className={classes.group}>
            <span className={classes.key}>{key}: </span>
            <span>
              {typeof eob[key] !== "string"
                ? JSON.stringify(eob[key])
                : eob[key]}
            </span>
          </div>
          <Divider />
        </>
      );
  }
};

const EobDetail: FC = () => {
  const params = useParams();
  const eob = useStoreMap({
    store: $eob,
    keys: [params.id],
    fn: (items, [itemId]) =>
      items.data.find(({ id }: { id: string }) => id === itemId),
  });
  const [current, setCurrent] = useState<number>(-1);

  const handleClick = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const newIndex = current === index ? -1 : index;

    setCurrent(newIndex);
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Section link as={Link} to="/">
          Home
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{eob.id}</Breadcrumb.Section>
      </Breadcrumb>
      <Divider />
      <Accordion>
        <Accordion.Title active={current === 0} index={0} onClick={handleClick}>
          <Icon name="dropdown" />
          <b>Show full resource</b>
        </Accordion.Title>
        <Accordion.Content active={current === 0}>
          <pre>{JSON.stringify(eob, null, 2)}</pre>
        </Accordion.Content>
      </Accordion>
      <Divider />
      {Object.keys(eob).map((key: string) => {
        return <div key={key}>{renderKeys(key, eob)}</div>;
      })}
    </Container>
  );
};

export default EobDetail;
