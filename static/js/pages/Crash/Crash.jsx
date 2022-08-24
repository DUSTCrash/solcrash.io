import React, { useRef } from "react";
import { useSelector } from "react-redux";

import History from "./History/History";
import ChatHistory from "./ChatHistory/ChatHistory";
import Controllers from "./Controllers/Controllers";
import CrashGame from "./Crash/Crash";

import { cashoutAudio } from "../../utils/constants/constants";

import "../../config";

import "./crash.scss";

const Crash = () => {

  const { screen_width } = useSelector(state => state.global_info);

  var tabletVersion = screen_width <= 1024;
  var cashoutAudioRef = useRef(cashoutAudio);

  return (
    <section className="crash-page-container">
      <section className="crash-page-container__left">
        <section className="crash-page-container__left__top">
          <CrashGame />
          <Controllers />
        </section>
        <ChatHistory cashoutAudioRef={cashoutAudioRef} />
      </section>
      {!tabletVersion && (
      <section className="crash-page-container__right">
        <History />
      </section>
      )}
    </section>
  );
  
};

export default Crash;
