import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cn from "classnames";

import getSocket from "../../../socket";

import { toast } from "../../../utils/toast/toast";

import { sleep } from "../../../utils/helper/sleep";
import { formatNum } from "../../../utils/helper/formatNum";

import "../../../config";

import "./chatHistory.scss";

const ChatHistory = () => {

  const socket = getSocket();
  const { token, name, screen_width } = useSelector(state => state.global_info);
  const { history } = global.config;

  const mobileMode = screen_width < 780;

  var isConnected = !!token;

  const [mode, setMode] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [chatGlobalMessages, setChatGlobalMessages] = useState([]);

  const sendMessage = () => {
    if (chatMessage.trim() === "" || !isConnected || !name || name.length > 30) return;
    socket.emit("chat:send", { token, text: chatMessage.trim() });
    setChatMessage("");
  };

  const onChangeChatMessageHandler = (event) => {
    const regex1 = /^.{1,150}$/;
    const regex2 = /^$/;
    const value = event.target.value;
    if (!regex1.test(value) && !regex2.test(value)) return;
    setChatMessage(event.target.value);
  };

  useEffect(() => {

    async function delayScroll() {
      await sleep(50);
      scrollToBottom(chatContainer);
    }

    var socket = getSocket();
    var chatContainer = document.querySelector(".chat-container");

    socket.on("chat:log", async log => {
      sessionStorage.setItem("chatLog", JSON.stringify(log));
      setChatGlobalMessages(log);
      await sleep(50);
      var scroll = shouldScroll(chatContainer);
      if (scroll) scrollToBottom(chatContainer);
    });

    socket.on("chat:send", (message) => {

      var chatLog = sessionStorage.getItem("chatLog") || [];
      try { chatLog = JSON.parse(chatLog); }
      catch { chatLog = []; }
      chatLog.push(message);
      chatLog = chatLog.filter((value, i, self) => i === self.findIndex(element => element.id === value.id));
      if (chatLog.length > 50) chatLog.shift();
      sessionStorage.setItem("chatLog", JSON.stringify(chatLog));

      setChatGlobalMessages(chatLog);
      
      var scroll = shouldScroll(chatContainer);
      if (scroll) scrollToBottom(chatContainer);

    });

    var messages = document.querySelectorAll(".message");
    var log = sessionStorage.getItem("chatLog") || [];
    try { log = JSON.parse(log); }
    catch { log = []; }
    setChatGlobalMessages(log);
    if (messages.length === 0) delayScroll();

    socket.on("chat:error", error => toast.errorMessage(error));

  }, []);

  const shouldScroll = (element) => {
    if (element) return element.scrollTop >= element.scrollHeight - element.offsetHeight - 50;
  };

  const scrollToBottom = (element) => {
    if (element) element.scrollTop = element.scrollHeight;
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    toast.successMessage("Copied game hash");
  }

  useEffect(() => {
    if (screen_width <= 780) setMode("chat");
  }, [screen_width]);

  useEffect(() => {
    setChatMessage("");
  }, [isConnected]);

  var chatPlaceholder = "Type here to send a message...";
  if (!isConnected) chatPlaceholder = "Connect your wallet to send a message";
  else if (!name) chatPlaceholder = "Set a username by clicking 'Profile' in the top right";

  return (
    <section className="crash-chat-history">
      {screen_width > 780 && (
        <div className="mode-selector">
          <div className={cn("mode-selector__item", { active: mode === "history" })} onClick={() => setMode("history")}>
            <span style={{ marginLeft: "-21px" }}>HISTORY</span>
          </div>
          <div className={cn("mode-selector__item", { active: mode === "chat" })} onClick={() => setMode("chat")}>
            <span style={{ marginLeft: "-7px" }}>CHAT</span>
          </div>
        </div>
      )}
      <div className="content">
        {mode === "history" && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Bet</th>
                  <th>Multiplier</th>
                  <th>Crash</th>                  
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {history && history.length !== 0 && history.map(game => (
                    <tr key={game._id}>
                      <th><i className="fas fa-copy" onClick={() => copyHash(game.gameHash)}></i> {game.gameHash.slice(0, 5)}...</th>
                      <th>{formatNum(game.betAmount) !== 0 ? formatNum(game.betAmount) : "~ 0"} {game.currency?.toUpperCase()}</th>
                      <th>{game.retrievedMultiplier ? game.retrievedMultiplier.toFixed(2) + "x" : "-"}</th>
                      <th style={{ color: game.crashPoint >= 50 ? "#f3df27" : game.crashPoint >= 2 ? "#5eff6e" : "#fa5353" }}>{game.crashPoint.toFixed(2)}x</th>
                      <th style={{ color: +game.profit < 0 ? "#fa5353" : "#5eff6e" }}>{Number(game.profit.toFixed(4)) !== 0 ? Number(game.profit.toFixed(4)) : "~ 0"}  {game.currency?.toUpperCase()}</th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {mode === "chat" && (
          <>
            <div className="chat-container">
              {chatGlobalMessages && chatGlobalMessages.length > 0 && chatGlobalMessages.map(message => (
                  <div className="message" key={message.id}>
                    <img className="chat-pfp" src={message.pfp} alt="pfp" />
                    <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
                    <span className="message-username"><span style={{ fontSize: "12px", color: message.color }}>{message.username}</span>:</span>
                    <span className="message-content">{message.text}</span>
                  </div>
                ))}
            </div>
            <div className="send-message" onClick={mobileMode ? sendMessage : null}>
              <input
                type="text"
                placeholder={chatPlaceholder}
                value={chatMessage}
                disabled={!isConnected || !name}
                onChange={onChangeChatMessageHandler}
                onKeyDown={(event) => event.key === "Enter" ? sendMessage() : null}
              />
              <a href="https://discord.gg/XyjHY48fKa" target="_blank" rel="noreferrer"><i className="fab fa-discord"></i></a>
              <a href="https://twitter.com/solcrash" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
            </div>
          </>
        )}
      </div>
    </section>
  );
  
};

export default ChatHistory;
