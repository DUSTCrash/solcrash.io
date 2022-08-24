import React from "react";

import Header from "../Header/Header";

const MainLayout = (props) => {

  const { children } = props;

  return (
    <>
      <Header />
      {children}
    </>
  );
  
};

export default MainLayout;
