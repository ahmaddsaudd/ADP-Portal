import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getGlobalMonthlyFinancials,
  getGlobalPhysicalProgress,
} from "../services/reports.service";
import type {
  GlobalMonthlyFinancialsResponse,
  GlobalPhysicalProgressResponse,
} from "../types/reports.types";
import "../styles/dashboard.css";
import "../styles/reports.css";

type ReportTab = "MONTHLY_FINANCIALS" | "PHYSICAL_PROGRESS";

function renderValue(value: number | null) {
  if (value === null || value === undefined) return "–";
  return value.toFixed(1);
}

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>("MONTHLY_FINANCIALS");
  const [monthlyData, setMonthlyData] = useState<GlobalMonthlyFinancialsResponse | null>(null);
  const [physicalData, setPhysicalData] = useState<GlobalPhysicalProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (tab === "MONTHLY_FINANCIALS") {
          const result = await getGlobalMonthlyFinancials();
          setMonthlyData(result);
        } else {
          const result = await getGlobalPhysicalProgress();
          setPhysicalData(result);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        <div className="dashboard-topbar">
          <div className="fy-select">FY 2025–26</div>

          <div className="dashboard-user-top">
            <h4>Minister</h4>
            <p>MOH OFFICE</p>
          </div>
        </div>

        <div className="reports-page">
          <section className="reports-card pretty-card">
            <div className="reports-header">
              <div>
                <h1>Global Reports</h1>
                <p>Consolidated views for all tracked schemes across the province.</p>
              </div>

              <div className="reports-tabs">
                <button
                  type="button"
                  className={tab === "MONTHLY_FINANCIALS" ? "reports-tab active" : "reports-tab"}
                  onClick={() => setTab("MONTHLY_FINANCIALS")}
                >
                  Monthly Financials
                </button>

                <button
                  type="button"
                  className={tab === "PHYSICAL_PROGRESS" ? "reports-tab active" : "reports-tab"}
                  onClick={() => setTab("PHYSICAL_PROGRESS")}
                >
                  Physical Progress
                </button>
              </div>
            </div>

            {loading ? (
              <div className="reports-state">Loading reports...</div>
            ) : error ? (
              <div className="reports-state error">{error}</div>
            ) : tab === "MONTHLY_FINANCIALS" ? (
              <div className="reports-table-scroll">
                <table className="reports-table financials-table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>ADP #</th>
                      <th rowSpan={2}>Scheme Name</th>
                      <th colSpan={2}>Jul</th>
                      <th colSpan={2}>Aug</th>
                      <th colSpan={2}>Sep</th>
                      <th colSpan={2}>Oct</th>
                      <th colSpan={2}>Nov</th>
                      <th colSpan={2}>Dec</th>
                      <th colSpan={2}>Jan</th>
                      <th colSpan={2}>Feb</th>
                      <th colSpan={2}>Mar</th>
                      <th colSpan={2}>Apr</th>
                      <th colSpan={2}>May</th>
                      <th colSpan={2}>Jun</th>
                      <th colSpan={2}>Total CFY</th>
                    </tr>
                    <tr>
                      {Array.from({ length: 13 }).flatMap((_, index) => [
                        <th key={`rel-${index}`}>Rel</th>,
                        <th key={`exp-${index}`}>Exp</th>,
                      ])}
                    </tr>
                  </thead>

                  <tbody>
                    {monthlyData?.rows.length ? (
                      monthlyData.rows.map((row) => (
                        <tr key={row.id}>
                          <td className="sticky-col adp-cell">{row.adpNo}</td>
                          <td className="sticky-col second">{row.schemeName}</td>

                          <td>{renderValue(row.monthly.jul.rel)}</td>
                          <td>{renderValue(row.monthly.jul.exp)}</td>

                          <td>{renderValue(row.monthly.aug.rel)}</td>
                          <td>{renderValue(row.monthly.aug.exp)}</td>

                          <td>{renderValue(row.monthly.sep.rel)}</td>
                          <td>{renderValue(row.monthly.sep.exp)}</td>

                          <td>{renderValue(row.monthly.oct.rel)}</td>
                          <td>{renderValue(row.monthly.oct.exp)}</td>

                          <td>{renderValue(row.monthly.nov.rel)}</td>
                          <td>{renderValue(row.monthly.nov.exp)}</td>

                          <td>{renderValue(row.monthly.dec.rel)}</td>
                          <td>{renderValue(row.monthly.dec.exp)}</td>

                          <td>{renderValue(row.monthly.jan.rel)}</td>
                          <td>{renderValue(row.monthly.jan.exp)}</td>

                          <td>{renderValue(row.monthly.feb.rel)}</td>
                          <td>{renderValue(row.monthly.feb.exp)}</td>

                          <td>{renderValue(row.monthly.mar.rel)}</td>
                          <td>{renderValue(row.monthly.mar.exp)}</td>

                          <td>{renderValue(row.monthly.apr.rel)}</td>
                          <td>{renderValue(row.monthly.apr.exp)}</td>

                          <td>{renderValue(row.monthly.may.rel)}</td>
                          <td>{renderValue(row.monthly.may.exp)}</td>

                          <td>{renderValue(row.monthly.jun.rel)}</td>
                          <td>{renderValue(row.monthly.jun.exp)}</td>

                          <td className="total-cell">{row.totalCfy.rel.toFixed(1)}</td>
                          <td className="total-cell">{row.totalCfy.exp.toFixed(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={28} className="reports-empty-row">
                          No financial report data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="reports-table-scroll">
                <table className="reports-table physical-table">
                  <thead>
                    <tr>
                      <th>ADP #</th>
                      <th>Scheme Name</th>
                      <th>Sector</th>
                      <th>Approval Status</th>
                      <th>Exec Status</th>
                      <th>% Complete</th>
                      <th>Latest Physical Remark</th>
                      <th>Updated By</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {physicalData?.rows.length ? (
                      physicalData.rows.map((row) => (
                        <tr key={row.id}>
                          <td className="adp-cell">{row.adpNo}</td>
                          <td>{row.schemeName}</td>
                          <td>{row.sector || "—"}</td>
                          <td>{row.approvalStatus}</td>
                          <td>
                            <span
                              className={
                                row.executionStatus === "CONTINUE"
                                  ? "status-pill continue"
                                  : row.executionStatus === "UNSATISFACTORY"
                                  ? "status-pill unsatisfactory"
                                  : "status-pill neutral"
                              }
                            >
                              {row.executionStatus}
                            </span>
                          </td>
                          <td>
                            <div className="progress-cell">
                              <div className="mini-progress-bar">
                                <div
                                  className={
                                    row.completionPercentage >= 70
                                      ? "mini-progress-fill green"
                                      : row.completionPercentage > 0
                                      ? "mini-progress-fill amber"
                                      : "mini-progress-fill gray"
                                  }
                                  style={{ width: `${row.completionPercentage}%` }}
                                />
                              </div>
                              <strong>{row.completionPercentage}%</strong>
                            </div>
                          </td>
                          <td className="remark-cell">
                            {row.latestPhysicalRemark || <span className="muted">No remarks</span>}
                          </td>
                          <td>{row.updatedBy || "—"}</td>
                          <td>{row.updatedAt || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="reports-empty-row">
                          No physical progress report data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}