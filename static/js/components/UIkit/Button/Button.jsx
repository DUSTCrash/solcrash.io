import React from "react";
import cn from "classnames";

import "./button.scss";

const Button = (props) => {
  const { className: pClassName, style, children, disabled, ...rest } = props;
  const className = cn("solcrash-primary-button", { [pClassName]: !!pClassName });
  return ( <button className={className} disabled={disabled} style={style} {...rest}>{children}</button> );
};

export default Button;
