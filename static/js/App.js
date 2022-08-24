import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ToastProvider from "./components/layouts/ToastProvider/ToastProvider";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Crash from "./pages/Crash/Crash";
import Leaderboards from "./pages/Leaderboards/Leaderboards";
import Statistics from "./pages/Statistics/Statistics";
import Faq from "./pages/Faq/Faq.jsx";
import GlobalLoader from "./components/UI/GlobalLoader/GlobalLoader";

import { login } from "./utils/services/wallet";

import { setScreenWidth } from "./store/reducers/global_info/global_info";

import { depositAudio, withdrawAudio } from "./utils/constants/constants";

import "./config.js";

import "./index.scss";
import "./global.scss";
import "./fonts.scss";

const App = () => {

  const dispatch = useDispatch();
  const { global_loading } = useSelector(state => state.global_info);

  const Layout = MainLayout;

  useEffect(() => {

    var token = localStorage.getItem("token");
    if (token) setTimeout(() => dispatch(login(token), 500));

    global.config.connection = new window.solanaWeb3.Connection("https://ssc-dao.genesysgo.net/", "confirmed");
    global.config.deposit_audio = depositAudio;
    global.config.withdraw_audio = withdrawAudio;

    const setScreenWidthHandler = () => dispatch(setScreenWidth(window.innerWidth));
    setScreenWidthHandler();
    window.addEventListener("resize", setScreenWidthHandler);
    return () => window.removeEventListener("resize", setScreenWidthHandler);

  }, []);

  return (
    <ToastProvider>
      {global_loading && <GlobalLoader />}
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/play" element={<Crash />} />
          <Route exact path="/leaderboards" element={<Leaderboards />} />
          <Route exact path="/statistics" element={<Statistics />} />
          <Route exact path="/faq" element={<Faq />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );

};

export default App;
