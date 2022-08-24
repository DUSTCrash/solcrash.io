import React from "react";
import { useDispatch } from "react-redux";

import Button from "../../../../components/UIkit/Button/Button";

import { connectWallet } from "../../../../utils/services/wallet";

import "./notConnected.scss";

const NotConnected = () => {

  const dispatch = useDispatch();

  return (
    <div className="not-connected">
      <Button onClick={() => connectWallet(dispatch)}>Connect to Play!</Button>
      <p>
        There is no way for solcrash.io to store or steal information from the connection of your wallet, it is only
        used to keep track of playing data and giving you the ability to withdraw and deposit
      </p>
    </div>
  );

};

export default NotConnected;
