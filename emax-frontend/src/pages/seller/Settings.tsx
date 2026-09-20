import { useState, useEffect, useRef } from "react";
import { FaCog, FaStore, FaUser, FaImage, FaSave, FaHeadset, FaQuestionCircle, FaTicketAlt, FaMapMarkerAlt, FaExclamationTriangle, FaSpinner, FaUpload, FaShieldAlt } from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import { uploadSellerImage } from "../../services/uploadService";
import type { SellerProfile } from "../../services/sellerService";

interface LocationForm {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const TRUST_BADGE_TYPES = [
  "Local Dispatch",
  "E-maxCertified",
  "Brand Official",
];

const Settings = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
const [form, setForm] = useState({ shopName: "", shopDescription: "", phone: "" });
  const [trustBadges, setTrustBadges] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [locationForm, setLocationForm] = useState<LocationForm>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [deactivated, setDeactivated] = useState(false);
  const [deactivationMessage, setDeactivationMessage] = useState("");
  const [supportEmail, setSupportEmail] = useState("admin@emaxmarketplace.com");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
try {
        const p = await sellerService.getProfile();
        setProfile(p);
        setForm({ shopName: p.shopName || "", shopDescription: p.shopDescription || "", phone: p.phone || "" });
        setTrustBadges(Array.isArray(p.trustBadges) ? p.trustBadges : []);
        if (p.shopLogo) setLogoPreview(p.shopLogo);
        if (p.shopBanner) setBannerPreview(p.shopBanner);
      } catch (err) {
        console.error(err);
      }
    };
    const loadLocation = async () => {
      try {
        const loc = await sellerService.getLocation();
        setLocationForm({
          addressLine1: loc.addressLine1 || "",
          addressLine2: loc.addressLine2 || "",
          city: loc.city || "",
          state: loc.state || "",
          country: loc.country || "",
          postalCode: loc.postalCode || "",
        });
      } catch (err) {
        console.error("Failed to load location:", err);
      }
    };
    const checkDeactivation = async () => {
      try {
        const status = await sellerService.checkDeactivationStatus();
        if (status.isDeactivated) {
          setDeactivated(true);
          setDeactivationMessage(status.message || "");
          setSupportEmail(status.supportEmail);
        }
      } catch (err) {
        console.error("Failed to check deactivation status:", err);
      }
    };
    Promise.all([load(), loadLocation(), checkDeactivation()]).finally(() => setLoading(false));
  }, []);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBannerPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

const handleToggleBadge = (badge: string) => {
    setTrustBadges((prev) =>
      prev.includes(badge)
        ? prev.filter((b) => b !== badge)
        : [...prev, badge]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let shopLogo = profile?.shopLogo || "";
      let shopBanner = profile?.shopBanner || "";

      // Upload logo if a new file was selected
      if (logoFile) {
        setUploadingLogo(true);
        const logoResult = await uploadSellerImage(logoFile);
        shopLogo = logoResult.url;
        setUploadingLogo(false);
      }

      // Upload banner if a new file was selected
      if (bannerFile) {
        setUploadingBanner(true);
        const bannerResult = await uploadSellerImage(bannerFile);
        shopBanner = bannerResult.url;
        setUploadingBanner(false);
      }

await sellerService.updateProfile({
        ...form,
        shopLogo: shopLogo || undefined,
        shopBanner: shopBanner || undefined,
        trustBadges,
      });
      await sellerService.updateLocation(locationForm);
      setToast({ type: "success", message: "Settings saved successfully." });
      setLogoFile(null);
      setBannerFile(null);
    } catch (err: any) {
      setToast({ type: "error", message: err?.message || "Failed to save settings." });
    } finally {
      setSaving(false);
      setUploadingLogo(false);
      setUploadingBanner(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return <div className="seller-page"><div className="s-loading-container"><p>Loading settings...</p></div></div>;
  }

  return (
    <div className="seller-page">
      {/* Deactivation Banner */}
      {deactivated && (
        <div className="s-deactivation-banner">
          <div className="s-deactivation-banner-content">
            <FaExclamationTriangle className="s-deactivation-icon" />
            <div>
              <h3>Account Deactivated</h3>
              <p>{deactivationMessage}</p>
              <p className="s-deactivation-contact">
                Contact administrator: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`s-toast s-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button className="s-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className="s-page-header">
        <div>
          <h1><FaCog className="s-page-icon" /> Settings</h1>
          <p className="s-page-subtitle">Manage your shop profile, business info, location, and support</p>
        </div>
        <button className="s-btn s-btn-primary" onClick={handleSave} disabled={saving || deactivated}>
          {saving ? <FaSpinner className="s-spin" /> : <FaSave />} {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="s-settings-grid">
        {/* Shop Profile */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaStore className="s-card-icon" />
              <h2>Shop Profile</h2>
            </div>
          </div>
          <div className="s-card-body">
            <div className="s-form">
              <div className="s-form-group">
                <label>Shop Name</label>
                <input type="text" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} placeholder="Your shop name" disabled={deactivated} />
              </div>
              <div className="s-form-group">
                <label>Shop Description</label>
                <textarea rows={3} value={form.shopDescription} onChange={(e) => setForm({ ...form, shopDescription: e.target.value })} placeholder="Tell customers about your shop" disabled={deactivated} />
              </div>
              <div className="s-form-group">
                <label>Shop Logo</label>
                <div className="s-file-upload" onClick={() => logoInputRef.current?.click()}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="s-upload-preview" />
                  ) : (
                    <FaImage className="s-upload-icon" />
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    style={{ display: "none" }}
                    disabled={deactivated}
                  />
                  <span>{uploadingLogo ? "Uploading..." : "Click to upload logo"}</span>
                </div>
                {logoFile && <span className="s-file-name">{logoFile.name}</span>}
              </div>
              <div className="s-form-group">
                <label>Shop Banner</label>
                <div className="s-file-upload" onClick={() => bannerInputRef.current?.click()}>
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="s-upload-preview" />
                  ) : (
                    <FaImage className="s-upload-icon" />
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileChange}
                    style={{ display: "none" }}
                    disabled={deactivated}
                  />
                  <span>{uploadingBanner ? "Uploading..." : "Click to upload banner"}</span>
                </div>
                {bannerFile && <span className="s-file-name">{bannerFile.name}</span>}
              </div>
            </div>
          </div>
        </div>

{/* Trust Badges */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaShieldAlt className="s-card-icon" />
              <h2>Trust Badges</h2>
            </div>
          </div>
          <div className="s-card-body">
            <p className="s-form-hint" style={{ marginBottom: 12 }}>
              These badges certify your shop and are shown on your products.
            </p>
            <div className="s-badge-options">
              {TRUST_BADGE_TYPES.map((badge) => {
                const active = trustBadges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    className={`s-badge-option ${active ? "s-badge-option--active" : ""}`}
                    onClick={() => handleToggleBadge(badge)}
                    disabled={deactivated}
                  >
                    {active ? "✓" : "+"} {badge}
                  </button>
                );
              })}
            </div>
            <span className="s-form-hint">
              Selected badges: {trustBadges.length > 0 ? trustBadges.join(", ") : "None"}
            </span>
          </div>
        </div>

        {/* Business Info */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaUser className="s-card-icon" />
              <h2>Business Information</h2>
            </div>
          </div>
          <div className="s-card-body">
            <div className="s-form">
              <div className="s-form-group">
                <label>Full Name</label>
                <input type="text" value={profile ? `${profile.firstName} ${profile.lastName}` : ""} disabled />
              </div>
              <div className="s-form-group">
                <label>Email</label>
                <input type="email" value={profile?.email || ""} disabled />
              </div>
              <div className="s-form-group">
                <label>Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" disabled={deactivated} />
              </div>
              <div className="s-form-group">
                <label>Shop Stats</label>
                <div className="s-stats-inline">
                  <span><strong>{profile?.totalProducts || 0}</strong> Products</span>
                  <span><strong>{profile?.totalOrders || 0}</strong> Orders</span>
                  <span><strong>{profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : "N/A"}</strong> Joined</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Management */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaMapMarkerAlt className="s-card-icon" />
              <h2>Business Location</h2>
            </div>
          </div>
          <div className="s-card-body">
            <div className="s-form">
              <div className="s-form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  value={locationForm.addressLine1}
                  onChange={(e) => setLocationForm({ ...locationForm, addressLine1: e.target.value })}
                  placeholder="Street address, P.O. Box"
                  disabled={deactivated}
                />
              </div>
              <div className="s-form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  value={locationForm.addressLine2}
                  onChange={(e) => setLocationForm({ ...locationForm, addressLine2: e.target.value })}
                  placeholder="Apartment, suite, unit, building"
                  disabled={deactivated}
                />
              </div>
              <div className="s-form-row">
                <div className="s-form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    placeholder="Nairobi"
                    disabled={deactivated}
                  />
                </div>
                <div className="s-form-group">
                  <label>State/Region</label>
                  <input
                    type="text"
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                    placeholder="Nairobi County"
                    disabled={deactivated}
                  />
                </div>
              </div>
              <div className="s-form-row">
                <div className="s-form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={locationForm.country}
                    onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                    placeholder="Kenya"
                    disabled={deactivated}
                  />
                </div>
                <div className="s-form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={locationForm.postalCode}
                    onChange={(e) => setLocationForm({ ...locationForm, postalCode: e.target.value })}
                    placeholder="00100"
                    disabled={deactivated}
                  />
                </div>
              </div>
              {/* Live Map Preview */}
              {locationForm.city && locationForm.country && (
                <div className="s-map-preview">
                  <iframe
                    title="Seller Location"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: 8 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
                      locationForm.city + ", " + locationForm.country
                    )}&layer=mapnik&marker=${encodeURIComponent(locationForm.city + ", " + locationForm.country)}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaHeadset className="s-card-icon" />
              <h2>Help & Support</h2>
            </div>
          </div>
          <div className="s-card-body">
            <div className="s-support-links">
              <a href="#" className="s-support-link">
                <FaQuestionCircle /> FAQ & Seller Guide
              </a>
              <a href="#" className="s-support-link">
                <FaTicketAlt /> Open a Support Ticket
              </a>
              <a href="#" className="s-support-link">
                <FaHeadset /> Contact Seller Support
              </a>
            </div>
            <div className="s-support-info">
              <p>Average response time: <strong>24 hours</strong></p>
              <p>Support hours: <strong>Mon-Fri, 8:00 AM - 6:00 PM EAT</strong></p>
              {deactivated && (
                <p className="s-support-deactivated">
                  <strong>Account deactivated?</strong> Email us at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
