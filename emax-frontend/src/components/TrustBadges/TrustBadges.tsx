import { FaTruck, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import "./TrustBadges.css";

type TrustBadgesProps = {
  compact?: boolean;
  badges?: string[];
};

const DEFAULT_BADGES = ["Local Dispatch", "E-maxCertified", "Brand Official"];

const badgeClassMap: Record<string, string> = {
  "Local Dispatch": "trust-badge--dispatch",
  "E-maxCertified": "trust-badge--certified",
  "Brand Official": "trust-badge--official",
};

const badgeIconMap: Record<string, React.ReactNode> = {
  "Local Dispatch": <FaTruck className="trust-badge__icon" />,
  "E-maxCertified": <FaShieldAlt className="trust-badge__icon" />,
  "Brand Official": <FaCheckCircle className="trust-badge__icon" />,
};

const TrustBadges = ({ compact = false, badges }: TrustBadgesProps) => {
  const list =
    badges && badges.length > 0
      ? badges
      : DEFAULT_BADGES;

  return (
    <div className={`trust-badges ${compact ? "trust-badges--compact" : ""}`}>
      {list.map((badge, index) => (
        <span
          key={index}
          className={`trust-badge ${badgeClassMap[badge] || "trust-badge--certified"}`}
        >
          {badgeIconMap[badge] || <FaShieldAlt className="trust-badge__icon" />}
          {badge}
        </span>
      ))}
    </div>
  );
};

export default TrustBadges;
