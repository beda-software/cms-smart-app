import React from "react";
import TextInput from "../../components/Input";
import classes from "./auth.module.css";

const SignIn: React.FC = () => {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <form onSubmit={submit} className={classes.form}>
      <TextInput />
      <TextInput />
      <button type="submit">Sign in</button>
    </form>
  );
};

export default SignIn;
