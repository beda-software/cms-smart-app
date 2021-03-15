import React from "react";
import { Accordion, Header, List, Segment } from "semantic-ui-react";

const ExplanationOfBenefitVisualizer: React.FC<{
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
            <List.Item key={eob.id}>
              <Accordion styled fluid>
                <Accordion.Title
                  active={isSelected}
                  onClick={() => setSelectedEOB(isSelected ? null : eob)}
                >
                  {eob.id}
                </Accordion.Title>
                <Accordion.Content active={isSelected}>
                  <div>
                    <Header as="h4">Items</Header>
                    <List>
                      {eob.item.map((item: any) => {
                        return (
                          <List.Item key={item.id}>
                            <Segment>
                              <pre>{JSON.stringify(item, null, 2)}</pre>
                            </Segment>
                          </List.Item>
                        );
                      })}
                    </List>
                  </div>
                  <Header as="h4">Total</Header>
                  <Segment>
                    <pre>{JSON.stringify(eob.total, null, 2)}</pre>
                  </Segment>
                  {/*
                  <List>
                    {Object.keys(eob).map((key) => {
                      return (
                        <List.Item key={key}>
                          <List.Header>{key}</List.Header>
                          <List.Content>
                            <pre>{JSON.stringify(eob[key], null, 2)}</pre>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  </List>
                */}
                </Accordion.Content>
              </Accordion>
            </List.Item>
          );
        })}
      </List>
    </Segment>
  );
};

export default ExplanationOfBenefitVisualizer;
