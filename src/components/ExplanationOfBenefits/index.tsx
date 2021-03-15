import React from "react";
import { Icon, Accordion, Header, List, Segment } from "semantic-ui-react";
import classes from "./index.module.css";

const ExplanationOfBenefit: React.FC<{
  items: Array<any>;
}> = ({ items }) => {
  const [selectedEOB, setSelectedEOB] = React.useState<any | null>(null);
  return (
    <Segment>
      <Header as="h2">Explanations Of Benefit</Header>
      <List relaxed>
        {items.map((eob) => {
          const isSelected = eob === selectedEOB;
          return (
            <Accordion fluid key={eob.id}>
              <Accordion.Title
                active={isSelected}
                onClick={() => setSelectedEOB(isSelected ? null : eob)}
              >
                <Icon name="dropdown" />
                {eob.id}
              </Accordion.Title>
              <Accordion.Content active={isSelected}>
                <Header as="h3">Items</Header>
                <div>
                  {eob.item.map((item: any) => {
                    return (
                      <Segment key={item.sequence}>
                        <div className={classes.row}>
                          <div className={classes.label}>Sequence: </div>
                          <div>{item.sequence}</div>
                        </div>
                        <div className={classes.row}>
                          <div className={classes.label}>Serviced Date:</div>
                          <div>{item.servicedDate}</div>
                        </div>
                        <div className={classes.row}>
                          <div className={classes.label}>Net:</div>
                          <div>
                            {item.net.value} {item.net.currency}
                          </div>
                        </div>
                        {item.encounter && (
                          <div className={classes.row}>
                            <div className={classes.label}>Encounters:</div>
                            {item.encounter.map((encounter: any) => {
                              return (
                                <a
                                  key={encounter.reference}
                                  href={encounter.reference}
                                >
                                  {encounter.reference}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </Segment>
                    );
                  })}
                </div>

                <Header as="h3">Total</Header>
                <Segment>
                  {eob.total.map((total: any, index: number) => {
                    return (
                      <div
                        key={total.category.coding[0].code}
                        className={classes.row}
                      >
                        <div className={classes.label}>
                          {total.category.coding[0].code}:
                        </div>
                        <div>
                          {total.amount.value} {total.amount.currency}
                        </div>
                      </div>
                    );
                  })}
                </Segment>
              </Accordion.Content>
            </Accordion>
          );
        })}
      </List>
    </Segment>
  );
};

export default ExplanationOfBenefit;
