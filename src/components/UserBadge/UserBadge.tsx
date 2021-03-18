import React from "react";
import { Card, Image } from "semantic-ui-react";
import { getReadableNameFromUser } from "../../lib/fhirHelpers";
import {IUser} from "../../lib/types";

interface IPatientBadgeProps {
  user: IUser;
}

const UserBadge: React.FC<IPatientBadgeProps> = ({ user }) => {
  if (!user || !Object.keys(user).length) {
    return null;
  }
  return (
    <>
      <Card fluid>
        {user.photo ? (
          <Image src={user.photo} wrapped ui />
        ) : (
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
            wrapped
            ui
          />
        )}
        <Card.Content>
          <Card.Header>{getReadableNameFromUser(user.name, true)}</Card.Header>
          <Card.Meta>
            <span className="date">{user?.address?.[0]?.city}</span>
          </Card.Meta>
          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <b>Contacts</b>
          </p>
          {user.email && (
            <Card.Description>
              <b>Email</b> : {user.email}
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    </>
  );
};

export default UserBadge;
