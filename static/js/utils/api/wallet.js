import axios from "axios";

import { Transaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";

import { SERVER_URL, HOUSE } from "../constants/constants";

import getSocket from "../../socket";

const socket = getSocket();

const USDC_MINT_KEY = new window.solanaWeb3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const DUST_MINT_KEY = new window.solanaWeb3.PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ");

class Wallet {

  static async nonce(address) {
    return axios.post(
      SERVER_URL + "/nonce",
      { userAddress: address },
      { headers: { "content-type": "application/json" } }
    );
  }

  static async connect({ address, signature }) {
    return axios.post(
      SERVER_URL + "/connect",
      { userAddress: address, signature },
      { headers: { "content-type": "application/json" } }
    );
  }

  static async getAccount(token) {
    return axios.post(SERVER_URL + "/account", { token });
  }

  static async getAccountStats(token) {
    return axios.post(SERVER_URL + "/account/stats", { token });
  }

  static async getCashierHistory(token) {
    return axios.post(SERVER_URL + "/account/cashier", { token });
  }

  static async getRebate(token) {
    return axios.post(SERVER_URL + "/account/rebate", { token });
  }

  static async changePfp(uri) {
    return axios.post(SERVER_URL + "/account/pfp", { token: localStorage.getItem("token"), uri });
  }

  static async changeUsername(username) {
    return axios.post(SERVER_URL + "/account/username", { token: localStorage.getItem("token"), username });
  }

  static async deposit(amount, currency, connection) {

    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    const isSolflareInstalled = window.solflare  && window.solflare.isSolflare;
    if (!isPhantomInstalled && !isSolflareInstalled) throw new Error("You need to have a Phantom or Solflare Wallet to deposit");

    try {

      if (!window.crashProvider.isConnected) await window.crashProvider.connect();

      var transaction = null;
      var solanaWeb3 = window.solanaWeb3;
      var publicKey = window.crashProvider.publicKey;

      if (currency === "sol") {
        transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: HOUSE,
            lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
          })
        );
      }

      else if (currency === "usdc") {

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey, USDC_MINT_KEY, publicKey, Transaction.sign);
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey, USDC_MINT_KEY, HOUSE, Transaction.sign);
  
        transaction = new Transaction().add(
          createTransferInstruction(
              fromTokenAccount.address,
              toTokenAccount.address,
              publicKey,
              parseInt(amount * Math.pow(10, 6)),
              [],
              TOKEN_PROGRAM_ID
          )
        );

      }

      else if (currency === "dust") {

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey, DUST_MINT_KEY, publicKey, Transaction.sign);
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey, DUST_MINT_KEY, HOUSE, Transaction.sign);
  
        transaction = new Transaction().add(
          createTransferInstruction(
              fromTokenAccount.address,
              toTokenAccount.address,
              publicKey,
              parseInt(amount * Math.pow(10, 9)),
              [],
              TOKEN_PROGRAM_ID
          )
        );

      }
    
      transaction.feePayer = await publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      const signedTx = (await window.crashProvider.signTransaction(transaction)).serialize();
      socket.emit("deposit:new", { token: localStorage.getItem("token"), signedTx, currency });
      return;

    } catch (error) { console.log(error); throw new Error("Failed to create Solana transaction, try again"); }
    
  }

  static async withdraw(amount, currency) {
    socket.emit("withdraw:new", { token: localStorage.getItem("token"), amount, currency });
    return;
  }

  static async claimRebate(currency) {
    socket.emit("rebate:new", { token: localStorage.getItem("token"), currency });
    return;
  }

}

export default Wallet;