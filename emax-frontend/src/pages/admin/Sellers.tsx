import { useEffect, useState, useCallback } from "react";
import {
  FaStore,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEllipsisV,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaEnvelopeOpenText,
FaDownload,
  FaUser,
  FaShoppingBag,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";

import { adminService } from "../../services/adminService";
import type { Seller, SellerStats, SellerPagination } from "../../services/adminService";

type SortField = "firstName" | "email" | "createdAt" | "isActive" | "shopName";
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 15;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const parseLocation = (location: string | null): { city: string; region: string; country: string } | null => {
  if (!location) return null;
  try {
    return JSON.parse(location);
  } catch {
    return { city: location, region: "", country: "" };
  }
};

// ── Seller Quick View Sub-Component ──
const SellerQuickView = ({ seller, onClose }: { seller: Seller; onClose: () => void }) => {
  const loc = parseLocation(seller.location);
  return (
    <div className="seller-quick-view">
      <div className="quick-view-header">
        <div className="quick-view-avatar seller-qv-avatar">
          {seller.shopName
            ? seller.shopName.charAt(0).toUpperCase()
            : seller.firstName.charAt(0).toUpperCase()}
        </div>
        <div className="quick-view-info">
          <h3>{seller.shopName || `${seller.firstName} ${seller.lastName}`}</h3>
          <span className="quick-view-email">{seller.email}</span>
        </div>
        <button className="quick-view-close" onClick={onClose}>✕</button>
      </div>
      <div className="quick-view-details">
        <div className="quick-view-item">
          <FaUser /> <span>{seller.firstName} {seller.lastName}</span>
        </div>
        <div className="quick-view-item">
          <FaPhone /> <span>{seller.phone || "No phone"}</span>
        </div>
        <div className="quick-view-item">
          <FaBox /> <span>{seller._count.products} products listed</span>
        </div>
        <div className="quick-view-item">
          <FaShoppingBag /> <span>{seller._count.orders} orders</span>
        </div>
        <div className="quick-view-item">
          <FaMapMarkerAlt /> <span>{loc ? `${loc.city}${loc.country ? `, ${loc.country}` : ""}` : "No location set"}</span>
        </div>
        <div className="quick-view-item">
          <FaCalendarAlt /> <span>Joined {formatDate(seller.createdAt)}</span>
        </div>
      </div>
      <div className="quick-view-status">
        {seller.isActive ? (
          <span className="badge badge-seller-active"><FaCheckCircle /> Active</span>
        ) : (
          <span className="badge badge-seller-inactive"><FaTimesCircle /> Inactive</span>
        )}
      </div>
    </div>
  );
};

const Sellers = () => {
  // ── State ──
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [pagination, setPagination] = useState<SellerPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // '' = all, 'active', 'inactive'
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Selected seller for actions menu
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [actionMenuSellerId, setActionMenuSellerId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Deactivation modal
  const [deactivationModal, setDeactivationModal] = useState<{ seller: Seller; reason: string } | null>(null);

  // Trust Badges modal
  const TRUST_BADGE_TYPES = ["Local Dispatch", "E-maxCertified", "Brand Official"];
  const [trustBadgeModal, setTrustBadgeModal] = useState<{ seller: Seller; badges: string[]; saving: boolean } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const result = await adminService.getSellerStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err: any) {
      console.error("Failed to load seller stats:", err);
    }
  }, []);

  // Load sellers
  const loadSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await adminService.getSellers(
        page,
        PAGE_SIZE,
        debouncedSearch || undefined,
        statusFilter || undefined,
        locationFilter || undefined,
        dateFrom || undefined,
        dateTo || undefined,
        sortBy,
        sortOrder
      );

      setSellers(result.sellers);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load sellers.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, locationFilter, dateFrom, dateTo, sortBy, sortOrder]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setLocationFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

// Handle deactivation with reason
  const handleDeactivateWithReason = async () => {
    if (!deactivationModal) return;
    const { seller, reason } = deactivationModal;
    try {
      setDeactivationModal(null);
      const result = await adminService.deactivateSellerAccount(seller.id, reason);
      if (result.success) {
        setToast({
          type: "success",
          message: `${seller.shopName || seller.firstName + " " + seller.lastName} deactivated with reason.`,
        });
        loadSellers();
        loadStats();
      }
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.message || "Failed to deactivate seller account.",
      });
    }
    setActionMenuSellerId(null);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle seller status
  const handleToggleStatus = async (seller: Seller) => {
    try {
      const newStatus = !seller.isActive;
      const result = await adminService.updateSellerStatus(seller.id, newStatus);
      if (result.success) {
        setToast({
          type: "success",
          message: `${seller.shopName || seller.firstName + " " + seller.lastName} ${newStatus ? "activated" : "deactivated"} successfully.`,
        });
        loadSellers();
        loadStats();
      }
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.message || "Failed to update seller status.",
      });
    }
    setActionMenuSellerId(null);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <FaSort className="sort-icon" />;
    return sortOrder === "asc" ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />;
  };

  const totalPages = pagination?.totalPages || 1;

  // ── Render ──
  return (
    <div className="admin-page sellers-page">
      {/* Toast */}
      {toast && (
        <div className={`sellers-toast sellers-toast--${toast.type}`}>
          <span>{toast.message}</span>
          <button className="sellers-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <FaStore className="page-header-icon" />
            Sellers
          </h1>
          <p className="page-subtitle">
            {stats
              ? `Manage ${stats.totalSellers} seller${stats.totalSellers !== 1 ? "s" : ""} on the platform.`
              : "Manage sellers on the platform."}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="sellers-stats-grid">
          <div className="sellers-stat-card sellers-stat-card--total">
            <div className="sellers-stat-icon">
              <FaStore />
            </div>
            <div className="sellers-stat-info">
              <span className="sellers-stat-value">{stats.totalSellers}</span>
              <span className="sellers-stat-label">Total Sellers</span>
            </div>
          </div>

          <div className="sellers-stat-card sellers-stat-card--active">
            <div className="sellers-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="sellers-stat-info">
              <span className="sellers-stat-value">{stats.activeSellers}</span>
              <span className="sellers-stat-label">
                Active Sellers ({stats.activeSellersPercent}%)
              </span>
            </div>
          </div>

          <div className="sellers-stat-card sellers-stat-card--inactive">
            <div className="sellers-stat-icon">
              <FaTimesCircle />
            </div>
            <div className="sellers-stat-info">
              <span className="sellers-stat-value">{stats.inactiveSellers}</span>
              <span className="sellers-stat-label">
                Inactive/Suspended ({stats.inactiveSellersPercent}%)
              </span>
            </div>
          </div>

          <div className="sellers-stat-card sellers-stat-card--products">
            <div className="sellers-stat-icon">
              <FaBox />
            </div>
            <div className="sellers-stat-info">
              <span className="sellers-stat-value">{stats.totalProducts}</span>
              <span className="sellers-stat-label">Total Products Listed</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Control Bar */}
      <div className="sellers-filter-bar">
        <div className="sellers-filters-row">
          {/* Search */}
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, shop, email, or Store ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-select-wrapper">
            <select
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">All Locations</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Shenzhen">Shenzhen</option>
              <option value="International">International</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="filter-date-wrapper">
            <FaCalendarAlt className="date-icon" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="filter-date-input"
              placeholder="From"
            />
            <span className="date-separator">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="filter-date-input"
              placeholder="To"
            />
          </div>

          {/* Reset */}
          {(search || statusFilter || locationFilter || dateFrom || dateTo) && (
            <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>
        <div className="sellers-toolbar-info">
          {loading ? "Loading..." : `${pagination?.total || 0} seller${pagination?.total !== 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-retry" onClick={loadSellers}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="admin-table sellers-table">
          <thead>
            <tr>
              <th className="sellers-th-seller" onClick={() => handleSort("shopName")}>
                Seller & Shop {getSortIcon("shopName")}
              </th>
              <th className="sellers-th-status" onClick={() => handleSort("isActive")}>
                Status {getSortIcon("isActive")}
              </th>
              <th className="sellers-th-products">Products</th>
              <th className="sellers-th-location">Location</th>
              <th className="sellers-th-contact" onClick={() => handleSort("email")}>
                Contact & Details {getSortIcon("email")}
              </th>
              <th className="sellers-th-date" onClick={() => handleSort("createdAt")}>
                Joined {getSortIcon("createdAt")}
              </th>
              <th className="sellers-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="skeleton-row">
                  <td><div className="skeleton-cell skeleton-cell--seller" /></td>
                  <td><div className="skeleton-cell skeleton-cell--badge" /></td>
                  <td><div className="skeleton-cell skeleton-cell--num" /></td>
                  <td><div className="skeleton-cell skeleton-cell--location" /></td>
                  <td><div className="skeleton-cell skeleton-cell--contact" /></td>
                  <td><div className="skeleton-cell skeleton-cell--date" /></td>
                  <td><div className="skeleton-cell skeleton-cell--actions" /></td>
                </tr>
              ))
            ) : sellers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={7}>
                  <div className="empty-state">
                    <FaStore className="empty-icon" />
                    <h3>No sellers found</h3>
                    <p>
                      {debouncedSearch || statusFilter || locationFilter
                        ? `No sellers matching your filters.`
                        : "No sellers have registered yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sellers.map((seller) => {
                const loc = parseLocation(seller.location);
                return (
                  <tr
                    key={seller.id}
                    className={`seller-row ${selectedSellerId === seller.id ? "selected" : ""}`}
                    onClick={() => setSelectedSellerId(seller.id)}
                  >
                    {/* Seller & Shop Name */}
                    <td className="sellers-td-seller">
                      <div className="seller-avatar-group">
                        <div className="seller-avatar">
                          {seller.shopName
                            ? seller.shopName.charAt(0).toUpperCase()
                            : seller.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="seller-name-info">
                          <span className="seller-shop-name">
                            {seller.shopName || `${seller.firstName} ${seller.lastName}`}
                          </span>
                          <span className="seller-store-id">Store #{seller.id}</span>
                          {seller.shopName && (
                            <span className="seller-owner-name">
                              {seller.firstName} {seller.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="sellers-td-status">
                      {seller.isActive ? (
                        <span className="badge badge-seller-active">
                          <FaCheckCircle /> Active
                        </span>
                      ) : (
                        <span className="badge badge-seller-inactive">
                          <FaTimesCircle /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Products */}
                    <td className="sellers-td-products">
                      <span className="products-count-badge">
                        <FaBox /> {seller._count.products}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="sellers-td-location">
                      <div className="location-display">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>
                          {loc ? `${loc.city}${loc.country ? `, ${loc.country}` : ""}` : "—"}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="sellers-td-contact">
                      <div className="contact-detail-item">
                        <FaEnvelope className="contact-icon" />
                        <span>{seller.email}</span>
                      </div>
                      <div className="contact-detail-item">
                        <FaPhone className="contact-icon" />
                        <span>{seller.phone || "—"}</span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="sellers-td-date">
                      <span className="date-text">{formatDate(seller.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="sellers-td-actions">
                      <div className="sellers-actions-wrapper">
                        <button
                          className="sellers-action-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuSellerId(actionMenuSellerId === seller.id ? null : seller.id);
                          }}
                        >
                          <FaEllipsisV />
                        </button>

                        {actionMenuSellerId === seller.id && (
                          <div className="sellers-action-menu">
                            <button
                              className="sellers-action-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/products?seller=${seller.id}`, "_blank");
                                setActionMenuSellerId(null);
                              }}
                            >
                              <FaEye /> <span>View Store Front</span>
                            </button>

                            {seller.isActive && (
                              <button
                                className="sellers-action-item sellers-action-item--danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeactivationModal({ seller, reason: "" });
                                  setActionMenuSellerId(null);
                                }}
                              >
                                <FaTimesCircle /> <span>Deactivate with Reason</span>
                              </button>
                            )}

                            <button
                              className="sellers-action-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(seller);
                              }}
                            >
                              {seller.isActive ? (
                                <><FaToggleOff /> <span>Deactivate</span></>
                              ) : (
                                <><FaToggleOn /> <span>Activate</span></>
                              )}
                            </button>

                            <button
                              className="sellers-action-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${seller.email}`;
                                setActionMenuSellerId(null);
                              }}
                            >
                              <FaEnvelopeOpenText /> <span>Contact Seller</span>
                            </button>

                            <button
                              className="sellers-action-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                const csvData = [
                                  ["ID", "Shop Name", "Owner", "Email", "Phone", "Status", "Products", "Location", "Joined"],
                                  [seller.id, seller.shopName || "", `${seller.firstName} ${seller.lastName}`, seller.email, seller.phone, seller.isActive ? "Active" : "Inactive", seller._count.products, loc ? `${loc.city}, ${loc.country}` : "", seller.createdAt],
                                ].map(row => row.join(",")).join("\n");
                                const blob = new Blob([csvData], { type: "text/csv" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `seller-${seller.id}-data.csv`;
                                a.click();
                                URL.revokeObjectURL(url);
                                setActionMenuSellerId(null);
                              }}
                            >
                              <FaDownload /> <span>Export Data</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <FaChevronLeft /> Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = idx + 1;
              } else if (page <= 4) {
                pageNum = idx + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + idx;
              } else {
                pageNum = page - 3 + idx;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-btn"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

{/* Selected Seller Quick Info */}
      {selectedSellerId && sellers.find((s) => s.id === selectedSellerId) && (
        <SellerQuickView
          seller={sellers.find((s) => s.id === selectedSellerId)!}
          onClose={() => setSelectedSellerId(null)}
        />
      )}

      {/* Deactivation Reason Modal */}
      {deactivationModal && (
        <div className="modal-overlay" onClick={() => setDeactivationModal(null)}>
          <div className="modal-content deactivation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Deactivate Seller Account</h3>
              <button className="modal-close" onClick={() => setDeactivationModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                You are about to deactivate <strong>{deactivationModal.seller.shopName || deactivationModal.seller.firstName + " " + deactivationModal.seller.lastName}</strong> ({deactivationModal.seller.email}).
              </p>
              <div className="form-group">
                <label htmlFor="deactivation-reason">Reason for deactivation:</label>
                <textarea
                  id="deactivation-reason"
                  className="form-textarea"
                  placeholder="Enter the reason for deactivation (e.g., Policy violation, Fraud, Inactivity)..."
                  value={deactivationModal.reason}
                  onChange={(e) => setDeactivationModal({ ...deactivationModal, reason: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeactivationModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeactivateWithReason}
                disabled={!deactivationModal.reason.trim()}
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sellers;
