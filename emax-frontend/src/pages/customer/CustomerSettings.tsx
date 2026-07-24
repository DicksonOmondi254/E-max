import { useState, useEffect, useCallback } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaGlobe,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
} from "react-icons/fa";
import CustomerShell from "./CustomerShell";
import { customerProfileService } from "../../services/customerProfileService";
import type { UserProfile } from "../../services/customerProfileService";

interface ToastState {
  message: string;
  type: "success" | "error";
}

type ProfileTab = "profile" | "password" | "notifications" | "preferences";

const CustomerSettings = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  // ── Profile State ──
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // ── Password State ──
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ── Notification Preferences ──
  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    paymentAlerts: true,
    wishlistAlerts: false,
  });

  // ── General Preferences ──
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "KES",
    timezone: "Africa/Nairobi",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Load user data from API ──
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const userData: UserProfile = await customerProfileService.getProfile();
        setProfile({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
        });
        // Parse notification preferences from JSON string
        if (userData.notifications) {
          try {
            const parsed = JSON.parse(userData.notifications);
            setNotifPrefs({
              orderUpdates: parsed.orderUpdates ?? true,
              promotions: parsed.promotions ?? true,
              newsletter: parsed.newsletter ?? false,
              paymentAlerts: parsed.paymentAlerts ?? true,
              wishlistAlerts: parsed.wishlistAlerts ?? false,
            });
          } catch {}
        }
        setPreferences({
          language: userData.language || "en",
          currency: userData.currency || "KES",
          timezone: userData.timezone || "Africa/Nairobi",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        showToast("Failed to load profile data", "error");
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await customerProfileService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (passwords.new.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setSaving(true);
    try {
      await customerProfileService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      showToast("Password changed successfully!", "success");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleNotifSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await customerProfileService.updateProfile({
        notifications: JSON.stringify(notifPrefs),
      });
      showToast("Notification preferences saved!", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePrefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await customerProfileService.updateProfile({
        language: preferences.language,
        currency: preferences.currency,
        timezone: preferences.timezone,
      });
      showToast("Preferences saved!", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "password", label: "Password", icon: <FaLock /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "preferences", label: "Preferences", icon: <FaGlobe /> },
  ];

  const renderToast = () => {
    if (!toast) return null;
    return (
      <div className="settings-toast" style={{
        position: "fixed", top: 20, right: 20,
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 20px", borderRadius: 10,
        fontSize: 14, fontWeight: 600, zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "settingsSlideDown 0.3s ease",
        maxWidth: 420,
        background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
        border: toast.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
        color: toast.type === "success" ? "#065f46" : "#991b1b",
      }}>
        {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
        <span>{toast.message}</span>
        <button onClick={() => setToast(null)}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 16, opacity: 0.7 }}
        >&times;</button>
      </div>
    );
  };

  // ── Toggle Component ──
  const Toggle: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
    <label className="settings-toggle" htmlFor={id} style={{ position: "relative", width: 48, height: 26, flexShrink: 0, cursor: "pointer" }}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: "absolute", inset: 0, background: checked ? "#6366f1" : "#d1d5db",
        borderRadius: 26, transition: "all 0.3s"
      }}>
        <span style={{
          content: '""', position: "absolute", width: 20, height: 20,
          left: checked ? 25 : 3, bottom: 3, background: "#fff",
          borderRadius: "50%", transition: "all 0.3s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
        }} />
      </span>
    </label>
  );

  const pageStyle = {
    padding: "24px 0",
    maxWidth: 800,
    margin: "0 auto",
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
  };

  const tabNavStyle: React.CSSProperties = {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    background: "#fafafa",
    overflowX: "auto" as const,
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 22px",
    fontSize: 14,
    fontWeight: 600,
    color: active ? "#6366f1" : "#6b7280",
    border: "none",
    background: active ? "rgba(99,102,241,0.04)" : "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
    borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
    marginBottom: -1,
  });

  const bodyStyle: React.CSSProperties = {
    padding: "28px 32px",
  };

  return (
    <CustomerShell title="Account Settings">
      {renderToast()}
      <div style={pageStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "#fff", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
          }}>
            <FaUserCircle />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
              Account Settings
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
              Manage your profile, password, and notification preferences.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={sectionStyle}>
          <div style={tabNavStyle}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                style={tabBtnStyle(activeTab === tab.id)}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div style={bodyStyle}>
            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <FaUser style={{ color: "#6366f1" }} /> Personal Information
                </h3>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px 0" }}>
                  Update your personal details and contact information.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      First Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        transition: "all 0.2s", background: "#fff", color: "#111827",
                        boxSizing: "border-box", fontFamily: "inherit"
                      }}
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Last Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        transition: "all 0.2s", background: "#fff", color: "#111827",
                        boxSizing: "border-box", fontFamily: "inherit"
                      }}
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      <FaEnvelope style={{ marginRight: 4 }} /> Email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        transition: "all 0.2s", background: "#fff", color: "#111827",
                        boxSizing: "border-box", fontFamily: "inherit"
                      }}
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      <FaPhone style={{ marginRight: 4 }} /> Phone <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        transition: "all 0.2s", background: "#fff", color: "#111827",
                        boxSizing: "border-box", fontFamily: "inherit"
                      }}
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", fontSize: 14, fontWeight: 600,
                      border: "none", borderRadius: 10, cursor: "pointer",
                      background: "#6366f1", color: "#fff",
                      opacity: saving ? 0.6 : 1, transition: "all 0.2s", fontFamily: "inherit"
                    }}
                  >
                    {saving ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSave />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <FaLock style={{ color: "#6366f1" }} /> Change Password
                </h3>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px 0" }}>
                  Ensure your account is secure by using a strong password.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18, maxWidth: 500 }}>
                  {(["current", "new", "confirm"] as const).map((field) => (
                    <div key={field} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "capitalize" }}>
                        {field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm New Password"}
                        <span style={{ color: "#ef4444" }}> *</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          style={{
                            width: "100%", padding: "11px 42px 11px 14px", fontSize: 14,
                            border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                            transition: "all 0.2s", background: "#fff", color: "#111827",
                            boxSizing: "border-box", fontFamily: "inherit"
                          }}
                          type={showPasswords[field] ? "text" : "password"}
                          value={passwords[field]}
                          onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                          placeholder={`Enter ${field === "current" ? "current" : "new"} password`}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords((p) => ({ ...p, [field]: !p[field] }))}
                          style={{
                            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4
                          }}
                        >
                          {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", fontSize: 14, fontWeight: 600,
                      border: "none", borderRadius: 10, cursor: "pointer",
                      background: "#6366f1", color: "#fff",
                      opacity: saving ? 0.6 : 1, fontFamily: "inherit"
                    }}
                  >
                    {saving ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaLock />}
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Notifications Tab ── */}
            {activeTab === "notifications" && (
              <form onSubmit={handleNotifSubmit}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <FaBell style={{ color: "#6366f1" }} /> Notification Preferences
                </h3>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px 0" }}>
                  Choose which notifications you'd like to receive.
                </p>
                {[
                  { key: "orderUpdates" as const, label: "Order Updates", desc: "Get notified about your order status changes" },
                  { key: "promotions" as const, label: "Promotions & Deals", desc: "Receive promotional offers and discounts" },
                  { key: "newsletter" as const, label: "Newsletter", desc: "Weekly newsletter with latest products" },
                  { key: "paymentAlerts" as const, label: "Payment Alerts", desc: "Alerts for successful and failed payments" },
                  { key: "wishlistAlerts" as const, label: "Wishlist Alerts", desc: "Get notified when wishlist items go on sale" },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 0", gap: 20,
                    borderBottom: "1px solid #f3f4f6"
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", display: "block", marginBottom: 2 }}>
                        {label}
                      </span>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>{desc}</p>
                    </div>
                    <Toggle
                      id={`notif-${key}`}
                      checked={notifPrefs[key]}
                      onChange={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    />
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", fontSize: 14, fontWeight: 600,
                      border: "none", borderRadius: 10, cursor: "pointer",
                      background: "#6366f1", color: "#fff",
                      opacity: saving ? 0.6 : 1, fontFamily: "inherit"
                    }}
                  >
                    {saving ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSave />}
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Preferences Tab ── */}
            {activeTab === "preferences" && (
              <form onSubmit={handlePrefSubmit}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <FaGlobe style={{ color: "#6366f1" }} /> General Preferences
                </h3>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px 0" }}>
                  Customize your experience with language, currency, and timezone.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 500 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Language</label>
                    <select
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        background: "#fff", color: "#111827", fontFamily: "inherit",
                        appearance: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36
                      }}
                      value={preferences.language}
                      onChange={(e) => setPreferences((p) => ({ ...p, language: e.target.value }))}
                    >
                      <option value="en">English</option>
                      <option value="sw">Kiswahili</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Currency</label>
                    <select
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        background: "#fff", color: "#111827", fontFamily: "inherit",
                        appearance: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36
                      }}
                      value={preferences.currency}
                      onChange={(e) => setPreferences((p) => ({ ...p, currency: e.target.value }))}
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Timezone</label>
                    <select
                      style={{
                        width: "100%", padding: "11px 14px", fontSize: 14,
                        border: "1.5px solid #d1d5db", borderRadius: 10, outline: "none",
                        background: "#fff", color: "#111827", fontFamily: "inherit",
                        appearance: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36
                      }}
                      value={preferences.timezone}
                      onChange={(e) => setPreferences((p) => ({ ...p, timezone: e.target.value }))}
                    >
                      <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                      <option value="Africa/Lagos">Africa/Lagos (UTC+1)</option>
                      <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", fontSize: 14, fontWeight: 600,
                      border: "none", borderRadius: 10, cursor: "pointer",
                      background: "#6366f1", color: "#fff",
                      opacity: saving ? 0.6 : 1, fontFamily: "inherit"
                    }}
                  >
                    {saving ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSave />}
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </CustomerShell>
  );
};

export default CustomerSettings;

