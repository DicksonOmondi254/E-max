import { useState, useCallback, useRef, useEffect } from "react";
import {
  FaCog,
  FaStore,
  FaPalette,
  FaTruck,
  FaCreditCard,
  FaBell,
  FaSearchPlus,
  FaSave,
  FaUndo,
  FaGlobeAfrica,
  FaImage,
  FaMoon,
  FaPaypal,
  FaUniversity,
  FaMobileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapPin,
  FaMapMarkerAlt,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaGoogle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaWrench,
  FaExclamationTriangle,
  FaGlobe,
  FaCity,
  FaPlane,
  FaTimes,
  FaCheck,
  FaBoxOpen,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaCode,
  FaEnvelope,
  FaServer,
  FaDownload,
  FaUpload,
  FaSearch,
  FaEye,
  FaLaptop,
} from "react-icons/fa";
import "./Settings.css";
import { shippingService } from "../../services/shippingService";
import { storeSettingsService } from "../../services/storeSettingsService";
import ThemePreview from "../../components/Settings/ThemePreview";
import type { ShippingZone as ApiShippingZone } from "../../services/shippingService";

// ── Types ──
type TabId = "general" | "appearance" | "social" | "shipping" | "payment" | "notifications" | "email" | "code" | "seo";

interface ToastState {
  message: string;
  type: "success" | "error";
}

interface ShippingZone {
  id: string;
  name: string;
  regions: string;
  fee: number;
  estimatedDays: string;
  status: "active" | "inactive";
  freeThreshold: number;
  zoneType: "local" | "regional" | "international";
}

interface ZoneFormData {
  name: string;
  regions: string[];
  fee: string;
  estimatedDays: string;
  status: "active" | "inactive";
  freeThreshold: string;
  zoneType: "local" | "regional" | "international";
}

interface ZoneFormErrors {
  name?: string;
  regions?: string;
  fee?: string;
  estimatedDays?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: "mpesa" | "card" | "paypal" | "bank";
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ColorSetting {
  id: string;
  label: string;
  description: string;
  color: string;
}

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

// ── Tabs ──
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <FaStore /> },
  { id: "appearance", label: "Appearance", icon: <FaPalette /> },
  { id: "social", label: "Social", icon: <FaGlobe /> },
  { id: "shipping", label: "Shipping", icon: <FaTruck /> },
  { id: "payment", label: "Payment", icon: <FaCreditCard /> },
  { id: "notifications", label: "Alerts", icon: <FaBell /> },
  { id: "email", label: "Email", icon: <FaEnvelope /> },
  { id: "code", label: "Custom Code", icon: <FaCode /> },
  { id: "seo", label: "SEO", icon: <FaSearchPlus /> },
];

// ── Initial Data ──
const INITIAL_GENERAL = {
  storeName: "E-Max Store",
  tagline: "Your Premium Shopping Destination",
  supportEmail: "support@emaxstore.com",
  supportPhone: "+254 700 123 456",
  address: "123 Kenyatta Avenue, Nairobi, Kenya",
  currency: "KES",
  timezone: "Africa/Nairobi",
};

const INITIAL_COLORS: ColorSetting[] = [
  { id: "primary", label: "Primary Color", description: "Main brand color", color: "#6366f1" },
  { id: "secondary", label: "Secondary Color", description: "Accent for highlights", color: "#8b5cf6" },
  { id: "accent", label: "Accent Color", description: "Call-to-action elements", color: "#f59e0b" },
  { id: "background", label: "Background Color", description: "Site background", color: "#f5f6fa" },
];

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "mpesa", name: "M-Pesa", description: "Mobile money via Safaricom", enabled: true, type: "mpesa" },
  { id: "card", name: "Credit / Debit Card", description: "Visa, Mastercard, etc.", enabled: true, type: "card" },
  { id: "paypal", name: "PayPal", description: "Global PayPal payments", enabled: false, type: "paypal" },
  { id: "bank", name: "Bank Transfer", description: "Direct bank deposit", enabled: true, type: "bank" },
];

const INITIAL_NOTIFICATIONS: NotificationSetting[] = [
  { id: "new-orders", label: "New Orders", description: "Alert when a new order is placed", enabled: true },
  { id: "new-customers", label: "New Customers", description: "Alert when a new customer registers", enabled: true },
  { id: "low-stock", label: "Low Stock Alerts", description: "Alert when stock is low", enabled: true },
  { id: "new-reviews", label: "New Reviews", description: "Alert when a review is submitted", enabled: false },
  { id: "cancellations", label: "Order Cancellations", description: "Alert when order is cancelled", enabled: true },
  { id: "payment-failures", label: "Payment Failures", description: "Alert when a payment fails", enabled: true },
];

const INITIAL_SHIPPING = { defaultFee: 350, freeThreshold: 5000 };
const INITIAL_SOCIAL: SocialLinks = { facebook: "", twitter: "", instagram: "", tiktok: "", youtube: "", linkedin: "" };
const INITIAL_SMTP: SmtpConfig = { host: "", port: 587, user: "", pass: "", fromEmail: "", fromName: "" };
const INITIAL_CODE = { css: "", js: "", header: "", footer: "" };

const INITIAL_ZONES: ShippingZone[] = [
  { id: "1", name: "Nairobi Metro", regions: "Nairobi, Kiambu, Machakos", fee: 250, estimatedDays: "1-2 days", status: "active", freeThreshold: 2000, zoneType: "local" },
  { id: "2", name: "Domestic", regions: "All other Kenyan counties", fee: 500, estimatedDays: "3-5 days", status: "active", freeThreshold: 5000, zoneType: "regional" },
  { id: "3", name: "East Africa", regions: "Uganda, Tanzania, Rwanda", fee: 1500, estimatedDays: "5-10 days", status: "inactive", freeThreshold: 10000, zoneType: "international" },
];

const INITIAL_SEO = {
  metaTitle: "E-Max Store - Premium Shopping",
  metaDescription: "Discover the best deals on electronics, fashion, home goods at E-Max Store.",
  googleAnalyticsId: "",
  maintenanceMode: false,
};

// ── Toggle Component ──
const Toggle: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
  <label className="settings-toggle" htmlFor={id}>
    <input id={id} type="checkbox" checked={checked} onChange={onChange} />
    <span className="settings-toggle-slider" />
  </label>
);

// ── Search Helpers ──
const ALL_SEARCHABLE_TERMS: { tab: TabId; keywords: string[] }[] = [
  { tab: "general", keywords: ["store name", "tagline", "support email", "support phone", "address", "currency", "timezone", "general", "contact"] },
  { tab: "appearance", keywords: ["logo", "favicon", "colors", "theme", "dark mode", "primary", "secondary", "accent", "background", "appearance"] },
  { tab: "social", keywords: ["social media", "facebook", "twitter", "instagram", "tiktok", "youtube", "linkedin", "social links"] },
  { tab: "shipping", keywords: ["shipping", "delivery", "zones", "free shipping", "shipping fee", "regions"] },
  { tab: "payment", keywords: ["payment", "mpesa", "credit card", "paypal", "bank transfer", "payment methods"] },
  { tab: "notifications", keywords: ["notifications", "alerts", "email alerts", "orders", "stock", "reviews"] },
  { tab: "email", keywords: ["smtp", "email", "mail server", "from email", "smtp host", "smtp port"] },
  { tab: "code", keywords: ["custom code", "css", "javascript", "header", "footer", "custom css", "custom js"] },
  { tab: "seo", keywords: ["seo", "meta title", "meta description", "google analytics", "maintenance"] },
];

// ════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════

const REGION_SUGGESTIONS = [
  "Nairobi", "Kiambu", "Machakos", "Kajiado", "Mombasa", "Kisumu",
  "Nakuru", "Eldoret", "Thika", "Malindi", "Nyeri", "Meru",
  "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan", "Ethiopia",
  "Somalia", "DRC", "Kenya (All Counties)", "East Africa", "Africa",
];

const EMPTY_ZONE_FORM: ZoneFormData = {
  name: "",
  regions: [],
  fee: "",
  estimatedDays: "",
  status: "active",
  freeThreshold: "",
  zoneType: "local",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [general, setGeneral] = useState(INITIAL_GENERAL);
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [darkMode, setDarkMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENT_METHODS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [shipping, setShipping] = useState(INITIAL_SHIPPING);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [seo, setSeo] = useState(INITIAL_SEO);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(INITIAL_SOCIAL);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(INITIAL_SMTP);
  const [customCode, setCustomCode] = useState(INITIAL_CODE);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [smtpTestStatus, setSmtpTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // ── Zone Modal State ──
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [zoneForm, setZoneForm] = useState<ZoneFormData>(EMPTY_ZONE_FORM);
  const [zoneFormErrors, setZoneFormErrors] = useState<ZoneFormErrors>({});
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [regionInput, setRegionInput] = useState("");

  // ── Confirm Delete State ──
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Track unsaved changes ──
  const markUnsaved = useCallback(() => setHasUnsaved(true), []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (hasUnsaved) handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasUnsaved]);

  // ── Warn before leaving with unsaved changes ──
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsaved]);

  // ── Detect tab switching with unsaved changes ──
  const handleTabChange = (tab: TabId) => {
    if (hasUnsaved) {
      const confirmed = window.confirm("You have unsaved changes. Switch tabs anyway?");
      if (!confirmed) return;
    }
    setActiveTab(tab);
  };

  // ── Search logic ──
  const searchedTab = searchQuery.trim()
    ? ALL_SEARCHABLE_TERMS.find((entry) =>
        entry.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )?.tab ?? null
    : null;

  // ── Handle tab matching from search ──
  useEffect(() => {
    if (searchedTab && searchedTab !== activeTab) {
      setActiveTab(searchedTab);
    }
  }, [searchQuery]);

  // ── Fetch shipping zones & settings from DB on mount ──
  const [_loadingZones, setLoadingZones] = useState(false);

  const fetchShippingData = useCallback(async () => {
    try {
      setLoadingZones(true);
      const [fetchedZones, fetchedSettings] = await Promise.all([
        shippingService.getAllZones(),
        shippingService.getSettings(),
      ]);
      const mappedZones: ShippingZone[] = fetchedZones.map((z: ApiShippingZone) => ({
        id: String(z.id),
        name: z.name,
        regions: z.regions,
        fee: z.fee,
        estimatedDays: z.estimatedDays,
        status: z.status === "ACTIVE" ? "active" : "inactive",
        freeThreshold: z.freeThreshold,
        zoneType: z.zoneType === "LOCAL" ? "local" : z.zoneType === "REGIONAL" ? "regional" : "international",
      }));
      setZones(mappedZones);
      setShipping({
        defaultFee: fetchedSettings.defaultFee,
        freeThreshold: fetchedSettings.freeThreshold,
      });
    } catch (err) {
      console.error("Failed to fetch shipping data:", err);
      setZones(INITIAL_ZONES);
    } finally {
      setLoadingZones(false);
    }
  }, []);

  // ── Fetch Store Settings from DB on mount ──
  const fetchStoreSettings = useCallback(async () => {
    try {
      const settings = await storeSettingsService.getSettings();
      setGeneral({
        storeName: settings.storeName,
        tagline: settings.tagline,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        address: settings.address,
        currency: settings.currency,
        timezone: settings.timezone,
      });
      setColors([
        { id: "primary", label: "Primary Color", description: "Main brand color", color: settings.primaryColor },
        { id: "secondary", label: "Secondary Color", description: "Accent for highlights", color: settings.secondaryColor },
        { id: "accent", label: "Accent Color", description: "Call-to-action elements", color: settings.accentColor },
        { id: "background", label: "Background Color", description: "Site background", color: settings.backgroundColor },
      ]);
      setDarkMode(settings.darkMode);
      if (settings.logo) setLogoPreview(settings.logo);
      if (settings.favicon) setFaviconPreview(settings.favicon);
      setSocialLinks({
        facebook: settings.facebookUrl || "",
        twitter: settings.twitterUrl || "",
        instagram: settings.instagramUrl || "",
        tiktok: settings.tiktokUrl || "",
        youtube: settings.youtubeUrl || "",
        linkedin: settings.linkedinUrl || "",
      });
      setCustomCode({
        css: settings.customCss || "",
        js: settings.customJs || "",
        header: settings.customHeader || "",
        footer: settings.customFooter || "",
      });
      setSmtpConfig({
        host: settings.smtpHost || "",
        port: settings.smtpPort || 587,
        user: settings.smtpUser || "",
        pass: settings.smtpPass || "",
        fromEmail: settings.smtpFromEmail || "",
        fromName: settings.smtpFromName || "",
      });
      try {
        const parsedPayments = JSON.parse(settings.paymentMethods);
        if (Array.isArray(parsedPayments)) setPaymentMethods(parsedPayments);
      } catch {}
      try {
        const parsedNotifs = JSON.parse(settings.notifications);
        if (Array.isArray(parsedNotifs)) setNotifications(parsedNotifs);
      } catch {}
      setSeo({
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        googleAnalyticsId: settings.googleAnalyticsId,
        maintenanceMode: settings.maintenanceMode,
      });
    } catch (err) {
      console.error("Failed to fetch store settings:", err);
    }
  }, []);

  useEffect(() => {
    fetchShippingData();
    fetchStoreSettings();
  }, [fetchShippingData, fetchStoreSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await storeSettingsService.updateSettings({
        storeName: general.storeName,
        tagline: general.tagline,
        supportEmail: general.supportEmail,
        supportPhone: general.supportPhone,
        address: general.address,
        currency: general.currency,
        timezone: general.timezone,
        logo: logoPreview || "",
        favicon: faviconPreview || "",
        primaryColor: colors.find((c) => c.id === "primary")?.color || "#6366f1",
        secondaryColor: colors.find((c) => c.id === "secondary")?.color || "#8b5cf6",
        accentColor: colors.find((c) => c.id === "accent")?.color || "#f59e0b",
        backgroundColor: colors.find((c) => c.id === "background")?.color || "#f5f6fa",
        darkMode,
        facebookUrl: socialLinks.facebook,
        twitterUrl: socialLinks.twitter,
        instagramUrl: socialLinks.instagram,
        tiktokUrl: socialLinks.tiktok,
        youtubeUrl: socialLinks.youtube,
        linkedinUrl: socialLinks.linkedin,
        customCss: customCode.css,
        customJs: customCode.js,
        customHeader: customCode.header,
        customFooter: customCode.footer,
        smtpHost: smtpConfig.host,
        smtpPort: smtpConfig.port,
        smtpUser: smtpConfig.user,
        smtpPass: smtpConfig.pass,
        smtpFromEmail: smtpConfig.fromEmail,
        smtpFromName: smtpConfig.fromName,
        paymentMethods: JSON.stringify(paymentMethods),
        notifications: JSON.stringify(notifications),
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        googleAnalyticsId: seo.googleAnalyticsId,
        maintenanceMode: seo.maintenanceMode,
      });
      await shippingService.updateSettings({
        defaultFee: shipping.defaultFee,
        freeThreshold: shipping.freeThreshold,
      });
      showToast("All settings saved successfully!", "success");
      setHasUnsaved(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (hasUnsaved && !window.confirm("Reset all settings to defaults? This cannot be undone.")) return;
    setGeneral(INITIAL_GENERAL);
    setColors(INITIAL_COLORS);
    setDarkMode(false);
    setLogoPreview(null);
    setFaviconPreview(null);
    setPaymentMethods(INITIAL_PAYMENT_METHODS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setShipping(INITIAL_SHIPPING);
    setZones(INITIAL_ZONES);
    setSeo(INITIAL_SEO);
    setSocialLinks(INITIAL_SOCIAL);
    setCustomCode(INITIAL_CODE);
    setSmtpConfig(INITIAL_SMTP);
    showToast("Settings reset to defaults", "success");
    setHasUnsaved(false);
  };

  const handleExport = () => {
    const data = {
      general,
      colors,
      darkMode,
      logo: logoPreview,
      favicon: faviconPreview,
      socialLinks,
      customCode,
      smtpConfig,
      paymentMethods,
      notifications,
      shipping,
      zones,
      seo,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emax-settings-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Settings exported successfully!", "success");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.general) setGeneral(data.general);
        if (data.colors) setColors(data.colors);
        if (data.darkMode !== undefined) setDarkMode(data.darkMode);
        if (data.logo) setLogoPreview(data.logo);
        if (data.favicon) setFaviconPreview(data.favicon);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.customCode) setCustomCode(data.customCode);
        if (data.smtpConfig) setSmtpConfig(data.smtpConfig);
        if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
        if (data.notifications) setNotifications(data.notifications);
        if (data.shipping) setShipping(data.shipping);
        if (data.zones) setZones(data.zones);
        if (data.seo) setSeo(data.seo);
        setHasUnsaved(true);
        showToast("Settings imported successfully! Don't forget to save.", "success");
      } catch {
        showToast("Invalid backup file", "error");
      }
    };
    input.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target?.result as string);
        markUnsaved();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFaviconPreview(ev.target?.result as string);
        markUnsaved();
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePayment = (id: string) => {
    setPaymentMethods((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
    markUnsaved();
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)));
    markUnsaved();
  };

  const handleColorChange = (id: string, color: string) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, color } : c)));
    markUnsaved();
  };

  const handleGeneralChange = (field: string, value: string) => {
    setGeneral((prev) => ({ ...prev, [field]: value }));
    markUnsaved();
  };

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
    markUnsaved();
  };

  const handleSmtpChange = (field: keyof SmtpConfig, value: string | number) => {
    setSmtpConfig((prev) => ({ ...prev, [field]: value }));
    markUnsaved();
  };

  const handleCodeChange = (field: keyof typeof INITIAL_CODE, value: string) => {
    setCustomCode((prev) => ({ ...prev, [field]: value }));
    markUnsaved();
  };

  const testSmtpConnection = async () => {
    setSmtpTestStatus("testing");
    // Simulate SMTP test (in production, call an API endpoint)
    setTimeout(() => {
      setSmtpTestStatus(smtpConfig.host ? "success" : "error");
      setTimeout(() => setSmtpTestStatus("idle"), 3000);
    }, 1500);
  };

  // ── Zone Handlers ──

  const openAddZoneModal = () => {
    setZoneForm(EMPTY_ZONE_FORM);
    setZoneFormErrors({});
    setEditingZoneId(null);
    setRegionInput("");
    setZoneModalOpen(true);
  };

  const openEditZoneModal = (zone: ShippingZone) => {
    setZoneForm({
      name: zone.name,
      regions: zone.regions.split(", "),
      fee: String(zone.fee),
      estimatedDays: zone.estimatedDays,
      status: zone.status,
      freeThreshold: String(zone.freeThreshold),
      zoneType: zone.zoneType,
    });
    setZoneFormErrors({});
    setEditingZoneId(zone.id);
    setRegionInput("");
    setZoneModalOpen(true);
  };

  const closeZoneModal = () => {
    setZoneModalOpen(false);
    setZoneForm(EMPTY_ZONE_FORM);
    setZoneFormErrors({});
    setEditingZoneId(null);
    setRegionInput("");
  };

  const validateZoneForm = (): boolean => {
    const errors: ZoneFormErrors = {};
    if (!zoneForm.name.trim()) errors.name = "Zone name is required";
    if (zoneForm.regions.length === 0) errors.regions = "Add at least one region";
    if (!zoneForm.fee || Number(zoneForm.fee) <= 0) errors.fee = "Enter a valid shipping fee";
    if (!zoneForm.estimatedDays.trim()) errors.estimatedDays = "Estimated delivery time is required";
    setZoneFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => setZoneFormErrors({}), 2000);
      return false;
    }
    return true;
  };

  const saveZone = async () => {
    if (!validateZoneForm()) return;
    try {
      if (editingZoneId) {
        const updated = await shippingService.updateZone(Number(editingZoneId), {
          name: zoneForm.name.trim(),
          regions: zoneForm.regions.join(", "),
          fee: Number(zoneForm.fee),
          estimatedDays: zoneForm.estimatedDays.trim(),
          status: zoneForm.status === "active" ? "ACTIVE" : "INACTIVE" as any,
          freeThreshold: Number(zoneForm.freeThreshold) || 0,
          zoneType: (zoneForm.zoneType.toUpperCase()) as any,
        });
        setZones((prev) =>
          prev.map((z) =>
            z.id === editingZoneId
              ? { id: String(updated.id), name: updated.name, regions: updated.regions, fee: updated.fee, estimatedDays: updated.estimatedDays, status: updated.status === "ACTIVE" ? "active" : "inactive", freeThreshold: updated.freeThreshold, zoneType: (updated.zoneType.toLowerCase()) as any }
              : z
          )
        );
        showToast("Shipping zone updated!", "success");
      } else {
        const created = await shippingService.createZone({
          name: zoneForm.name.trim(),
          regions: zoneForm.regions.join(", "),
          fee: Number(zoneForm.fee),
          estimatedDays: zoneForm.estimatedDays.trim(),
          status: zoneForm.status === "active" ? "ACTIVE" : "INACTIVE",
          freeThreshold: Number(zoneForm.freeThreshold) || 0,
          zoneType: zoneForm.zoneType.toUpperCase() as "LOCAL" | "REGIONAL" | "INTERNATIONAL",
        });
        setZones((prev) => [...prev, { id: String(created.id), name: created.name, regions: created.regions, fee: created.fee, estimatedDays: created.estimatedDays, status: created.status === "ACTIVE" ? "active" : "inactive", freeThreshold: created.freeThreshold, zoneType: (created.zoneType.toLowerCase()) as any }]);
        showToast("Shipping zone added!", "success");
      }
      closeZoneModal();
      markUnsaved();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save shipping zone", "error");
    }
  };

  const requestDeleteZone = (id: string) => setConfirmDeleteId(id);

  const confirmDeleteZone = async () => {
    if (confirmDeleteId) {
      try {
        await shippingService.deleteZone(Number(confirmDeleteId));
        setZones((prev) => prev.filter((z) => z.id !== confirmDeleteId));
        showToast("Shipping zone deleted", "success");
        markUnsaved();
      } catch (err: any) {
        showToast(err?.response?.data?.message || "Failed to delete shipping zone", "error");
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const cancelDeleteZone = () => setConfirmDeleteId(null);

  // ── Region Tag Input Handlers ──

  const addRegion = (region: string) => {
    const trimmed = region.trim();
    if (trimmed && !zoneForm.regions.includes(trimmed)) {
      setZoneForm((prev) => ({ ...prev, regions: [...prev.regions, trimmed] }));
    }
    setRegionInput("");
  };

  const removeRegion = (index: number) => {
    setZoneForm((prev) => ({ ...prev, regions: prev.regions.filter((_, i) => i !== index) }));
  };

  const handleRegionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRegion(regionInput);
    }
    if (e.key === "Backspace" && !regionInput && zoneForm.regions.length > 0) {
      removeRegion(zoneForm.regions.length - 1);
    }
  };

  // ── Toast ──
  const renderToast = () => {
    if (!toast) return null;
    return (
      <div className={`settings-toast settings-toast--${toast.type}`}>
        {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
        <span>{toast.message}</span>
        <button className="settings-toast-close" onClick={() => setToast(null)}>&times;</button>
      </div>
    );
  };

  // ── Stats Banner ──
  const renderStatsBanner = () => (
    <div className="settings-stats-banner">
      <div className="settings-stat-item settings-stat-item--general">
        <div className="settings-stat-icon"><FaStore /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{Object.keys(INITIAL_GENERAL).length}</span>
          <span className="settings-stat-label">General Fields</span>
        </div>
      </div>
      <div className="settings-stat-item settings-stat-item--appearance">
        <div className="settings-stat-icon"><FaPalette /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{colors.length + 1}</span>
          <span className="settings-stat-label">Theme Settings</span>
        </div>
      </div>
      <div className="settings-stat-item settings-stat-item--shipping">
        <div className="settings-stat-icon"><FaTruck /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{zones.length}</span>
          <span className="settings-stat-label">Shipping Zones</span>
        </div>
      </div>
      <div className="settings-stat-item settings-stat-item--payment">
        <div className="settings-stat-icon"><FaCreditCard /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{paymentMethods.filter((p) => p.enabled).length}/{paymentMethods.length}</span>
          <span className="settings-stat-label">Active Payments</span>
        </div>
      </div>
      <div className="settings-stat-item settings-stat-item--notifications">
        <div className="settings-stat-icon"><FaBell /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{notifications.filter((n) => n.enabled).length}/{notifications.length}</span>
          <span className="settings-stat-label">Active Alerts</span>
        </div>
      </div>
      <div className="settings-stat-item settings-stat-item--seo">
        <div className="settings-stat-icon"><FaSearchPlus /></div>
        <div className="settings-stat-info">
          <span className="settings-stat-value">{seo.maintenanceMode ? "ON" : "OFF"}</span>
          <span className="settings-stat-label">Maintenance</span>
        </div>
      </div>
    </div>
  );

  // ── General Tab ──
  const renderGeneral = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaStore /> Store Information</h3>
        <p className="settings-section-desc">Update your store details and contact information.</p>
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-form-label">Store Name <span className="required">*</span></label>
            <input className="settings-form-input" value={general.storeName} onChange={(e) => handleGeneralChange("storeName", e.target.value)} placeholder="Your store name" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Tagline</label>
            <input className="settings-form-input" value={general.tagline} onChange={(e) => handleGeneralChange("tagline", e.target.value)} placeholder="Store tagline" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Support Email <span className="required">*</span></label>
            <input className="settings-form-input" type="email" value={general.supportEmail} onChange={(e) => handleGeneralChange("supportEmail", e.target.value)} placeholder="support@example.com" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Support Phone <span className="required">*</span></label>
            <input className="settings-form-input" value={general.supportPhone} onChange={(e) => handleGeneralChange("supportPhone", e.target.value)} placeholder="+254 XXX XXX XXX" />
          </div>
          <div className="settings-form-group settings-form-group--full">
            <label className="settings-form-label">Address</label>
            <input className="settings-form-input" value={general.address} onChange={(e) => handleGeneralChange("address", e.target.value)} placeholder="Store address" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Currency</label>
            <select className="settings-form-input settings-form-input--select" value={general.currency} onChange={(e) => handleGeneralChange("currency", e.target.value)}>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Timezone</label>
            <select className="settings-form-input settings-form-input--select" value={general.timezone} onChange={(e) => handleGeneralChange("timezone", e.target.value)}>
              <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
              <option value="Africa/Lagos">Africa/Lagos (UTC+1)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Appearance Tab ──
  const renderAppearance = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaImage /> Store Logo & Favicon</h3>
        <p className="settings-section-desc">Upload your store logo and browser tab icon.</p>
        <div className="settings-upload-grid">
          <div className="settings-logo-upload" onClick={() => fileInputRef.current?.click()}>
            <div className="settings-logo-preview">
              {logoPreview ? <img src={logoPreview} alt="Logo" /> : <div className="settings-logo-placeholder"><FaImage /></div>}
            </div>
            <div className="settings-logo-info">
              <span className="settings-logo-title">Store Logo</span>
              <p className="settings-logo-hint">Recommended: 200x200px PNG or SVG</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
          </div>
          <div className="settings-logo-upload" onClick={() => faviconInputRef.current?.click()}>
            <div className="settings-logo-preview settings-logo-preview--favicon">
              {faviconPreview ? <img src={faviconPreview} alt="Favicon" /> : <div className="settings-logo-placeholder"><FaLaptop /></div>}
            </div>
            <div className="settings-logo-info">
              <span className="settings-logo-title">Favicon</span>
              <p className="settings-logo-hint">Recommended: 32x32px ICO or PNG</p>
            </div>
            <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconChange} style={{ display: "none" }} />
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3 className="settings-section-title"><FaPalette /> Theme Colors</h3>
        <p className="settings-section-desc">Customize your store's color scheme. Changes reflect in the preview panel.</p>
        {colors.map((c) => (
          <div className="settings-color-row" key={c.id}>
            <div className="settings-color-info">
              <span className="settings-color-label">{c.label}</span>
              <p className="settings-color-desc">{c.description}</p>
            </div>
            <div className="settings-color-input-wrapper">
              <input type="color" className="settings-color-picker" value={c.color} onChange={(e) => handleColorChange(c.id, e.target.value)} />
              <span className="settings-color-hex">{c.color}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="settings-section">
        <div className="settings-toggle-row">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label"><FaMoon style={{ marginRight: 6 }} />Dark Mode</span>
            <p className="settings-toggle-desc">Enable dark mode for the store frontend.</p>
          </div>
          <Toggle id="dark-mode" checked={darkMode} onChange={() => { setDarkMode(!darkMode); markUnsaved(); }} />
        </div>
      </div>
    </div>
  );

  // ── Social Media Tab ──
  const renderSocial = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaGlobe /> Social Media Links</h3>
        <p className="settings-section-desc">Connect your store to your social media profiles.</p>
        <div className="settings-social-grid">
          {[
            { key: "facebook" as const, icon: <FaFacebook />, placeholder: "https://facebook.com/yourpage", cls: "facebook" },
            { key: "twitter" as const, icon: <FaTwitter />, placeholder: "https://twitter.com/yourhandle", cls: "twitter" },
            { key: "instagram" as const, icon: <FaInstagram />, placeholder: "https://instagram.com/youraccount", cls: "instagram" },
            { key: "tiktok" as const, icon: <FaTiktok />, placeholder: "https://tiktok.com/@youraccount", cls: "tiktok" },
            { key: "youtube" as const, icon: <FaYoutube />, placeholder: "https://youtube.com/@yourchannel", cls: "youtube" },
            { key: "linkedin" as const, icon: <FaLinkedin />, placeholder: "https://linkedin.com/company/yourpage", cls: "linkedin" },
          ].map(({ key, icon, placeholder, cls }) => (
            <div className="settings-social-input-group" key={key}>
              <div className={`settings-social-icon-wrapper settings-social-icon-wrapper--${cls}`}>{icon}</div>
              <input className="settings-social-input" value={socialLinks[key]} onChange={(e) => handleSocialChange(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Shipping Tab ──
  const renderShipping = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaShippingFast /> Shipping Settings</h3>
        <p className="settings-section-desc">Configure default fees and free delivery thresholds.</p>
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-form-label">Default Shipping Fee (KES)</label>
            <input className="settings-form-input" type="number" value={shipping.defaultFee} onChange={(e) => { setShipping((p) => ({ ...p, defaultFee: Number(e.target.value) })); markUnsaved(); }} />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Free Shipping Threshold (KES)</label>
            <input className="settings-form-input" type="number" value={shipping.freeThreshold} onChange={(e) => { setShipping((p) => ({ ...p, freeThreshold: Number(e.target.value) })); markUnsaved(); }} />
            <span className="settings-form-hint">Orders above this amount get free shipping</span>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3 className="settings-section-title"><FaGlobeAfrica /> Shipping Zones</h3>
        <p className="settings-section-desc">Manage shipping regions and rates.</p>
        {zones.length === 0 ? (
          <div className="settings-empty-state">
            <div className="settings-empty-icon"><FaBoxOpen /></div>
            <h4 className="settings-empty-title">No Shipping Zones Yet</h4>
            <p className="settings-empty-desc">Add your first shipping zone to start configuring delivery regions and rates for your customers.</p>
            <button className="settings-btn settings-btn--primary settings-btn--sm" onClick={openAddZoneModal}><FaPlus /> Add Your First Zone</button>
          </div>
        ) : (
          <div className="settings-zone-list">
            {zones.map((zone) => (
              <div className={`settings-zone-card ${zone.status === "inactive" ? "settings-zone-card--inactive" : ""}`} key={zone.id}>
                <div className="settings-zone-header">
                  <span className="settings-zone-name">
                    <FaMapPin /> {zone.name}
                    <span className={`settings-zone-badge settings-zone-badge--${zone.status}`}>{zone.status}</span>
                    <span className="settings-zone-type-tag">{zone.zoneType}</span>
                  </span>
                  <div className="settings-zone-actions">
                    <button className="settings-zone-btn settings-zone-btn--edit" aria-label="Edit" onClick={() => openEditZoneModal(zone)}><FaEdit /></button>
                    <button className="settings-zone-btn settings-zone-btn--delete" aria-label="Delete" onClick={() => requestDeleteZone(zone.id)}><FaTrash /></button>
                  </div>
                </div>
                <div className="settings-zone-details">
                  <span className="settings-zone-detail"><FaMapMarkerAlt /> {zone.regions}</span>
                  <span className="settings-zone-detail"><FaMoneyCheckAlt /> KES {zone.fee.toLocaleString()}</span>
                  <span className="settings-zone-detail"><FaTruck /> {zone.estimatedDays}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {zones.length > 0 && (
          <button className="settings-btn settings-btn--secondary settings-btn--sm" style={{ marginTop: 16 }} onClick={openAddZoneModal}>
            <FaPlus /> Add Shipping Zone
          </button>
        )}
      </div>
    </div>
  );

  // ── Payment Tab ──
  const renderPayment = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaCreditCard /> Payment Methods</h3>
        <p className="settings-section-desc">Enable or disable payment methods for your store checkout.</p>
        <div className="settings-payment-grid">
          {paymentMethods.map((method) => (
            <div className={`settings-payment-card settings-payment-card--${method.type} ${!method.enabled ? "settings-payment-card--disabled" : ""}`} key={method.id}>
              <div className="settings-payment-icon">
                {method.type === "mpesa" && <FaMobileAlt />}
                {method.type === "card" && <FaCreditCard />}
                {method.type === "paypal" && <FaPaypal />}
                {method.type === "bank" && <FaUniversity />}
              </div>
              <div className="settings-payment-info">
                <span className="settings-payment-name">{method.name}</span>
                <p className="settings-payment-desc">{method.description}</p>
              </div>
              <Toggle id={`payment-${method.id}`} checked={method.enabled} onChange={() => togglePayment(method.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Notifications Tab ──
  const renderNotifications = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaBell /> Email Notifications</h3>
        <p className="settings-section-desc">Configure which events trigger email alerts to store admins.</p>
        {notifications.map((n) => (
          <div className="settings-toggle-row" key={n.id}>
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">{n.label}</span>
              <p className="settings-toggle-desc">{n.description}</p>
            </div>
            <Toggle id={`notif-${n.id}`} checked={n.enabled} onChange={() => toggleNotification(n.id)} />
          </div>
        ))}
      </div>
    </div>
  );

  // ── Email / SMTP Tab ──
  const renderEmail = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaServer /> SMTP Configuration</h3>
        <p className="settings-section-desc">Configure your email server for sending transactional emails.</p>
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-form-label">SMTP Host</label>
            <input className="settings-form-input" value={smtpConfig.host} onChange={(e) => handleSmtpChange("host", e.target.value)} placeholder="smtp.gmail.com" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">SMTP Port</label>
            <input className="settings-form-input" type="number" value={smtpConfig.port} onChange={(e) => handleSmtpChange("port", Number(e.target.value))} placeholder="587" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">SMTP Username</label>
            <input className="settings-form-input" value={smtpConfig.user} onChange={(e) => handleSmtpChange("user", e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">SMTP Password</label>
            <input className="settings-form-input" type="password" value={smtpConfig.pass} onChange={(e) => handleSmtpChange("pass", e.target.value)} placeholder="App password" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">From Email</label>
            <input className="settings-form-input" type="email" value={smtpConfig.fromEmail} onChange={(e) => handleSmtpChange("fromEmail", e.target.value)} placeholder="noreply@emaxstore.com" />
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">From Name</label>
            <input className="settings-form-input" value={smtpConfig.fromName} onChange={(e) => handleSmtpChange("fromName", e.target.value)} placeholder="E-Max Store" />
          </div>
        </div>
        <div className="settings-smtp-test-row">
          <span style={{ flex: 1, fontSize: 13, color: "#6b7280" }}>Test your SMTP configuration</span>
          <button className="settings-btn settings-btn--secondary settings-btn--sm" onClick={testSmtpConnection} disabled={smtpTestStatus === "testing"}>
            {smtpTestStatus === "testing" ? <FaSpinner className="settings-spin" /> : <FaEnvelope />}
            {smtpTestStatus === "testing" ? "Testing..." : "Test Connection"}
          </button>
          {smtpTestStatus === "success" && <span className="settings-smtp-status settings-smtp-status--success"><FaCheckCircle /> Connected</span>}
          {smtpTestStatus === "error" && <span className="settings-smtp-status settings-smtp-status--error"><FaTimesCircle /> Failed</span>}
        </div>
      </div>
    </div>
  );

  // ── Custom Code Tab ──
  const renderCode = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaCode /> Custom Code</h3>
        <p className="settings-section-desc">Add custom CSS, JavaScript, and HTML to your storefront.</p>

        <div className="settings-code-section">
          <label className="settings-code-label">
            Custom CSS
            <span className="settings-code-lang settings-code-lang--css">CSS</span>
          </label>
          <textarea className="settings-form-input settings-form-input--textarea settings-form-input--code" value={customCode.css} onChange={(e) => handleCodeChange("css", e.target.value)} placeholder="/* Add your custom CSS here */" rows={5} />
        </div>

        <div className="settings-code-section">
          <label className="settings-code-label">
            Custom JavaScript
            <span className="settings-code-lang settings-code-lang--js">JS</span>
          </label>
          <textarea className="settings-form-input settings-form-input--textarea settings-form-input--code" value={customCode.js} onChange={(e) => handleCodeChange("js", e.target.value)} placeholder="// Add your custom JavaScript here" rows={5} />
        </div>

        <div className="settings-code-section">
          <label className="settings-code-label">
            Header HTML
          <span className="settings-code-lang settings-code-lang--html">{'</>'}</span>
          </label>
          <textarea className="settings-form-input settings-form-input--textarea settings-form-input--code" value={customCode.header} onChange={(e) => handleCodeChange("header", e.target.value)} placeholder="<!-- Add code to inject in <head> -->" rows={4} />
          <span className="settings-form-hint">Injected just before the closing {'</head>'} tag</span>
        </div>

        <div className="settings-code-section">
          <label className="settings-code-label">
            Footer HTML
            <span className="settings-code-lang settings-code-lang--html">{'</>'}</span>
          </label>
          <textarea className="settings-form-input settings-form-input--textarea settings-form-input--code" value={customCode.footer} onChange={(e) => handleCodeChange("footer", e.target.value)} placeholder="<!-- Add code to inject before closing </body> -->" rows={4} />
          <span className="settings-form-hint">Injected just before the closing {'</body>'} tag</span>
        </div>
      </div>
    </div>
  );

  // ── SEO Tab ──
  const renderSeo = () => (
    <div className="settings-tab-content settings-tab-content--stagger">
      <div className="settings-section">
        <h3 className="settings-section-title"><FaSearchPlus /> SEO Settings</h3>
        <p className="settings-section-desc">Optimize your store for search engines.</p>
        <div className="settings-form-grid settings-form-grid--single">
          <div className="settings-form-group">
            <label className="settings-form-label">Meta Title</label>
            <input className="settings-form-input" value={seo.metaTitle} onChange={(e) => { setSeo((p) => ({ ...p, metaTitle: e.target.value })); markUnsaved(); }} placeholder="Store meta title" />
            <span className="settings-form-hint">Appears in browser tab and search results</span>
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label">Meta Description</label>
            <textarea className="settings-form-input settings-form-input--textarea" value={seo.metaDescription} onChange={(e) => { setSeo((p) => ({ ...p, metaDescription: e.target.value })); markUnsaved(); }} placeholder="Brief store description" rows={3} />
            <span className="settings-form-hint">{seo.metaDescription.length} characters</span>
          </div>
          <div className="settings-form-group">
            <label className="settings-form-label"><FaGoogle style={{ marginRight: 6 }} />Google Analytics ID</label>
            <input className="settings-form-input" value={seo.googleAnalyticsId} onChange={(e) => { setSeo((p) => ({ ...p, googleAnalyticsId: e.target.value })); markUnsaved(); }} placeholder="G-XXXXXXXXXX" />
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-toggle-row">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label"><FaWrench style={{ marginRight: 6 }} />Maintenance Mode</span>
            <p className="settings-toggle-desc">Enable maintenance mode to temporarily disable the store frontend.</p>
          </div>
          <Toggle id="maintenance-mode" checked={seo.maintenanceMode} onChange={() => { setSeo((p) => ({ ...p, maintenanceMode: !p.maintenanceMode })); markUnsaved(); }} />
        </div>
      </div>
    </div>
  );

  // ── Zone Modal ──
  const renderZoneModal = () => {
    if (!zoneModalOpen) return null;
    const isEditing = !!editingZoneId;
    const zoneTypeIcon = zoneForm.zoneType === "local" ? <FaCity /> : zoneForm.zoneType === "regional" ? <FaGlobe /> : <FaPlane />;

    return (
      <div className="settings-modal-overlay" onClick={closeZoneModal}>
        <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
          <div className="settings-modal-header">
            <div className="settings-modal-header-left">
              <div className="settings-modal-header-icon">{isEditing ? <FaEdit /> : <FaShippingFast />}</div>
              <div>
                <h3 className="settings-modal-title">{isEditing ? "Edit Shipping Zone" : "Add Shipping Zone"}</h3>
                <p className="settings-modal-subtitle">{isEditing ? "Update the shipping zone details below." : "Configure a new shipping region and rate."}</p>
              </div>
            </div>
            <button className="settings-modal-close" onClick={closeZoneModal} aria-label="Close"><FaTimes /></button>
          </div>
          <div className="settings-modal-body">
            <div className="settings-form-grid">
              <div className="settings-form-group settings-form-group--full">
                <label className="settings-form-label">Zone Name <span className="required">*</span></label>
                <input className={`settings-form-input ${zoneFormErrors.name ? "settings-form-input--error settings-form-input--shake" : ""}`} value={zoneForm.name} onChange={(e) => setZoneForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Nairobi Metro" />
                {zoneFormErrors.name && <span className="settings-form-error-msg"><FaExclamationTriangle /> {zoneFormErrors.name}</span>}
              </div>
              <div className="settings-form-group">
                <label className="settings-form-label">Zone Type</label>
                <div className="settings-zone-type-select-wrapper">
                  {zoneTypeIcon}
                  <select className="settings-form-input settings-form-input--select" value={zoneForm.zoneType} onChange={(e) => setZoneForm((p) => ({ ...p, zoneType: e.target.value as "local" | "regional" | "international" }))}>
                    <option value="local">Local</option>
                    <option value="regional">Regional</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              <div className="settings-form-group">
                <label className="settings-form-label">Status</label>
                <select className="settings-form-input settings-form-input--select" value={zoneForm.status} onChange={(e) => setZoneForm((p) => ({ ...p, status: e.target.value as "active" | "inactive" }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="settings-form-group settings-form-group--full">
                <label className="settings-form-label">Regions / Areas <span className="required">*</span></label>
                <div className={`settings-region-input-wrapper ${zoneFormErrors.regions ? "settings-region-input-wrapper--error" : ""}`} onClick={(e) => (e.target as HTMLElement).querySelector<HTMLInputElement>(".settings-region-input")?.focus()}>
                  {zoneForm.regions.map((region, idx) => (
                    <span className="settings-region-tag" key={idx}>{region}<button className="settings-region-tag-remove" onClick={() => removeRegion(idx)} type="button"><FaTimes /></button></span>
                  ))}
                  <input className="settings-region-input" value={regionInput} onChange={(e) => setRegionInput(e.target.value)} onKeyDown={handleRegionKeyDown} placeholder={zoneForm.regions.length === 0 ? "Type region and press Enter..." : "Add more..."} />
                </div>
                {zoneFormErrors.regions && <span className="settings-form-error-msg"><FaExclamationTriangle /> {zoneFormErrors.regions}</span>}
                <div className="settings-region-suggestions">
                  {REGION_SUGGESTIONS.filter((r) => !zoneForm.regions.includes(r) && r.toLowerCase().includes(regionInput.toLowerCase())).slice(0, 6).map((suggestion) => (
                    <button key={suggestion} className="settings-region-suggestion-btn" type="button" onClick={() => addRegion(suggestion)}>+ {suggestion}</button>
                  ))}
                </div>
              </div>
              <div className="settings-form-group">
                <label className="settings-form-label">Shipping Fee (KES) <span className="required">*</span></label>
                <input className={`settings-form-input ${zoneFormErrors.fee ? "settings-form-input--error settings-form-input--shake" : ""}`} type="number" min="0" value={zoneForm.fee} onChange={(e) => setZoneForm((p) => ({ ...p, fee: e.target.value }))} placeholder="e.g., 350" />
                {zoneFormErrors.fee && <span className="settings-form-error-msg"><FaExclamationTriangle /> {zoneFormErrors.fee}</span>}
              </div>
              <div className="settings-form-group">
                <label className="settings-form-label">Estimated Delivery <span className="required">*</span></label>
                <input className={`settings-form-input ${zoneFormErrors.estimatedDays ? "settings-form-input--error settings-form-input--shake" : ""}`} value={zoneForm.estimatedDays} onChange={(e) => setZoneForm((p) => ({ ...p, estimatedDays: e.target.value }))} placeholder="e.g., 2-3 days" />
                {zoneFormErrors.estimatedDays && <span className="settings-form-error-msg"><FaExclamationTriangle /> {zoneFormErrors.estimatedDays}</span>}
              </div>
              <div className="settings-form-group">
                <label className="settings-form-label">Free Shipping Threshold (KES)</label>
                <input className="settings-form-input" type="number" min="0" value={zoneForm.freeThreshold} onChange={(e) => setZoneForm((p) => ({ ...p, freeThreshold: e.target.value }))} placeholder="e.g., 2000" />
                <span className="settings-form-hint">Leave empty for no free shipping</span>
              </div>
            </div>
          </div>
          <div className="settings-modal-footer">
            <button className="settings-btn settings-btn--secondary settings-btn--sm" onClick={closeZoneModal}>Cancel</button>
            <button className="settings-btn settings-btn--primary settings-btn--sm" onClick={saveZone}><FaCheck /> {isEditing ? "Update Zone" : "Add Zone"}</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Confirm Delete Dialog ──
  const renderConfirmDelete = () => {
    if (!confirmDeleteId) return null;
    const zoneToDelete = zones.find((z) => z.id === confirmDeleteId);
    return (
      <div className="settings-confirm-overlay" onClick={cancelDeleteZone}>
        <div className="settings-confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="settings-confirm-icon"><FaExclamationTriangle /></div>
          <h3 className="settings-confirm-title">Delete Shipping Zone</h3>
          <p className="settings-confirm-desc">Are you sure you want to delete <strong>"{zoneToDelete?.name}"</strong>? This action cannot be undone.</p>
          <div className="settings-confirm-actions">
            <button className="settings-btn settings-btn--secondary settings-btn--sm" onClick={cancelDeleteZone}>Cancel</button>
            <button className="settings-btn settings-btn--danger-ghost settings-btn--sm" onClick={confirmDeleteZone}><FaTrash /> Delete Zone</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Tab Content Router ──
  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneral();
      case "appearance": return renderAppearance();
      case "social": return renderSocial();
      case "shipping": return renderShipping();
      case "payment": return renderPayment();
      case "notifications": return renderNotifications();
      case "email": return renderEmail();
      case "code": return renderCode();
      case "seo": return renderSeo();
      default: return renderGeneral();
    }
  };

  // ════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════
  return (
    <div className="settings-page">
      {renderToast()}
      {renderZoneModal()}
      {renderConfirmDelete()}

      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-left">
          <div className="settings-header-icon"><FaCog /></div>
          <div className="settings-header-info">
            <h1>{hasUnsaved ? <><span className="settings-unsaved-dot" />Store Settings (unsaved)</> : "Store Settings"}</h1>
            <p>Manage your store's configuration, appearance, shipping, payments, and more.</p>
          </div>
        </div>
        <div className="settings-header-actions">
          <div className="settings-export-import">
            <button className="settings-btn settings-btn--secondary settings-btn--sm" onClick={handleImport} title="Import settings"><FaUpload /> Import</button>
            <button className="settings-btn settings-btn--secondary settings-btn--sm" onClick={handleExport} title="Export settings"><FaDownload /> Export</button>
          </div>
          <button className="settings-btn settings-btn--secondary" onClick={handleReset} disabled={saving}><FaUndo /> Reset</button>
          <button className="settings-btn settings-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <FaSpinner className="settings-spin" /> : <FaSave />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsaved && (
        <div className="settings-unsaved-banner">
          <FaExclamationTriangle />
          <span>You have unsaved changes. <strong>Ctrl+S</strong> to save.</span>
        </div>
      )}

      {/* Stats Banner */}
      {renderStatsBanner()}

      {/* Settings Search Bar */}
      <div className="settings-search-bar">
        <span className="settings-search-icon"><FaSearch /></span>
        <input
          className="settings-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search settings... (e.g., 'shipping', 'colors', 'smtp')"
        />
        {searchQuery && (
          <button className="settings-search-clear" onClick={() => setSearchQuery("")}>
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {/* Settings Layout: Main + Preview */}
      <div className="settings-layout">
        <div className="settings-main-column">
          <div className="settings-card">
            {/* Tab Navigation */}
            <div className="settings-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? "settings-tab--active" : ""} ${searchedTab === tab.id ? "settings-tab--highlight" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                  title={tab.label}
                >
                  {tab.icon}
                  <span className="settings-tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Form Actions */}
            <div className="settings-form-actions">
              <button className="settings-btn settings-btn--secondary" onClick={handleReset} disabled={saving}><FaUndo /> Reset to Defaults</button>
              <button className="settings-btn settings-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? <FaSpinner className="settings-spin" /> : <FaSave />}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Live Theme Preview Column */}
        <div className="settings-preview-column">
          <h4 className="settings-section-title"><FaEye /> Live Preview</h4>
          <ThemePreview
            primaryColor={colors.find((c) => c.id === "primary")?.color || "#6366f1"}
            secondaryColor={colors.find((c) => c.id === "secondary")?.color || "#8b5cf6"}
            accentColor={colors.find((c) => c.id === "accent")?.color || "#f59e0b"}
            backgroundColor={colors.find((c) => c.id === "background")?.color || "#f5f6fa"}
            darkMode={darkMode}
            storeName={general.storeName}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;

