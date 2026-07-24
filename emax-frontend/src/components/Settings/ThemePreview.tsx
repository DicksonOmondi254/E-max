import React from "react";

interface ThemePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkMode: boolean;
  storeName: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  darkMode,
  storeName,
}) => {
  const isDark = darkMode;
  const bg = isDark ? "#1f2937" : backgroundColor || "#f5f6fa";
  const cardBg = isDark ? "#374151" : "#ffffff";
  const textColor = isDark ? "#f9fafb" : "#111827";
  const mutedText = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#4b5563" : "#e5e7eb";

  return (
    <div
      style={{
        background: bg,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
        transition: "all 0.3s ease",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Preview Header / Navbar */}
      <div
        style={{
          background: isDark ? "#111827" : primaryColor,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>
          {storeName || "E-Max Store"}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: secondaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            U
          </div>
        </div>
      </div>

      {/* Preview Body */}
      <div style={{ padding: 20 }}>
        {/* Hero Banner Placeholder */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`,
            borderRadius: 12,
            padding: "24px 20px",
            marginBottom: 20,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: textColor,
              marginBottom: 6,
            }}
          >
            {isDark ? "🌙 " : "☀️ "}Welcome to {storeName || "E-Max"}
          </div>
          <div style={{ fontSize: 13, color: mutedText }}>
            Discover amazing products at great prices
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                borderRadius: 10,
                padding: 12,
                border: `1px solid ${borderColor}`,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 50,
                  background: `linear-gradient(135deg, ${primaryColor}33, ${accentColor}33)`,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "70%",
                  background: isDark ? "#4b5563" : "#e5e7eb",
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "40%",
                  background: isDark ? "#4b5563" : "#e5e7eb",
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 14, color: textColor }}>
                  KES 1,<span style={{ color: primaryColor }}>299</span>
                </span>
                <span
                  style={{
                    background: accentColor,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  SALE
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: "#fff",
            textAlign: "center",
            padding: "10px 0",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        >
          Shop Now
        </div>
      </div>

      {/* Preview Footer */}
      <div
        style={{
          background: isDark ? "#111827" : primaryColor + "dd",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <span>© 2024 {storeName || "E-Max"}</span>
        <span style={{ display: "flex", gap: 8 }}>
          <span>About</span>
          <span>Contact</span>
          <span>FAQ</span>
        </span>
      </div>
    </div>
  );
};

export default ThemePreview;

