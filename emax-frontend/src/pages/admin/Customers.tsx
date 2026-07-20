import { useEffect, useState, useCallback } from "react";
import { FaSearch, FaUsers, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle, FaShoppingBag, FaStar, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";

import { adminService } from "../../services/adminService";
import type { Customer, CustomerPagination } from "../../services/adminService";

type SortField = "firstName" | "lastName" | "email" | "createdAt" | "isVerified";
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

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<CustomerPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await adminService.getCustomers(
        page,
        PAGE_SIZE,
        debouncedSearch || undefined,
        sortBy,
        sortOrder
      );

      setCustomers(result.customers);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

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

  return (
    <div className="admin-page customers-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <FaUsers className="page-header-icon" />
            Customers
          </h1>
          <p className="page-subtitle">
            {pagination
              ? `Manage ${pagination.total} registered customer${pagination.total !== 1 ? "s" : ""}.`
              : "Manage registered customers."}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <span className="toolbar-info">
          {loading ? "Loading..." : `${pagination?.total || 0} customer${pagination?.total !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-retry" onClick={loadCustomers}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="admin-table customers-table">
          <thead>
            <tr>
              <th className="th-name" onClick={() => handleSort("firstName")}>
                Customer {getSortIcon("firstName")}
              </th>
              <th className="th-contact" onClick={() => handleSort("email")}>
                Contact {getSortIcon("email")}
              </th>
              <th className="th-verified" onClick={() => handleSort("isVerified")}>
                Status {getSortIcon("isVerified")}
              </th>
              <th className="th-orders">Orders</th>
              <th className="th-reviews">Reviews</th>
              <th className="th-date" onClick={() => handleSort("createdAt")}>
                Joined {getSortIcon("createdAt")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="skeleton-row">
                  <td><div className="skeleton-cell skeleton-cell--name" /></td>
                  <td><div className="skeleton-cell skeleton-cell--contact" /></td>
                  <td><div className="skeleton-cell skeleton-cell--status" /></td>
                  <td><div className="skeleton-cell skeleton-cell--num" /></td>
                  <td><div className="skeleton-cell skeleton-cell--num" /></td>
                  <td><div className="skeleton-cell skeleton-cell--date" /></td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>
                  <div className="empty-state">
                    <FaUsers className="empty-icon" />
                    <h3>No customers found</h3>
                    <p>
                      {debouncedSearch
                        ? `No customers matching "${debouncedSearch}".`
                        : "No customers have registered yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`customer-row ${selectedCustomer?.id === customer.id ? "selected" : ""}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  {/* Name */}
                  <td className="td-name">
                    <div className="customer-avatar">
                      {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                    </div>
                    <div className="customer-name-info">
                      <span className="customer-fullname">
                        {customer.firstName} {customer.lastName}
                      </span>
                      <span className="customer-role">{customer.role}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="td-contact">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{customer.phone || "-"}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="td-verified">
                    {customer.isVerified ? (
                      <span className="badge badge-verified">
                        <FaCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-unverified">
                        <FaTimesCircle /> Unverified
                      </span>
                    )}
                  </td>

                  {/* Orders */}
                  <td className="td-orders">
                    <span className="stat-badge">
                      <FaShoppingBag /> {customer._count.orders}
                    </span>
                  </td>

                  {/* Reviews */}
                  <td className="td-reviews">
                    <span className="stat-badge">
                      <FaStar /> {customer._count.reviews}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="td-date">
                    <span className="date-text">{formatDate(customer.createdAt)}</span>
                  </td>
                </tr>
              ))
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

      {/* Selected Customer Quick Info */}
      {selectedCustomer && (
        <div className="customer-quick-view">
          <div className="quick-view-header">
            <div className="quick-view-avatar">
              {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
            </div>
            <div className="quick-view-info">
              <h3>{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
              <span className="quick-view-email">{selectedCustomer.email}</span>
            </div>
            <button className="quick-view-close" onClick={() => setSelectedCustomer(null)}>
              ✕
            </button>
          </div>
          <div className="quick-view-details">
            <div className="quick-view-item">
              <FaPhone /> <span>{selectedCustomer.phone || "No phone"}</span>
            </div>
            <div className="quick-view-item">
              <FaShoppingBag /> <span>{selectedCustomer._count.orders} orders</span>
            </div>
            <div className="quick-view-item">
              <FaStar /> <span>{selectedCustomer._count.reviews} reviews</span>
            </div>
            <div className="quick-view-item">
              <FaUser /> <span>Joined {formatDate(selectedCustomer.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

