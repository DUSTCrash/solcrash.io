import React from "react";

import "./globalLoader.scss";

const GlobalLoader = () => {
  return (
    <div className="global-loader-screen">
      <div className="lds-dual-ring" />
    </div>
  );
};

export default GlobalLoader;