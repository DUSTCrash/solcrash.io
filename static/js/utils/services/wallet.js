import Wallet from "../api/wallet";

import { toast } from "../../utils/toast/toast";

import getSocket from "../../socket";

import { setGlobalLoading, setToken, setDiscordId, setName, setAccountModalOpened, setAccountStatsLoading, setCashierHistoryLoading, setRebateLoading } from "../../store/reducers/global_info/global_info";

import { formatNum } from "../../utils/helper/formatNum";

import "../../config";

export const connectWallet = async dispatch => {

  const isPhantomInstalled = window.solana && window.solana.isPhantom;
  const isSolflareInstalled = window.solflare  && window.solflare.isSolflare;
  if (!isPhantomInstalled && !isSolflareInstalled) return toast.errorMessage("You need to have a Phantom or Solflare Wallet to connect");
  dispatch(setGlobalLoading(true));

  window.crashProvider = isPhantomInstalled ? window.solana : window.solflare;

  try {

    await window.crashProvider.connect();
    const publicKey = window.crashProvider.publicKey.toString();

    const nonceResult = await Wallet.nonce(publicKey);
    const nonce = nonceResult.data;

    const encodedMessage = new TextEncoder().encode("Authorize your wallet to play (" + nonce + ")");
    const signedMessage = await window.crashProvider.signMessage(encodedMessage, "utf8");

    dispatch(setGlobalLoading(false));

    const socket = getSocket();
    socket.emit("room:join", localStorage.getItem("token"));

    const connectResult = await Wallet.connect({ address: publicKey, signature: signedMessage.signature });
    const token = connectResult.data;

    const accountResult = await Wallet.getAccount(token);
    const { name, userAddress, discordId, balance, pfpUri, pfpSrc, history } = accountResult.data;
    dispatch(setName(name));
    dispatch(setDiscordId(discordId));
    global.config.userAddress = userAddress;
    global.config.balance = balance;
    global.config.pfpUri = pfpUri;
    global.config.pfpSrc = pfpSrc;
    global.config.history = history;

    socket.on("balance", data => {

      global.config.balance[data.currency] = data.newBalance;
      var balance = global.config.balance;

      var formattedSolBalance = formatNum(balance.sol);
      if (formattedSolBalance === 0) formattedSolBalance = "~ 0";

      var formattedUsdcBalance = formatNum(balance.usdc);
      if (formattedUsdcBalance === 0) formattedUsdcBalance = "~ 0";

      var formattedDustBalance = formatNum(balance.dust);
      if (formattedDustBalance === 0) formattedDustBalance = "~ 0";

      var formattedForgeBalance = formatNum(balance.forge);
      if (formattedForgeBalance === 0) formattedForgeBalance = "~ 0";

      var formattedPuffBalance = formatNum(balance.puff);
      if (formattedPuffBalance === 0) formattedPuffBalance = "~ 0";

      var formattedJellyBalance = formatNum(balance.jelly);
      if (formattedJellyBalance === 0) formattedJellyBalance = "~ 0";

      var solSpan = document.getElementById("sol-current-bal");
      var solSpanActive = document.getElementById("sol-current-bal-active");
      if (solSpan) solSpan.innerHTML = formattedSolBalance;
      if (solSpanActive) solSpanActive.innerHTML = formattedSolBalance;

      var usdcSpan = document.getElementById("usdc-current-bal");
      var usdcSpanActive = document.getElementById("usdc-current-bal-active");
      if (usdcSpan) usdcSpan.innerHTML = formattedUsdcBalance;
      if (usdcSpanActive) usdcSpanActive.innerHTML = formattedUsdcBalance;

      var dustSpan = document.getElementById("dust-current-bal");
      var dustSpanActive = document.getElementById("dust-current-bal-active");
      if (dustSpan) dustSpan.innerHTML = formattedDustBalance;
      if (dustSpanActive) dustSpanActive.innerHTML = formattedDustBalance;

      var forgeSpan = document.getElementById("forge-current-bal");
      var forgeSpanActive = document.getElementById("forge-current-bal-active");
      if (forgeSpan) forgeSpan.innerHTML = formattedForgeBalance;
      if (forgeSpanActive) forgeSpanActive.innerHTML = formattedForgeBalance;

      var puffSpan = document.getElementById("puff-current-bal");
      var puffSpanActive = document.getElementById("forge-current-bal-active");
      if (puffSpan) puffSpan.innerHTML = formattedPuffBalance;
      if (forgeSpanActive) puffSpanActive.innerHTML = formattedPuffBalance;

      var jellySpan = document.getElementById("jelly-current-bal");
      var jellySpanActive = document.getElementById("jelly-current-bal-active");
      if (jellySpan) jellySpan.innerHTML = formattedJellyBalance;
      if (jellySpanActive) jellySpanActive.innerHTML = formattedJellyBalance;

    });

    dispatch(setToken(token));

  } catch (error) {
    toast.errorMessage(error.response.data);
    logout();
  } finally { dispatch(setGlobalLoading(false)); }

};

export const login = (token) => {

  return async dispatch => {

    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    const isSolflareInstalled = window.solflare  && window.solflare.isSolflare;
    if (!isPhantomInstalled && !isSolflareInstalled) return toast.errorMessage("You need to have a Phantom or Solflare Wallet to connect");
    dispatch(setGlobalLoading(true));

    window.crashProvider = isPhantomInstalled ? window.solana : window.solflare;

    try {

      const accountResult = await Wallet.getAccount(token);
      dispatch(setToken(token));

      const socket = getSocket();
      socket.emit("room:join", localStorage.getItem("token"));

      const { name, discordId, userAddress, balance, pfpUri, pfpSrc, history } = accountResult.data;
      dispatch(setName(name));
      dispatch(setDiscordId(discordId));
      global.config.userAddress = userAddress;
      global.config.balance = balance;
      global.config.pfpUri = pfpUri;
      global.config.pfpSrc = pfpSrc;
      global.config.history = history;

      socket.on("balance", data => {

        global.config.balance[data.currency] = data.newBalance;
        var balance = global.config.balance;
  
        var formattedSolBalance = formatNum(balance.sol);
        if (formattedSolBalance === 0) formattedSolBalance = "~ 0";

        var formattedUsdcBalance = formatNum(balance.usdc);
        if (formattedUsdcBalance === 0) formattedUsdcBalance = "~ 0";
  
        var formattedDustBalance = formatNum(balance.dust);
        if (formattedDustBalance === 0) formattedDustBalance = "~ 0";
  
        var formattedForgeBalance = formatNum(balance.forge);
        if (formattedForgeBalance === 0) formattedForgeBalance = "~ 0";

        var formattedPuffBalance = formatNum(balance.puff);
        if (formattedPuffBalance === 0) formattedPuffBalance = "~ 0";
  
        var formattedJellyBalance = formatNum(balance.jelly);
        if (formattedJellyBalance === 0) formattedJellyBalance = "~ 0";
  
        var solSpan = document.getElementById("sol-current-bal");
        var solSpanActive = document.getElementById("sol-current-bal-active");
        if (solSpan) solSpan.innerHTML = formattedSolBalance;
        if (solSpanActive) solSpanActive.innerHTML = formattedSolBalance;

        var usdcSpan = document.getElementById("usdc-current-bal");
        var usdcSpanActive = document.getElementById("usdc-current-bal-active");
        if (usdcSpan) usdcSpan.innerHTML = formattedUsdcBalance;
        if (usdcSpanActive) usdcSpanActive.innerHTML = formattedUsdcBalance;
  
        var dustSpan = document.getElementById("dust-current-bal");
        var dustSpanActive = document.getElementById("dust-current-bal-active");
        if (dustSpan) dustSpan.innerHTML = formattedDustBalance;
        if (dustSpanActive) dustSpanActive.innerHTML = formattedDustBalance;
  
        var forgeSpan = document.getElementById("forge-current-bal");
        var forgeSpanActive = document.getElementById("forge-current-bal-active");
        if (forgeSpan) forgeSpan.innerHTML = formattedForgeBalance;
        if (forgeSpanActive) forgeSpanActive.innerHTML = formattedForgeBalance;

        var puffSpan = document.getElementById("puff-current-bal");
        var puffSpanActive = document.getElementById("forge-current-bal-active");
        if (puffSpan) puffSpan.innerHTML = formattedPuffBalance;
        if (forgeSpanActive) puffSpanActive.innerHTML = formattedPuffBalance;
  
        var jellySpan = document.getElementById("jelly-current-bal");
        var jellySpanActive = document.getElementById("jelly-current-bal-active");
        if (jellySpan) jellySpan.innerHTML = formattedJellyBalance;
        if (jellySpanActive) jellySpanActive.innerHTML = formattedJellyBalance;
  
      });

      dispatch(setToken(token));
      dispatch(setGlobalLoading(false));

    } catch (error) {
      console.log(error);
      toast.errorMessage(error.response.data);
      logout();
    } finally { dispatch(setGlobalLoading(false)); }

  };

};

export const logout = () => {
  return dispatch => {

    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    const isSolflareInstalled = window.solflare  && window.solflare.isSolflare;
    if (!isPhantomInstalled && !isSolflareInstalled) return toast.errorMessage("You need to have a Phantom or Solflare Wallet to connect");

    window.crashProvider = isPhantomInstalled ? window.solana : window.solflare;

    dispatch(setToken(null));
    localStorage.removeItem("token");
    global.config.balance = { sol: 0, usdc: 0, dust: 0, forge: 0, puff: 0, jelly: 0 };
    window.crashProvider.disconnect();

  };
};

export const viewAccount = () => {

  return async dispatch => {

    dispatch(setAccountStatsLoading(true));
    dispatch(setCashierHistoryLoading(true));
    dispatch(setRebateLoading(true));
    dispatch(setAccountModalOpened(true));

    const statsRes = await Wallet.getAccountStats(localStorage.getItem("token"));
    const { gamesPlayed, totalWagered, netProfit } = statsRes.data;
    global.config.gamesPlayed = gamesPlayed;
    global.config.totalWagered = {
      sol: parseInt(totalWagered["sol"]),
      usdc: parseInt(totalWagered["usdc"]),
      dust: parseInt(totalWagered["dust"])
    };
    global.config.netProfit = formatNum(netProfit) !== 0 ? formatNum(netProfit) : "~ 0";

    dispatch(setAccountStatsLoading(false));

    const cashierRes = await Wallet.getCashierHistory(localStorage.getItem("token"));
    const { deposits, withdrawals } = cashierRes.data;
    global.config.depositHistory = deposits;
    global.config.withdrawalHistory = withdrawals;
    dispatch(setCashierHistoryLoading(false));

    const rebateRes = await Wallet.getRebate(localStorage.getItem("token"));
    global.config.rebate = rebateRes.data;
    dispatch(setRebateLoading(false));

  };

};