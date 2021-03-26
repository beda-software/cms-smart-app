import React, { useState } from "react";
import { Input, Button } from "../../components/ui";
import classes from "./auth.module.css";
import logo from "../../hslogo.png";
import { signInFx } from "../../stores/auth";

interface IForm {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<IForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInFx(form).catch(() => {
      setError(true);
    });
  };

  return (
    <>
      <header />
      <main
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form className={classes.form}>
          <img
            src={logo}
            alt="logo"
            width={200}
            style={{ marginBottom: "2rem", alignSelf: "center" }}
          />
          <Input
            value={form.username}
            name="username"
            placeholder="Email"
            onChange={handleChange}
            onFocus={() => {
              if (error) setError(false);
            }}
          />
          <Input
            value={form.password}
            name="password"
            onChange={handleChange}
            placeholder="Password"
            type="password"
            onFocus={() => {
              if (error) setError(false);
            }}
          />
          {error ? (
            <div
              style={{ margin: ".5rem 0", color: "red", fontWeight: "bold" }}
            >
              Wrong credentials!
            </div>
          ) : (
            <div
              style={{ margin: ".5rem 0", color: "red", fontWeight: "bold" }}
            />
          )}

          <Button title="Sign in" onClick={submit} />
        </form>
      </main>
      <footer />
    </>
  );
};

export default SignIn;
