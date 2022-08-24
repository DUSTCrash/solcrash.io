import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../../components/UI/Spinner/Spinner";

import getSocket from "../../socket";
import { setStatistics } from "../../store/reducers/global_info/global_info";

import "./statistics.scss";

const Statistics = () => {

  const dispatch = useDispatch();
  const { statistics_loading, error, statistics } = useSelector(state => state.global_info);

  useEffect(() => {
      
    const socket = getSocket();
    
    socket.on("statistics", (statistics) => {
      dispatch(setStatistics(statistics));
    });
    
  }, []);

  if (statistics_loading || !statistics)
    return (
      <div className="solcrash-page-container">
        <section className="stats-loader" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner />
        </section>
      </div>
    );

  if (error)
    return (
        <div className="solcrash-page-container">
        <br />
        <h1 className="solcrash-screen-title" style={{ color: "red" }}>Couldn't get statistics</h1>
      </div>
    );

  return (

    <div className="solcrash-page-container">

      <br />
      <h1 className="solcrash-screen-title">Statistics</h1>

      <div className="stats">

        <div className="stat">
            <div className="stat-content">
                <div className="icon">
                    <div className="hexagon-bg"></div>
                    <i className="fas fa-users" aria-hidden="true"></i>
                </div>
                <h5 className="stats-title">Total Users</h5>
                <p id="users">{statistics?.users?.toLocaleString("en-US") || "?"}</p>
            </div>
        </div>

        <div className="stat">
            <div className="stat-content">
                <div className="icon">
                    <div className="hexagon-bg"></div>
                    <i className="fas fa-coins" aria-hidden="true"></i>
                </div>
                <h5 className="stats-title">Bets Placed</h5>
                <p id="bets">{statistics?.bets?.toLocaleString("en-US") || "?"}</p>
            </div>
        </div>        

        <div className="stat">
            <div className="stat-content">
                <div className="icon">
                    <div className="hexagon-bg"></div>
                    <i className="fas fa-wallet" aria-hidden="true"></i>
                </div>
                <h5 className="stats-title">House Wallet</h5>
                <p id="house">{statistics?.house?.toLocaleString("en-US") || "?"} SOL</p>
            </div>
        </div>

        <div className="stat">
            <div className="stat-content">
                <div className="icon">
                    <div className="hexagon-bg"></div>
                    <i className="fas fa-dollar-sign" aria-hidden="true"></i>
                </div>
                <h5 className="stats-title">Amount Wagered</h5>
                <p id="wagered">{statistics?.wagered?.toLocaleString("en-US") || "?"} SOL</p>
            </div>
        </div>

        <div className="stat">
            <div className="stat-content">
                <div className="icon">
                    <div className="hexagon-bg"></div>
                    <i className="fas fa-trophy" aria-hidden="true"></i>
                </div>
                <h5 className="stats-title">Won by Players</h5>
                <p id="won">{statistics?.won?.toLocaleString("en-US") || "?"} SOL</p>
            </div>
        </div>

      </div>
    
    </div>

  );

};

export default Statistics;