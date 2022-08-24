import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../../../../components/UI/Spinner/Spinner";

import Tabs from "../../../Tab/Tabs";

import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";

import {
  setAccountModalOpened,
  setPicturesModalOpened,
  setPfpsLoading,
  setName
} from "../../../../store/reducers/global_info/global_info";

import { toast } from "../../../../utils/toast/toast";

import WalletApi from "../../../../utils/api/wallet";

import { controlDepositState, controlWithdrawState, controlRebateState } from "../../../../utils/helper/serverMessages";
import { formatNum } from "../../../../utils/helper/formatNum";

import "../../../../config.js";

import "../modals.scss";

const Account = () => {

  const dispatch = useDispatch();
  const { name, is_account_modal_opened, account_stats_loading, cashier_history_loading, currency, rebate_loading, screen_width } = useSelector((state) => state.global_info);
  const { userAddress, balance, pfpUri, pfpSrc, connection, gamesPlayed, totalWagered, depositHistory, withdrawalHistory, rebate } = global.config;

  var desktopVersion = screen_width > 1350;
  var laptopVersion = screen_width > 750;

  const [modalIsOpen, setIsOpen] = useState(is_account_modal_opened);
  const [usernameText, setUsernameText] = useState(name);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositCurrency, setDepositCurrency] = useState("sol");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("sol");
  const [rebateCurrency, setRebateCurrency] = useState(null);
  
  const [depositState, setDepositState] = useState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Deposit Funds",
  });

  const [depositErrorState, setDepositErrorState] = useState("");

  const [withdrawState, setWithdrawState] = useState({
    disable: true,
    style: {
      background: "#1a2733",
      borderColor: "none",
      cursor: "not-allowed",
    },
    value: "Withdraw Funds",
  });

  const [withdrawErrorState, setWithdrawErrorState] = useState("");

  const [rebateState, setRebateState] = useState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Select Currency",
  });

  function calculateTimeLeft(currency) {

    if (currency) {

      var lastClaimed = new Date(rebate[currency].time);
      var secLeft = 86400 - ((new Date() - lastClaimed) / 1000);
      if (secLeft <= 0) return null;
    
      var hours = Math.floor(secLeft / (60 * 60));
      var divisor_for_minutes = secLeft % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);
  
      var { amount } = rebate[currency];
      
      var decimals = 0;
      if (Math.floor(amount.valueOf()) === amount.valueOf()) decimals = 0;
      decimals = amount.toString().split(".")[1].length || 0; 

      if (decimals > 4) amount = "~" + formatNum(amount);
      setRebateState({ disable: true, style: { background: "#1a2733", border: "none", cursor: "not-allowed" }, value: hours + ":" + minutes + ":" + seconds });
      return { hours, minutes, seconds };

    }

  }

  useEffect(() => {
    setIsOpen(is_account_modal_opened);
    setUsernameText(name);
  }, [is_account_modal_opened]);

  useEffect(() => {

    const id = setTimeout(() => {
      if (rebateCurrency === "sol") calculateTimeLeft("sol");
      else if (rebateCurrency === "usdc") calculateTimeLeft("usdc");
      else if (rebateCurrency === "dust") calculateTimeLeft("dust");
    }, 1000);

    return () => clearTimeout(id);

  });

  const onChangeInput = (event) => {
    const username = event.target.value;
    if (username.length > 30) return;
    setUsernameText(username);
  };

  const closeModal = () => {
    setUsernameText(name);
    setDepositAmount("");
    setDepositCurrency("sol");
    setWithdrawAmount("");
    setWithdrawCurrency("sol");
    setRebateCurrency(null);
    setDepositState({ disable: true, style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" }, value: "Deposit Funds" });
    setDepositErrorState("");
    setWithdrawState({ disable: true, style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" }, value: "Withdraw Funds" });
    setWithdrawErrorState("");
    setRebateState({ disable: true, style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" }, value: "Select Currency" });
    setIsOpen(false);
    dispatch(setAccountModalOpened(false));
  };

  const openPfpModal = async () => {

    try {
      dispatch(setPfpsLoading(true));
      dispatch(setPicturesModalOpened(true));

      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: userAddress,
        connection,
        serialization: true,
      });

      var images = [
        { uri: "default-image", src: "https://i.imgur.com/7vMwz19.png" },
      ];

      for (var i = 0; i < nfts.length; i++) {
        try {
          var uri = nfts[i].data.uri;
          var data = await fetch(uri).then((res) => res.json());
          images.push({ uri, src: data.image });
        } catch {}
      }

      global.config.images = images;
      dispatch(setPfpsLoading(false));
    } catch (error) {
      global.config.images = [];
    }
  };

  const stopLoadingImage = (uri) => {
    var span = document.getElementById(uri + "-loader");
    if (span) span.innerHTML = "Change";
  };

  const editUsername = () => {
    var input = document.getElementById("username");
    var editIcon = document.getElementById("edit-username-icon");
    var saveIcon = document.getElementById("save-username-icon");
    input.disabled = false;
    input.style.cursor = "text";
    editIcon.style.display = "none";
    saveIcon.style.display = "inline-block";
  };

  const saveUsername = async () => {

    const username = usernameText;

    var input = document.getElementById("username");
    var editIcon = document.getElementById("edit-username-icon");
    var saveIcon = document.getElementById("save-username-icon");
    var loadIcon = document.getElementById("load-username-icon");
    input.disabled = true;
    input.style.cursor = "not-allowed";
    saveIcon.style.display = "none";
    loadIcon.style.display = "inline-block";

    try {
      await WalletApi.changeUsername(username);
      dispatch(setName(username));
      toast.successMessage("Changed username to " + username);
      input.value = "";
      input.placeholder = username;
    } catch (error) {
      toast.errorMessage(error.response.data);
      input.value = "";
      input.placeholder = name;
    }

    loadIcon.style.display = "none";
    editIcon.style.display = "inline-block";
    
  };

  const onChangeDepositInput = (event) => {

    const amount = event.target.value;

    if (parseFloat(amount) <= 0) {
      setDepositState({
        disable: true,
        style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
        value: "Deposit Funds",
      });
      return setDepositErrorState("*Must be greater than 0");
    }

    setDepositErrorState("");

    if (amount === "") return setDepositState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
      value: "Deposit Funds",
    });

    setDepositState({
      disable: false,
      style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
      value: "Deposit Funds",
    });

    setDepositAmount(amount);
    return;

  };

  const changeDepositCurrency = (newCurrency) => {
    if (newCurrency === "forge" || newCurrency === "puff" || newCurrency === "jelly") return;
    document.querySelector(".active-deposit-currency").classList.remove("active-deposit-currency");
    document.querySelector("." + newCurrency + "-deposit").classList.add("active-deposit-currency");
    setDepositCurrency(newCurrency);
    return;
  };

  const deposit = async () => {

    controlDepositState(setDepositState);

    const amount = parseFloat(depositAmount);
    setDepositState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none" },
      value: (<><i className="fas fa-spinner fa-spin"></i></>)
    });

    try { await WalletApi.deposit(amount, depositCurrency, connection); }
    catch (error) {

      toast.errorMessage(error.message);

      setDepositState({
        disable: false,
        style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
        value: "Deposit Funds",
      });
      
    }

    return;

  };

  const onChangeWithdrawInput = (event) => {

    const amount = event.target.value;

    if (parseFloat(amount) <= 0) {
      setWithdrawState({
        disable: true,
        style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
        value: "Withdraw Funds",
      });
      return setWithdrawErrorState("*Must be greater than 0");
    }

    if (parseFloat(amount) > balance[withdrawCurrency]) {
      setWithdrawState({
        disable: true,
        style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
        value: "Withdraw Funds",
      });
      return setWithdrawErrorState("*Insufficient funds");
    }

    setWithdrawErrorState("");

    if (amount === "") return setWithdrawState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
      value: "Withdraw Funds",
    });

    setWithdrawState({
      disable: false,
      style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
      value: "Withdraw Funds",
    });

    setWithdrawAmount(amount);
    return;

  };

  const changeWithdrawCurrency = (newCurrency) => {
    if (newCurrency === "forge" || newCurrency === "puff" || newCurrency === "jelly") return;
    document.querySelector(".active-withdraw-currency").classList.remove("active-withdraw-currency");
    document.querySelector("." + newCurrency + "-withdraw").classList.add("active-withdraw-currency");
    setWithdrawCurrency(newCurrency);
    return;
  };

  const maxWithdraw = () => {

    setWithdrawAmount(balance[currency]);
    document.getElementById("withdraw-amount").value = balance[currency];

    setWithdrawState({
      disable: false,
      style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
      value: "Withdraw Funds",
    });

  }

  const withdraw = async () => {

    controlWithdrawState(setWithdrawState);

    const amount = parseFloat(withdrawAmount);
    setWithdrawState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none" },
      value: (<><i className="fas fa-spinner fa-spin"></i></>)
    });

    try { await WalletApi.withdraw(amount, withdrawCurrency); }
    catch (error) {

      toast.errorMessage(error.message);

      setWithdrawState({
        disable: false,
        style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
        value: "Withdraw Funds",
      });
      
    }

    return;

  };

  const changeRebateCurrency = (newCurrency) => {
    if (newCurrency === "forge" || newCurrency === "puff" || newCurrency === "jelly") return;
    document.querySelector(".active-rebate-currency")?.classList.remove("active-rebate-currency");
    document.querySelector("." + newCurrency + "-rebate").classList.add("active-rebate-currency");
    setRebateCurrency(newCurrency);
    var { amount, time } = rebate[newCurrency];
    var secLeft = 86400 - ((new Date() - new Date(time)) / 1000);
    if (secLeft <= 0) {
      if (amount > 0) setRebateState({ disable: false, style: { background: "#18aa6d", border: "none", cursor: "pointer" }, value: "Claim " + rebate[newCurrency].amount  + " " + newCurrency.toUpperCase()});
      else setRebateState({ disable: true, style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" }, value: "No Earnings" });
    } else {
      var hours = Math.floor(secLeft / (60 * 60));
      var divisor_for_minutes = secLeft % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);
     
      var decimals = 0;
      if (Math.floor(amount.valueOf()) === amount.valueOf()) decimals = 0;
      decimals = amount.toString().split(".")[1].length || 0; 
      if (decimals > 4) amount = "~" + formatNum(amount);

      setRebateState({ disable: true, style: { background: "#1a2733", border: "none", cursor: "not-allowed" }, value: hours + ":" + minutes + ":" + seconds });

    }
    return;
  };

  const claimRebate = async () => {

    controlRebateState(setRebateState);

    setRebateState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none" },
      value: (<><i className="fas fa-spinner fa-spin"></i></>)
    });

    try { await WalletApi.claimRebate(rebateCurrency); }
    catch (error) {

      toast.errorMessage(error.message);

      setRebateState({
        disable: false,
        style: { background: "#1a2733", borderColor: "none", cursor: "pointer" },
        value: "Select Currency",
      });
      
    }

    return;

  };

  return (
    <Modal
      className={"modal"}
      overlayClassName={"modal-overlay"}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      <header className="modal__header">
        <h2 className="modal__title">Account</h2>
        <button
          className="modal__close"
          aria-label="Close"
          data-micromodal-close
          onClick={() => closeModal()}
        />
      </header>
      <Tabs>
        <div label="Profile">
          <main className="modal__content">
            <div className="pfp" onClick={() => openPfpModal()}>
              <label className="-label" htmlFor="file">
                <span id={pfpUri + "-loader"}>
                  <i className="fas fa-spinner fa-spin"></i>
                </span>
              </label>
              <img
                id="new-pfp"
                data-pfpuri={pfpUri}
                src={pfpSrc}
                width="100"
                onLoad={() => stopLoadingImage(pfpUri)}
              />
            </div>
            <div className="edit-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder={name}
                disabled
                onChange={(e) => onChangeInput(e)}
              />
              <i
                id="edit-username-icon"
                className="fas fa-pencil"
                onClick={() => editUsername()}
              ></i>
              <i
                id="save-username-icon"
                className="fas fa-save"
                onClick={() => saveUsername()}
              ></i>
              <i id="load-username-icon" className="fas fa-spinner fa-spin"></i>
            </div>
          </main>
        </div>
        <div label="Deposit">
          <main className="modal__content">
            <div className="field">
              <label htmlFor="deposit-amount">Deposit Amount <span className="error">{depositErrorState}</span></label>
              <input
                type="number"
                id="deposit-amount"
                placeholder="Enter the amount you would like to deposit (Ex. 20)"
                onChange={(e) => onChangeDepositInput(e)}
              />
              <div className="currency-container">
                <div className="cashier-currency sol-deposit active-deposit-currency" onClick={() => changeDepositCurrency("sol")}>
                  <img src="https://i.imgur.com/LnkpZvw.png" />
                  <span>Solana</span>
                </div>
                <div className="cashier-currency usdc-deposit" onClick={() => changeDepositCurrency("usdc")}>
                  <img src="https://i.imgur.com/NDeT6kr.png" />
                  <span>Usdc</span>
                </div>
                <div className="cashier-currency dust-deposit" onClick={() => changeDepositCurrency("dust")}>
                  <img src="https://i.imgur.com/rKepYVZ.png" />
                  <span>Dust</span>
                </div>
                <div className="cashier-currency forge-deposit disabled-currency" onClick={() => changeDepositCurrency("forge")}>
                  <img src="https://i.imgur.com/UqT0mmf.png" />
                  <span>Forge</span>
                </div>
                <div className="cashier-currency puff-deposit disabled-currency" onClick={() => changeDepositCurrency("puff")}>
                  <img src="https://i.imgur.com/aftEdgN.jpg" />
                  <span>Puff</span>
                </div>
              </div>
              <button
                className="modal__btn"
                style={depositState.style}
                onClick={deposit}
                disabled={depositState.disable}
              >
                {depositState.value}
              </button>
            </div>
          </main>
        </div>
        <div label="Withdraw">
          <main className="modal__content">
            <div className="field">
              <label htmlFor="withdraw-amount">Withdraw Amount <span className="error">{withdrawErrorState}</span></label>
              <input
                type="number"
                id="withdraw-amount"
                placeholder="Enter the amount you would like to withdraw (Ex. 20)"
                onChange={(e) => onChangeWithdrawInput(e)}
              />
              <i
                id="max-withdraw-icon"
                className="fas fa-sack-dollar"
                onClick={() => maxWithdraw()}
              ></i>
              <div className="currency-container">
                <div className="cashier-currency sol-withdraw active-withdraw-currency" onClick={() => changeWithdrawCurrency("sol")}>
                  <img src="https://i.imgur.com/LnkpZvw.png" />
                  <span>Solana</span>
                </div>
                <div className="cashier-currency usdc-withdraw" onClick={() => changeWithdrawCurrency("usdc")}>
                  <img src="https://i.imgur.com/NDeT6kr.png" />
                  <span>Usdc</span>
                </div>
                <div className="cashier-currency dust-withdraw" onClick={() => changeWithdrawCurrency("dust")}>
                  <img src="https://i.imgur.com/rKepYVZ.png" />
                  <span>Dust</span>
                </div>
                <div className="cashier-currency forge-withdraw disabled-currency" onClick={() => changeWithdrawCurrency("forge")}>
                  <img src="https://i.imgur.com/UqT0mmf.png" />
                  <span>Forge</span>
                </div>
                <div className="cashier-currency puff-withdraw disabled-currency" onClick={() => changeWithdrawCurrency("puff")}>
                  <img src="https://i.imgur.com/aftEdgN.jpg" />
                  <span>Puff</span>
                </div>
              </div>
              <button
                className="modal__btn"
                style={withdrawState.style}
                onClick={withdraw}
                disabled={withdrawState.disable}
              >
                {withdrawState.value}
              </button>
            </div>
          </main>
        </div>
        <div label="Stats">
          <main className="modal__content">
            {(() => {
              if (account_stats_loading) {
                return (
                  <div className="spinner-container">
                    <Spinner />
                  </div>
                )
              } else {
                return (
                  <div className="account-stats">
                    <span className="account-stat">Games Played: <span className="account-stat-value">{gamesPlayed}</span></span>
                    <span className="account-stat">Total SOL Wagered: <span className="account-stat-value">{totalWagered["sol"]}</span></span>
                    <span className="account-stat">Total USDC Wagered: <span className="account-stat-value">{totalWagered["usdc"]}</span></span>
                    <span className="account-stat">Total DUST Wagered: <span className="account-stat-value">{totalWagered["dust"]}</span></span>
                  </div>
                )
              }
            })()}
          </main>
        </div>
        <div label="History">
          {(() => {
              if (cashier_history_loading) {
                return (
                  <div className="spinner-container">
                    <Spinner />
                  </div>
                )
              } else {
                return (
                  <div className="cashier-history-container">
                    <h5>Deposits</h5>
                    {laptopVersion && (
                      <table className="cashier-history-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Transaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depositHistory && depositHistory.length !== 0 && depositHistory.map(deposit => {
                          return (
                            <tr key={deposit._id}>
                              <th>{new Date(deposit.createdAt).toLocaleString()}</th>
                              <th>{formatNum(deposit.amount)} {deposit.currency?.toUpperCase()}</th>
                              <th><a target="_blank" href={"https://solscan.io/tx/" + deposit.signature}>{deposit.signature.slice(0, 8)}</a>...</th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    )}
                    {!laptopVersion && (
                      <table className="cashier-history-table">
                      <thead>
                        <tr>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depositHistory && depositHistory.length !== 0 && depositHistory.map(deposit => {
                          return (
                            <tr key={deposit._id}>
                              <th><a target="_blank" href={"https://solscan.io/tx/" + deposit.signature}>{formatNum(deposit.amount)} {deposit.currency?.toUpperCase()}</a></th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    )}
                    <h5>Withdrawals</h5>
                    {laptopVersion && (
                      <table className="cashier-history-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Transaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawalHistory && withdrawalHistory.length !== 0 && withdrawalHistory.map(withdrawal => {
                          return (
                            <tr key={withdrawal._id}>
                              <th>{new Date(withdrawal.createdAt).toLocaleString()}</th>
                              <th>{formatNum(withdrawal.amount)} {withdrawal.currency?.toUpperCase()}</th>
                              <th><a target="_blank" href={"https://solscan.io/tx/" + withdrawal.signature}>{withdrawal.signature.slice(0, 8)}</a>...</th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    )}
                    {!laptopVersion && (
                      <table className="cashier-history-table">
                      <thead>
                        <tr>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawalHistory && withdrawalHistory.length !== 0 && withdrawalHistory.map(withdrawal => {
                          return (
                            <tr key={withdrawal._id}>
                              <th><a target="_blank" href={"https://solscan.io/tx/" + withdrawal.signature}>{formatNum(withdrawal.amount)} {withdrawal.currency?.toUpperCase()}</a></th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    )}
                  </div>
                )
              }
            })()}
        </div>
        <div label="Rewards">
          {(() => {
              if (rebate_loading) {
                return (
                  <div className="spinner-container">
                    <Spinner />
                  </div>
                )
              } else {
                return (
                <main className="modal__content">
                  <div className="field">
                    <h4>Daily Rebate</h4>
                    <div className="rebate-container">
                      <div className="rebate-currency sol-rebate" onClick={() => changeRebateCurrency("sol")}>
                        <img src="https://i.imgur.com/LnkpZvw.png" />
                        <span>SOL</span>
                      </div>
                      <div className="rebate-currency usdc-rebate" onClick={() => changeRebateCurrency("usdc")}>
                        <img src="https://i.imgur.com/NDeT6kr.png" />
                        <span>USDC</span>
                      </div>
                      <div className="rebate-currency dust-rebate" onClick={() => changeRebateCurrency("dust")}>
                        <img src="https://i.imgur.com/rKepYVZ.png" />
                        <span>DUST</span>
                      </div>
                      <div className="rebate-currency forge-rebate disabled-currency" onClick={() => changeRebateCurrency("forge")}>
                        <img src="https://i.imgur.com/UqT0mmf.png" />
                        <span>FORGE</span>
                      </div>
                      <div className="rebate-currency puff-rebate disabled-currency" onClick={() => changeRebateCurrency("puff")}>
                        <img src="https://i.imgur.com/aftEdgN.jpg" />
                        <span>PUFF</span>
                      </div>
                    </div>
                    <button
                      className="modal__btn"
                      style={rebateState.style}
                      onClick={claimRebate}
                      disabled={rebateState.disable}
                    >
                    {rebateState.value}
                    </button>
                  </div>
                </main>
                )
              }
            })()}
        </div>
      </Tabs>
    </Modal>
  );
};

export default Account;
