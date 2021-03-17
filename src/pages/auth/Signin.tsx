import React, { useState } from "react";
import TextInput from "../../components/Input";
import classes from "./auth.module.css";
import Button from "../../components/Button";
import { signInFx } from "../../stores/auth";

interface IForm {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<IForm>({
    username: "funyloony@gmail.com",
    password: "12345",
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const isSubmitEnabled = Object.values(form).some((x: string) => {
    return x.trim() === "";
  });
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
          <TextInput
            value={form.username}
            name="username"
            onChange={handleChange}
            onFocus={() => {
              if (error) setError(false);
            }}
          />
          <TextInput
            value={form.password}
            name="password"
            onChange={handleChange}
            type="password"
            onFocus={() => {
              if (error) setError(false);
            }}
          />
          {error && (
            <div
              style={{ margin: ".5rem 0", color: "red", fontWeight: "bold" }}
            >
              Wrong credentials!
            </div>
          )}
          <Button title="Sign in" onClick={submit} disabled={isSubmitEnabled} />
        </form>
      </main>
      <footer />
    </>
  );
};

export default SignIn;
