import React  from "react";

import "./home.scss";

const Home = () => {

  return (

    <div className="solcrash-page-container">

        <div className="branding-container">

            <img className="home-logo" src="https://i.imgur.com/JOliLwm.png" alt="logo"></img>
            <h1>solcrash.io</h1>
            <h3>The most trusted gaming establishment on Solana</h3>
            <a href="/play"><button className="play-now">PLAY NOW</button></a> <br></br>

        </div>

        <div className="stats-container" id="stats">

            <div className="home-stat">
              <h2>House Edge</h2>
              <h4>5%</h4>
            </div>

            <div className="home-stat">
              <h2>Wagered</h2>
              <h4>$10,000,000+</h4>
            </div>

            <div className="home-stat">
              <h2>Bankroll</h2>
              <h4>$50,000+</h4>
            </div>

        </div>

        <div className="info-container">

            <div className="info">
              <h2>Easy</h2>
              <h4>Bet on an increasing multiplier that grows until it randomly crashes. Cash out before the crash or lose it all!</h4>
            </div>

            <div className="info">
              <h2>Social</h2>
              <h4>This game happens in real-time, meaning the whole community is synchronized. Chat with other players while you have fun!</h4>
            </div>

            <div className="info">
              <h2>Fair</h2>
              <h4>All crash outcomes can be proven as fair. Visit the <a href="/faq">FAQ</a> page for a technical description and methods to check for yourself.</h4>
            </div>

            <div className="info">
              <h2>Private</h2>
              <h4>We don't collect any information except your public Solana address, and that's only to keep track of your site balance.</h4>
            </div>

            <div className="info">
              <h2>Invest</h2>
              <h4>Holders of our NFT get a % of profits. Purchase one from our secondary marketplace, <a href="https://magiceden.io/marketplace/pokerfaces">MagicEden</a> to join the house.</h4>
            </div>

        </div>

        <div className="help-container">
          <h2>Want to learn more?</h2>
          <h4>Check out our <a href="/faq">frequently asked questions</a>. Follow us on <a href="https://twitter.com/solcrash" target="_blank" rel="noreferrer">Twitter</a> to stay updated and join our <a href="https://discord.gg/XyjHY48fKa" target="_blank" rel="noreferrer">Discord</a> to meet the community/ask questions!</h4>
        </div>

        <footer>
            <a href="https://discord.gg/XyjHY48fKa" target="_blank" rel="noreferrer"><i className="fab fa-discord"></i></a>
            <a href="https://twitter.com/solcrash" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
        </footer>

    </div>

  );

};

export default Home;
