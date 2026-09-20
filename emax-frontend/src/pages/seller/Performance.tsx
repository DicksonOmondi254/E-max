import { useEffect, useState } from "react";
import { FaTrophy, FaStar, FaChartLine, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerPerformance } from "../../services/sellerService";

const Performance = () => {
  const [data, setData] = useState<SellerPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const perf = await sellerService.getPerformance();
        setData(perf);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="seller-page"><div className="s-loading-container"><p>Loading performance data...</p></div></div>;
  }

  const d = data || {
    sellerScore: 85, healthRating: "Good", totalSales: 0, totalRevenue: 0,
    cancellationRate: 0, returnRate: 0, averageRating: 0, responseRate: 0,
    responseTime: "N/A", salesReport: [], trafficReport: [],
  };

  const getHealthColor = (rating: string) => {
    switch (rating) {
      case "Excellent": return "#10b981";
      case "Good": return "#6366f1";
      case "Average": return "#f59e0b";
      case "Poor": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaTrophy className="s-page-icon" /> Performance</h1>
          <p className="s-page-subtitle">Track your seller score, health rating, and sales reports</p>
        </div>
      </div>

      {/* Seller Score Card */}
      <div className="s-score-card" style={{ borderColor: getHealthColor(d.healthRating) }}>
        <div className="s-score-circle" style={{ borderColor: getHealthColor(d.healthRating) }}>
          <span className="s-score-value">{d.sellerScore}</span>
          <span className="s-score-label">Score</span>
        </div>
        <div className="s-score-info">
          <h2>Seller Health: <span style={{ color: getHealthColor(d.healthRating) }}>{d.healthRating}</span></h2>
          <p>Based on your order fulfillment, customer satisfaction, and policy compliance</p>
          <div className="s-score-metrics">
            <div className="s-score-metric">
              <FaStar style={{ color: "#f59e0b" }} />
              <span>{d.averageRating.toFixed(1)} avg. rating</span>
            </div>
            <div className="s-score-metric">
              <FaCheckCircle style={{ color: "#10b981" }} />
              <span>{d.responseRate}% response rate</span>
            </div>
            <div className="s-score-metric">
              <FaClock style={{ color: "#6366f1" }} />
              <span>{d.responseTime} avg. response time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="s-stats-grid s-stats-sm">
        <div className="s-stat-mini s-stat-mini-total"><span>{d.totalSales}</span>Total Sales</div>
        <div className="s-stat-mini s-stat-mini-active"><span>KES {d.totalRevenue.toLocaleString()}</span>Revenue</div>
        <div className="s-stat-mini s-stat-mini-pending"><span>{d.cancellationRate}%</span>Cancellation Rate</div>
        <div className="s-stat-mini s-stat-mini-cancelled"><span>{d.returnRate}%</span>Return Rate</div>
      </div>

      {/* Sales Report Chart */}
      {d.salesReport.length > 0 && (
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaChartLine className="s-card-icon" />
              <h2>Sales Report</h2>
            </div>
          </div>
          <div className="s-chart-body">
            <div className="s-bar-chart s-bar-chart-horizontal">
              {d.salesReport.map((point: any, idx: number) => {
                const maxRevenue = Math.max(...d.salesReport.map((p: any) => p.revenue), 1);
                return (
                  <div key={idx} className="s-bar-item s-bar-item-h">
                    <div className="s-bar-label">{point.month}</div>
                    <div className="s-bar-track">
                      <div className="s-bar-fill s-bar-success" style={{ width: `${(point.revenue / maxRevenue) * 100}%` }}>
                        <span className="s-bar-tooltip">KES {point.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="s-bar-value">{point.sales}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Traffic Report */}
      {d.trafficReport.length > 0 && (
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaChartLine className="s-card-icon" />
              <h2>Traffic Report</h2>
            </div>
          </div>
          <div className="s-chart-body">
            <div className="s-bar-chart s-bar-chart-horizontal">
              {d.trafficReport.map((point: any, idx: number) => {
                const maxVisitors = Math.max(...d.trafficReport.map((p: any) => p.visitors), 1);
                return (
                  <div key={idx} className="s-bar-item s-bar-item-h">
                    <div className="s-bar-label">{point.month}</div>
                    <div className="s-bar-track">
                      <div className="s-bar-fill" style={{ width: `${(point.visitors / maxVisitors) * 100}%` }}>
                        <span className="s-bar-tooltip">{point.visitors} visitors</span>
                      </div>
                    </div>
                    <div className="s-bar-value">{point.pageViews}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Penalty Info */}
      <div className="s-alert s-alert-warning">
        <FaExclamationTriangle /> Maintain a low cancellation and return rate to keep your seller score high. High rates may result in account restrictions.
      </div>
    </div>
  );
};

export default Performance;
