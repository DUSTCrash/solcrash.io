import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../../components/UI/Spinner/Spinner";

import getSocket from "../../socket";
import { setLeaderboards } from "../../store/reducers/global_info/global_info";

import "./leaderboards.scss";

const Leaderboard = () => {

    const dispatch = useDispatch();
    const { leaderboards_loading, error, leaderboards } = useSelector(state => state.global_info);

    useEffect(() => {
      
      const socket = getSocket();
      
      socket.on("leaderboards", (leaderboards) => {
        dispatch(setLeaderboards(leaderboards));
      });
      
    }, []);

    if (leaderboards_loading || !leaderboards)
      return (
        <div className="solcrash-page-container">
          <section className="leaderboards-loader" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner />
          </section>
        </div>
      );

    if (error)
      return (
        <div className="solcrash-page-container">
        <br />
        <h1 className="solcrash-screen-title" style={{ color: "red" }}>Couldn't get leaderboards</h1>
      </div>
    );

    return (
      
      <div className="solcrash-page-container">

        <br />
        <h1 className="solcrash-screen-title">Profit Leaderboard</h1>

        <div className="leaderboards">
            <table>
              <thead>
                <tr>
                  <th className="pfp-column">DAO</th>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Bets</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {leaderboards.profit && leaderboards.profit.map((user, i) => {
                  return (
                    <tr key={Math.random()}>
                      <th><img className="leaderboard-pfp" src={user.pfp}></img></th>
                      <th>#{i + 1}</th>
                      <th>{user.username}</th>
                      <th>{user.bets}</th>
                      <th style={{ color: user.profit >= 0 ? "#18aa6d" : "#fa5353" }}>{user.profit} SOL</th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
    
      </div>

  );

};

export default Leaderboard;
