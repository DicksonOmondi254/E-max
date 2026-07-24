import { useEffect, useState, useCallback } from "react";
import {
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaStar,
  FaCity,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import CustomerShell from "./CustomerShell";
import {
  addressService,
  type Address,
  type CreateAddressPayload,
} from "../../services/addressService";

// ── Types ──
type ModalMode = "add" | "edit" | null;

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface DeleteState {
  show: boolean;
  addressId: number | null;
  loading: boolean;
}

let toastId = 0;

// ── Kenyan Counties ──
const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui",
  "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi City",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir",
  "West Pokot",
];

// ── Label Options ──
const LABEL_OPTIONS = [
  { value: "Home", icon: FaHome, color: "#6366f1" },
  { value: "Work", icon: FaBriefcase, color: "#f59e0b" },
  { value: "Other", icon: MdLocationOn, color: "#10b981" },
];

// ── Default Form State ──
const defaultForm: CreateAddressPayload = {
  label: "Home",
  firstName: "",
  lastName: "",
  phone: "",
  county: "",
  town: "",
  address: "",
  landmark: "",
  isDefault: false,
};

// ── Component ──
const CustomerAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<CreateAddressPayload>(defaultForm);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteState, setDeleteState] = useState<DeleteState>({
    show: false,
    addressId: null,
    loading: false,
  });

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toast Helpers ──
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Load Addresses ──
  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await addressService.getAll();
      setAddresses(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load addresses.");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // ── Open Add Modal ──
  const openAddModal = () => {
    setForm({ ...defaultForm, isDefault: addresses.length === 0 });
    setEditingAddress(null);
    setModalMode("add");
  };

  // ── Open Edit Modal ──
  const openEditModal = (address: Address) => {
    setForm({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      county: address.county,
      town: address.town,
      address: address.address,
      landmark: address.landmark || "",
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setModalMode("edit");
  };

  // ── Close Modal ──
  const closeModal = () => {
    setModalMode(null);
    setEditingAddress(null);
    setForm(defaultForm);
  };

  // ── Handle Form Change ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Validate Form ──
  const validateForm = (): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.county) return "Please select a county.";
    if (!form.town.trim()) return "Town is required.";
    if (!form.address.trim()) return "Address is required.";
    return null;
  };

  // ── Save (Create or Update) ──
  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "add") {
        const newAddress = await addressService.create(form);
        setAddresses((prev) => [newAddress, ...prev.filter((a) => !a.isDefault)]);
        showToast("Address added successfully!");
      } else if (modalMode === "edit" && editingAddress) {
        const updatedAddress = await addressService.update(editingAddress.id, form);
        setAddresses((prev) =>
          prev.map((a) => (a.id === updatedAddress.id ? updatedAddress : a))
        );
        showToast("Address updated successfully!");
      }
      closeModal();
    } catch (err: any) {
      showToast(err?.message || "Failed to save address.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Set Default ──
  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      showToast("Default address updated!");
    } catch (err: any) {
      showToast(err?.message || "Failed to set default address.", "error");
    }
  };

  // ── Delete ──
  const handleDeleteConfirm = async () => {
    if (!deleteState.addressId) return;
    setDeleteState((prev) => ({ ...prev, loading: true }));
    try {
      await addressService.delete(deleteState.addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== deleteState.addressId));
      setDeleteState({ show: false, addressId: null, loading: false });
      showToast("Address deleted successfully!");
    } catch (err: any) {
      setDeleteState({ show: false, addressId: null, loading: false });
      showToast(err?.message || "Failed to delete address.", "error");
    }
  };

  // ── Stats ──
  const stats = {
    total: addresses.length,
    defaultCount: addresses.filter((a) => a.isDefault).length,
  };

  // ── Get label icon ──
  const getLabelIcon = (label: string) => {
    const found = LABEL_OPTIONS.find((l) => l.value === label);
    return found || LABEL_OPTIONS[0];
  };

  // ── Render ──
  return (
    <CustomerShell title="My Addresses">
      {/* ── Toast Container ── */}
      <div className="addresses-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`addresses-toast addresses-toast--${t.type}`}>
            <span className="addresses-toast-icon">
              {t.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            </span>
            <p>{t.message}</p>
            <button className="addresses-toast-close" onClick={() => dismissToast(t.id)}>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      {/* ── Stats Bar ── */}
      {!loading && !error && (
        <div className="addresses-stats-bar fade-in">
          <div className="addresses-stat-card addresses-stat-card--total">
            <div className="addresses-stat-icon">
              <FaMapMarkerAlt />
            </div>
            <p className="addresses-stat-value">{stats.total}</p>
            <p className="addresses-stat-label">Total Addresses</p>
          </div>
          <div className="addresses-stat-card addresses-stat-card--default">
            <div className="addresses-stat-icon">
              <FaStar />
            </div>
            <p className="addresses-stat-value">{stats.defaultCount}</p>
            <p className="addresses-stat-label">Default Set</p>
          </div>
          <div className="addresses-stat-card addresses-stat-card--action">
            <button className="addresses-add-btn" onClick={openAddModal}>
              <FaPlus />
              <span>Add Address</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="addresses-skeleton fade-in">
          {[1, 2, 3].map((i) => (
            <div key={i} className="addresses-skeleton-card">
              <div className="addresses-skeleton-top">
                <div className="addresses-skeleton-line" style={{ width: "120px" }} />
                <div className="addresses-skeleton-line" style={{ width: "80px" }} />
              </div>
              <div className="addresses-skeleton-body">
                <div className="addresses-skeleton-line" style={{ width: "60%", marginBottom: 10 }} />
                <div className="addresses-skeleton-line" style={{ width: "40%", marginBottom: 10 }} />
                <div className="addresses-skeleton-line" style={{ width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <div className="addresses-error fade-in">
          <FaExclamationCircle className="addresses-error-icon" />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="addresses-retry-btn" onClick={loadAddresses}>
            <FaSpinner style={{ marginRight: 8 }} />
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && addresses.length === 0 && (
        <div className="addresses-empty fade-in">
          <div className="addresses-empty-icon">
            <MdLocationOn />
          </div>
          <h3>No addresses saved</h3>
          <p>
            You haven't added any delivery addresses yet. Add your first address to make checkout faster!
          </p>
          <button className="addresses-empty-btn" onClick={openAddModal}>
            <FaPlus />
            Add Your First Address
          </button>
        </div>
      )}

      {/* ── Address Grid ── */}
      {!loading && !error && addresses.length > 0 && (
        <div className="addresses-grid fade-in">
          {/* Add New Card */}
          <div className="addresses-add-card" onClick={openAddModal}>
            <div className="addresses-add-card-icon">
              <FaPlus />
            </div>
            <p>Add New Address</p>
          </div>

          {/* Address Cards */}
          {addresses.map((address, idx) => {
            const labelInfo = getLabelIcon(address.label);
            const LabelIcon = labelInfo.icon;

            return (
              <div
                key={address.id}
                className={`address-card ${address.isDefault ? "address-card--default" : ""}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="address-card-default-badge">
                    <FaStar />
                    <span>Default</span>
                  </div>
                )}

                {/* Label Badge */}
                <div
                  className="address-card-label-badge"
                  style={{ background: labelInfo.color + "18", color: labelInfo.color }}
                >
                  <LabelIcon />
                  <span>{address.label}</span>
                </div>

                {/* Name */}
                <div className="address-card-name">
                  <FaUser className="address-card-name-icon" />
                  <span>
                    {address.firstName} {address.lastName}
                  </span>
                </div>

                {/* Phone */}
                <div className="address-card-detail">
                  <FaPhone className="address-card-detail-icon" />
                  <span>{address.phone}</span>
                </div>

                {/* Location */}
                <div className="address-card-detail">
                  <FaCity className="address-card-detail-icon" />
                  <span>
                    {address.town}, {address.county}
                  </span>
                </div>

                {/* Full Address */}
                <div className="address-card-full-address">
                  <MdLocationOn className="address-card-detail-icon" />
                  <span>{address.address}</span>
                </div>

                {/* Landmark */}
                {address.landmark && (
                  <div className="address-card-landmark">
                    <span>📍 Near {address.landmark}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="address-card-actions">
                  <button
                    className="address-card-btn address-card-btn--edit"
                    onClick={() => openEditModal(address)}
                    title="Edit address"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>

                  {!address.isDefault && (
                    <button
                      className="address-card-btn address-card-btn--default-btn"
                      onClick={() => handleSetDefault(address.id)}
                      title="Set as default"
                    >
                      <FaStar />
                      <span>Set Default</span>
                    </button>
                  )}

                  <button
                    className="address-card-btn address-card-btn--delete"
                    onClick={() =>
                      setDeleteState({ show: true, addressId: address.id, loading: false })
                    }
                    title="Delete address"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modalMode && (
        <div className="addresses-modal-overlay" onClick={closeModal}>
          <div className="addresses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="addresses-modal-header">
              <h3>{modalMode === "add" ? "Add New Address" : "Edit Address"}</h3>
              <button className="addresses-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="addresses-modal-body">
              {/* Label Selection */}
              <div className="addresses-form-group">
                <label className="addresses-form-label">Address Label</label>
                <div className="addresses-label-options">
                  {LABEL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = form.label === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`addresses-label-option ${isActive ? "active" : ""}`}
                        style={{
                          borderColor: isActive ? opt.color : "#e2e8f0",
                          background: isActive ? opt.color + "12" : "transparent",
                        }}
                        onClick={() => setForm((prev) => ({ ...prev, label: opt.value }))}
                      >
                        <Icon style={{ color: isActive ? opt.color : "#94a3b8" }} />
                        <span style={{ color: isActive ? opt.color : "#64748b" }}>{opt.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Row */}
              <div className="addresses-form-row">
                <div className="addresses-form-group">
                  <label className="addresses-form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="addresses-form-input"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="addresses-form-group">
                  <label className="addresses-form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    className="addresses-form-input"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="addresses-form-group">
                <label className="addresses-form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="addresses-form-input"
                  placeholder="+254 7XX XXX XXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* County & Town */}
              <div className="addresses-form-row">
                <div className="addresses-form-group">
                  <label className="addresses-form-label">County *</label>
                  <select
                    name="county"
                    className="addresses-form-select"
                    value={form.county}
                    onChange={handleChange}
                  >
                    <option value="">Select County</option>
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="addresses-form-group">
                  <label className="addresses-form-label">Town / City *</label>
                  <input
                    type="text"
                    name="town"
                    className="addresses-form-input"
                    placeholder="e.g. Nairobi"
                    value={form.town}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="addresses-form-group">
                <label className="addresses-form-label">Full Address *</label>
                <textarea
                  name="address"
                  className="addresses-form-textarea"
                  placeholder="House number, street name, building, estate..."
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Landmark */}
              <div className="addresses-form-group">
                <label className="addresses-form-label">Nearest Landmark (optional)</label>
                <input
                  type="text"
                  name="landmark"
                  className="addresses-form-input"
                  placeholder="e.g. Near Total petrol station"
                  value={form.landmark}
                  onChange={handleChange}
                />
              </div>

              {/* Default Checkbox */}
              {!addresses.some((a) => a.isDefault) && (
                <div className="addresses-form-checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                  />
                  <label htmlFor="isDefault">Set as default address</label>
                </div>
              )}
            </div>

            <div className="addresses-modal-footer">
              <button className="addresses-modal-btn addresses-modal-btn--cancel" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button
                className="addresses-modal-btn addresses-modal-btn--save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="spinner" />
                    Saving...
                  </>
                ) : modalMode === "add" ? (
                  "Add Address"
                ) : (
                  "Update Address"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteState.show && (
        <div
          className="addresses-modal-overlay"
          onClick={() => setDeleteState({ show: false, addressId: null, loading: false })}
        >
          <div className="addresses-modal addresses-modal--small" onClick={(e) => e.stopPropagation()}>
            <div className="addresses-modal-icon">
              <FaExclamationCircle />
            </div>
            <h3>Delete Address</h3>
            <p>Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="addresses-modal-actions">
              <button
                className="addresses-modal-btn addresses-modal-btn--cancel"
                onClick={() => setDeleteState({ show: false, addressId: null, loading: false })}
                disabled={deleteState.loading}
              >
                Keep Address
              </button>
              <button
                className="addresses-modal-btn addresses-modal-btn--danger"
                onClick={handleDeleteConfirm}
                disabled={deleteState.loading}
              >
                {deleteState.loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
};

export default CustomerAddresses;

