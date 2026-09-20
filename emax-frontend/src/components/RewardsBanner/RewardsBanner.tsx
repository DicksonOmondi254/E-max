import { useState } from "react";
import {
  FaCoins,
  FaGift,
  FaCheckCircle,
  FaDice,
} from "react-icons/fa";
import "./RewardsBanner.css";

// Consolidated "Rewards Hub" banner: Daily Check-in + Spin & Win in one strip
// so it does not take up double premium real estate below the header.
const RewardsBanner = () => {
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="rewards-banner">
      <div className="page-wrapper rewards-banner__inner">
        <div className="rewards-banner__hub">
          <FaGift className="rewards-banner__hub-icon" />
          <div className="rewards-banner__hub-text">
            <strong>Rewards Hub</strong>
            <span>Earn coins &amp; try today's lucky draw</span>
          </div>
        </div>

        <div className="rewards-banner__actions">
          {/* ── Daily Check-in / Claim Coins ── */}
          <div className="rewards-banner__checkin">
            <div className="rewards-banner__text">
              <FaCoins className="rewards-banner__coin" />
              <span>
                {claimed ? "Coins claimed! Come back tomorrow." : "Daily Check-in"}
              </span>
            </div>
            <button
              className={`rewards-banner__claim ${claimed ? "is-claimed" : ""}`}
              onClick={() => setClaimed(true)}
              disabled={claimed}
            >
              {claimed ? (
                <>
                  <FaCheckCircle /> Claimed
                </>
              ) : (
                <>
                  <FaCoins /> Claim 50 Coins
                </>
              )}
            </button>
          </div>

          {/* ── Lucky Draw / Spin & Win ── */}
          <a href="#" className="rewards-banner__lucky">
            <FaDice className="rewards-banner__lucky-icon" />
            <span>
              <strong>Spin &amp; Win</strong>
              <small>Try your luck!</small>
            </span>
            <FaGift className="rewards-banner__gift" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RewardsBanner;
