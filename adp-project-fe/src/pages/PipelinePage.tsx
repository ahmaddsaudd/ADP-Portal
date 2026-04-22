import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/pipeline.css";

import type { PipelineBoardResponse, PipelineTab } from "../types/pipeline";
import { getPipelineBoard } from "../api/dashboard.api";

export default function PipelinePage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<PipelineTab>("UNAPPROVED");
  const [board, setBoard] = useState<PipelineBoardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getPipelineBoard(tab);
        setBoard(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load pipeline board");
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
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

        <div className="pipeline-page">
          <section className="pipeline-card pretty-card">
            <div className="pipeline-header">
              <div>
                <h1>Pipeline Board</h1>
                <p>Track schemes across the PC-1 and approval journey.</p>
              </div>

              <div className="pipeline-tabs">
                <button
                  className={tab === "UNAPPROVED" ? "pipeline-tab active" : "pipeline-tab"}
                  onClick={() => setTab("UNAPPROVED")}
                  type="button"
                >
                  Unapproved (PC-1)
                </button>

                <button
                  className={tab === "UNDER_REVISION" ? "pipeline-tab active" : "pipeline-tab"}
                  onClick={() => setTab("UNDER_REVISION")}
                  type="button"
                >
                  Under Revision
                </button>
              </div>
            </div>

            {loading ? (
              <div className="pipeline-state">Loading pipeline board...</div>
            ) : error ? (
              <div className="pipeline-state error">{error}</div>
            ) : !board ? (
              <div className="pipeline-state">No pipeline data found.</div>
            ) : (
              <div className="pipeline-board-scroll">
                <div className="pipeline-board">
                  {board.columns.map((column) => (
                    <div key={column.key} className="pipeline-column">
                      <div className="pipeline-column-header">
                        <h3>{column.title}</h3>
                        <span>{column.count}</span>
                      </div>

                      <div className="pipeline-column-body">
                        {column.items.length === 0 ? (
                          <div className="pipeline-empty">No schemes pending here</div>
                        ) : (
                          column.items.map((item) => (
                            <div
                              key={item.id}
                              className="pipeline-scheme-card"
                              onClick={() => navigate(`/pipeline/${item.id}`)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  navigate(`/pipeline/${item.id}`);
                                }
                              }}
                            >
                              <div className="pipeline-scheme-top">
                                <span className="pipeline-adp-no">{item.adpNo}</span>

                                {item.isStalled ? (
                                  <span className="pipeline-alert">!</span>
                                ) : null}
                              </div>

                              <h4>{item.schemeName}</h4>

                              <div className="pipeline-meta-row">
                                <span className="pipeline-pending-with">
                                  {item.pendingWith.replaceAll("_", " ")}
                                </span>
                              </div>

                              <div className="pipeline-meta-grid">
                                <div>
                                  <small>Approval</small>
                                  <p>{item.approvalStatus}</p>
                                </div>
                                <div>
                                  <small>Execution</small>
                                  <p>{item.executionStatus}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}