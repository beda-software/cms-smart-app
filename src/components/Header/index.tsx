import React from "react";
import { Button, Menu, Container } from "semantic-ui-react";
import classes from "./index.module.css";
import { getReadableNameFromUser } from "../../lib/fhirHelpers";
import { resetAuth } from "../../stores/auth";
import logo from "../../hslogo.png";

const Header = (props: any) => {
  const { user } = props;
  return (
    <Container className={classes.root}>
      <Menu secondary>
        <Menu.Menu position="left">
          <Menu.Item className={classes.logo}>
            <img src={logo} className={classes.image} alt="" />
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <span>
              <b>{getReadableNameFromUser(user.name)}</b>
            </span>
          </Menu.Item>
          <Menu.Item className={classes.no}>
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
    </Container>
  );
};

export default Header;
