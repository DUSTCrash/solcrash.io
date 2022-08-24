import React from "react";

import "./faq.scss";

const Faq = () => {

  const items = document.querySelectorAll(".accordion button");

  function toggleAccordion() {
    const itemToggle = this.getAttribute("aria-expanded");
    for (var i = 0; i < items.length; i++) items[i].setAttribute("aria-expanded", "false");
    if (itemToggle === "false")
    this.setAttribute("aria-expanded", "true");
  }

  items.forEach(item => item.addEventListener("click", toggleAccordion));

  return (
    <div className="solcrash-page-container">

      <div className="faq-container-big">

        <div className="faq-container">

          <h2>Common Questions</h2>

          <div className="tabs">
            <div className="tab">
              <input type="checkbox" id="chck1" />
              <label className="tab-label" for="chck1">How do I play?</label>
              <div className="tab-content">Place a bet with any amount of Solana. Once the game starts, a multiplier will increase from 1x! You can cash out at any time while the multiplier is going up, but it will randomly "crash" meaning it will stop increasing. If you fail to cash out before it crashes, you will lose the amount that you bet, but if you cash out before, you will win your bet multiplied by the current multiplier.</div>
            </div>
            <div className="tab">
              <input type="checkbox" id="chck2" />
              <label className="tab-label" for="chck2">How long do deposits/withdrawals take?</label>
              <div className="tab-content">Usually the Solana network confirms transactions very quickly, so on average it shouldn't take longer than 30 seconds. However, when there is a lot of traffic on the network, please wait up to 5 minutes for your deposit/withdrawal to be credited. After 5 minutes, if the transaction still doesn't confirm, it means your funds was never sent and therefore your account won't be credited. If this happens you will have to just try again.</div>
            </div>
          </div>

        </div>

        <div className="faq-container">
          <h2>Provably Fair</h2>
          <iframe src="https://codesandbox.io/embed/eloquent-breeze-d80w7i?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.js&moduleview=1&theme=dark&view=editor"
            style={{ width: "100%", height: "500px", border: 0, borderRadius: "4px", overflow: "hidden" }}
            title="eloquent-breeze-d80w7i"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
          <div className="explanation">
            <h4>
              We start with a 'server seed' and hash it via sha256 to create a new server seed. We repeatedly feed the newly generated server seeds into the sha256 function until we have a list of 2 million server seeds, all linked via a chain. The 2 millionth hash is the first game and the 1st hash is the last game.
            </h4>{" "}
            <br></br>
            <h4>
              Whenever a game ends, we publish the hash associated with that game. This allows you to verify the integrity of each game and the chain as a whole.
            </h4>{" "}
            <br></br>
            <h4>
              The code that converts a hash into a crash point is embedded above. Plug your desired game hash and run the code to view the crash point. The first ever game hash was '4e5b4f63d06fbf6084a7b61d6213c3adcf2a81036b20f5c898b27421c6aaa640'. By posting this here, we eliminate the possibility of altering the chain, since you can trace the current game hash all the way back to this one.
            </h4>{" "}
            <br></br>
            <h4>
              All outcomes are predefined and depend solely on luck.
            </h4>
          </div>
        </div>

      </div>

    </div>
  );

};

export default Faq;
