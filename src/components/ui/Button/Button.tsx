import React from "react";
import clsx from "clsx";
import classes from "./Button.module.css";

interface IButtonProps {
  disabled?: boolean;
  title: string;
  onClick?: React.EventHandler<any>;
  type?: "outline" | "filled";
}

const Button: React.FC<IButtonProps> = (props) => {
  const { disabled, title, type, ...rest } = props;
  const styles = type ? clsx(classes.default, classes[type]) : classes.default;
  return (
    <button type="button" className={styles} disabled={disabled} {...rest}>
      {title}
    </button>
  );
};

export default Button;
