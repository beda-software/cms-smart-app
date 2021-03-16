import React from "react";
import { Button, Menu, Image } from "semantic-ui-react";
import classes from "./index.module.css";
import { getReadableNameFromUser } from "../../lib/fhirHelpers";
import { resetAuth, smartLaunchFx } from "../../stores/auth";
import logo from "../../hslogo.png";

const Header = (props: any) => {
  const { user } = props;
  const link = user?.link.find((l: any) => l.link.resourceType === "Patient");

  return (
    <header className={classes.root}>
      <Menu secondary>
        <Menu.Menu position="left">
          <Menu.Item>
            <img src={logo} alt="" />
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <span>{getReadableNameFromUser(user.name)}</span>
          </Menu.Item>
          <Menu.Item>
            <Button
              basic
              color="black"
              content="Logout"
              onClick={() => {
                sessionStorage.clear();
                resetAuth();
              }}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </header>
  );
};

export default Header;
