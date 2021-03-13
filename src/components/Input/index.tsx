import React from "react";
import classes from "./index.module.css";

interface IInputProps {
  type?: "text" | "email" | "number";
}

const Input: React.FC<IInputProps> = (props) => {
  const { type, ...rest } = props;
  return <input type={type || "text"} className={classes.common} />;
};

export default Input;
