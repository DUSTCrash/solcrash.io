import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import cn from "classnames";
import $ from "jquery";

import Button from "../../../components/UIkit/Button/Button";
import AccountModal from "../../../components/UI/Modals/Account/Account";
import PicturesModal from "../../../components/UI/Modals/Pictures/Pictures";

import {
  connectWallet,
  logout,
  viewAccount,
} from "../../../utils/services/wallet";
import { formatNum } from "../../../utils/helper/formatNum";

import exitIcon from "../../../assets/icons/exit.svg";

import "../../../config.js";

import "./header.scss";
import { setCurrency } from "../../../store/reducers/global_info/global_info";

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, discordId, name, screen_width } = useSelector(
    (state) => state.global_info
  );
  var { sol, usdc, dust, forge, puff, jelly } = global.config.balance;

  var isConnected = !!token;
  var discordConnected = !!discordId;
  var desktopVersion = screen_width > 1350;
  var laptopVersion = screen_width > 750;

  var totalBalance = sol + usdc + dust + forge + puff + jelly;

  var formattedSolBalance = sol !== null ? formatNum(sol) : "";
  if (sol !== 0 && formattedSolBalance === 0) formattedSolBalance = "~ 0";

  var formattedUsdcBalance = usdc !== null ? formatNum(usdc) : "";
  if (usdc !== 0 && formattedUsdcBalance === 0) formattedUsdcBalance = "~ 0";

  var formattedDustBalance = dust !== null ? formatNum(dust) : "";
  if (dust !== 0 && formattedDustBalance === 0) formattedDustBalance = "~ 0";

  var formattedForgeBalance = forge !== null ? formatNum(forge) : "";
  if (forge !== 0 && formattedForgeBalance === 0) formattedForgeBalance = "~ 0";

  var formattedPuffBalance = puff !== null ? formatNum(puff) : "";
  if (puff !== 0 && formattedPuffBalance === 0) formattedPuffBalance = "~ 0";

  var formattedJellyBalance = jelly !== null ? formatNum(jelly) : "";
  if (jelly !== 0 && formattedJellyBalance === 0) formattedJellyBalance = "~ 0";

  function changeCurrency(element) {
    var div = element.querySelector("div");
    var currency = div.classList[1];
    document.querySelector(".default_option").querySelector("div").outerHTML = div.outerHTML;
    document.querySelector(".default_option").querySelector("p").id = currency + "-current-bal-active";
    document.querySelector(".select_wrap").classList.toggle("active");
    dispatch(setCurrency(currency));
  }

  return (
    <header className="solcrash-header">
      <AccountModal />
      <PicturesModal />
      {laptopVersion && (
      <section className="logo">
        <span className="primary" onClick={() => navigate("/")}>
          solcrash.
        </span>
        <span className="secondary" onClick={() => navigate("/")}>
          io
        </span>
        {desktopVersion && (
          <div className="routes">
            <Link
              to={"/play"}
              className={cn("route", {
                active: location.pathname === "/play",
                not_active: location.pathname !== "/play",
              })}
            >
              <span>Play</span>
            </Link>
            <Link
              to={"/leaderboards"}
              className={cn("route", {
                active: location.pathname === "/leaderboards",
                not_active: location.pathname !== "/leaderboards",
              })}
            >
              <span>Leaderboards</span>
            </Link>
            <Link
              to={"/statistics"}
              className={cn("route", {
                active: location.pathname === "/statistics",
                not_active: location.pathname !== "/statistics",
              })}
            >
              <span>Statistics</span>
            </Link>
            <Link
              to={"/faq"}
              className={cn("route", {
                active: location.pathname === "/faq",
                not_active: location.pathname !== "/faq",
              })}
            >
              <span>FAQ</span>
            </Link>
          </div>
        )}
      </section>
      )}
      <section className="header-settings">
        {!isConnected && (
          <Button
            onClick={() => connectWallet(dispatch)}
            style={{ margin: "4px 0" }}
          >
            {" "}
            Connect
          </Button>
        )}
        {isConnected && (
          <>
            {!discordConnected && laptopVersion && (
              <>
                <a className="connect-discord-button" href={"https://discord.com/api/oauth2/authorize?client_id=1002803869891448903&state=" + token + "&redirect_uri=" + encodeURIComponent("https://solcrash.io/discord") + "&response_type=code&scope=identify"}>Connect Discord</a>
              </>
            )}
            <audio id="depositAudio" src="./sounds/deposit.mp3" />
            <audio id="withdrawAudio" src="./sounds/withdraw.mp3" />
            {totalBalance === 0 && desktopVersion && (
              <>
                <span className="deposit-notification">
                  Click to deposit &rarr;
                </span>
              </>
            )}
            <span className="name" onClick={() => dispatch(viewAccount())}>
              <i className="fas fa-user" style={{marginRight: laptopVersion ? "5px": "0px"}}></i> {laptopVersion ? " " + name : ""}
            </span>
            <div className="select_wrap">
              <ul
                className="default_option"
                onClick={(e) =>
                  document
                    .querySelector(".select_wrap")
                    ?.classList.toggle("active")
                }
              >
                <li>
                  <div className="option sol">
                    <img src="https://i.imgur.com/LnkpZvw.png" />
                    <p id="sol-current-bal-active" className="sol">{formattedSolBalance}</p>
                  </div>
                </li>
              </ul>
              <ul className="select_ul">
                <li className="dropdown-sol" onClick={() => changeCurrency(document.querySelector(".dropdown-sol"))}>
                  <div className="option sol">
                    <img src="https://i.imgur.com/LnkpZvw.png" />
                    <p className="sol">{formattedSolBalance}</p>
                  </div>
                </li>
                <li className="dropdown-usdc" onClick={() => changeCurrency(document.querySelector(".dropdown-usdc"))}>
                  <div className="option usdc">
                    <img src="https://i.imgur.com/NDeT6kr.png" />
                    <p className="usdc">{formattedUsdcBalance}</p>
                  </div>
                </li>
                <li className="dropdown-dust" onClick={() => changeCurrency(document.querySelector(".dropdown-dust"))}>
                  <div className="option dust">
                    <img src="https://i.imgur.com/rKepYVZ.png" />
                    <p className="dust">{formattedDustBalance}</p>
                  </div>
                </li>
                <li className="dropdown-forge" onClick={() => changeCurrency(document.querySelector(".dropdown-forge"))}>
                  <div className="option forge">
                    <img src="https://i.imgur.com/UqT0mmf.png" />
                    <p className="forge">{formattedForgeBalance}</p>
                  </div>
                </li>
                <li className="dropdown-puff" onClick={() => changeCurrency(document.querySelector(".dropdown-puff"))}>
                  <div className="option puff">
                    <img src="https://i.imgur.com/aftEdgN.jpg" />
                    <p className="puff">{formattedPuffBalance}</p>
                  </div>
                </li>
                <li className="dropdown-jelly" onClick={() => changeCurrency(document.querySelector(".dropdown-jelly"))}>
                  <div className="option jelly">
                    <img src="https://i.imgur.com/wHdaWHS.png" />
                    <p className="jelly">{formattedJellyBalance}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div
              className="icon-button exit"
              onClick={() => dispatch(logout())}
            >
              <img src={exitIcon} alt="exit" />
            </div>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
