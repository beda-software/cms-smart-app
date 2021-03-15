import React from "react";
import clsx from "clsx";
import classes from "./index.module.css";

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
  className?: any;
}

const Input: React.FC<IInputProps> = (props) => {
  const { type, ...rest } = props;
  return (
    <input type={type || "text"} className={clsx(classes.common)} {...rest} />
  );
};

export default Input;
