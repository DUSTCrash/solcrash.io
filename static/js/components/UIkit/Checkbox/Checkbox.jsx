import React from "react";
import cn from "classnames";

import checkmark from "../../../assets/icons/checkmark.svg";
import "./checkbox.scss";

const Checkbox = (props) => {
  const { className: pClassName, checked, style, ...rest } = props;
  const className = cn("solcrash-checkbox", { [pClassName]: !!pClassName, checked: !!checked, "not-checked": !checked });
  return (
    <div className={className} style={style} {...rest}>
      {checked && <img src={checkmark} alt="checked" />}
    </div>
  );
};

export default Checkbox;
