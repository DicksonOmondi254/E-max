import { useEffect, useState } from "react";
import { FaUndo, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerReturnRequest } from "../../services/sellerService";

const SellerReturns = () => {
  const [returns, setReturns] = useState<SellerReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await sellerService.getReturns();
        setReturns(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load return requests.");
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="seller-page"><div className="s-loading-container"><p>Loading returns...</p></div></div>;
  if (error) return <div className="seller-page"><div className="s-alert s-alert-danger">{error}</div></div>;

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaUndo className="s-page-icon" /> Returns & Refunds</h1>
          <p className="s-page-subtitle">Manage return requests from customers</p>
        </div>
      </div>

      <div className="s-table-wrapper">
        <table className="s-table s-table-full">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Product</th><th>Reason</th><th>Status</th><th>Refund</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {returns.length === 0 ? (
              <tr><td colSpan={8}><div className="s-empty-state"><p>No return requests.</p></div></td></tr>
            ) : (
              returns.map((r, i) => (
                <tr key={r.id || i}>
                  <td><span className="s-order-number">{r.orderNumber}</span></td>
                  <td>{r.customerName}</td>
                  <td>{r.productName}</td>
                  <td><span className="s-text-muted">{r.reason?.substring(0, 50)}...</span></td>
                  <td><span className={`s-badge ${r.status === "approved" ? "s-badge-delivered" : r.status === "rejected" ? "s-badge-cancelled" : "s-badge-pending"}`}>{r.status}</span></td>
                  <td><span className={`s-badge ${r.refundStatus === "completed" ? "s-badge-delivered" : "s-badge-pending"}`}>{r.refundStatus}</span></td>
                  <td><span className="s-date">{new Date(r.createdAt).toLocaleDateString()}</span></td>
                  <td>
                    <div className="s-action-btns">
                      <button className="s-action-btn s-action-view" title="View"><FaEye /></button>
                      {r.status === "pending" && (
                        <>
                          <button className="s-action-btn s-action-deliver" title="Approve"><FaCheckCircle /></button>
                          <button className="s-action-btn s-action-delete" title="Reject"><FaTimesCircle /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerReturns;
