import React from "react";
import cn from "classnames";

import "./input.scss";

const Input = (props) => {
  const { className: pClassName, style, label, ...rest } = props;
  const className = cn("solcrash-input", { [pClassName]: !!pClassName });
  return (
    <div className={className} style={style}>
      <input type="text" {...rest} />
      {!!label && <span className="solcrash-input-label">{label}</span>}
    </div>
  );
};

export default Input;
