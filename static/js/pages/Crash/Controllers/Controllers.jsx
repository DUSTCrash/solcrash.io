import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cn from "classnames";

import Manual from "./Manual/Manual";
import Auto from "./Auto/Auto";
import NotConnected from "./NotConnected/NotConnected";

import "../../../config";

import "./controllers.scss";

const Controllers = () => {

  const { token, screen_width } = useSelector(state => state.global_info);

  var isConnected = !!token;
  const [mode, setMode] = useState("manual");

  const mobileMode = screen_width < 780;

  useEffect(() => {
    if (mobileMode) setMode("manual");
  }, [mobileMode]);

  return (
    <section className="crash-game-controllers">
      {!isConnected && <NotConnected />}
      {isConnected && (
        <>
          {!mobileMode && (
            <div className="mode-selector">
              <div className={cn("mode-selector__item", { active: mode === "manual" })} onClick={() => setMode("manual")}>
                <span>MANUAL</span>
              </div>
              <div className={cn("mode-selector__item", { active: mode === "auto" })} onClick={() => setMode("auto")}>
                <span>AUTO</span>
              </div>
            </div>
          )}
          {mode === "manual" && <Manual />}
          <Auto visible={mode === "auto"} />
        </>
      )}
    </section>
  );
  
};

export default Controllers;
