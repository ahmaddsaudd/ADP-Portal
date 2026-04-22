import { useEffect, useState } from "react";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  getPipelineSchemeDetail,
  getSchemePhysicalProgress,
  getSchemeMonthlyFinancials,
  getSchemeGallery,
  uploadSchemeGalleryImage,
} from "../services/pipelineDetail.service";
import type {
  PipelineSchemeDetail,
  PhysicalProgressResponse,
  MonthlyFinancialsResponse,
  GalleryResponse,
} from "../types/pipelineDetail.types";
import "../styles/dashboard.css";
import "../styles/pipeline-detail.css";

type DetailTab =
  | "PIPELINE_STATUS"
  | "PHYSICAL_PROGRESS"
  | "MONTHLY_FINANCIALS"
  | "SITE_GALLERY";

export default function PipelineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<DetailTab>("PIPELINE_STATUS");
  const [scheme, setScheme] = useState<PipelineSchemeDetail | null>(null);
  const [physicalProgress, setPhysicalProgress] =
    useState<PhysicalProgressResponse | null>(null);
  const [monthlyFinancials, setMonthlyFinancials] =
    useState<MonthlyFinancialsResponse | null>(null);
  const [gallery, setGallery] = useState<GalleryResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageCaption, setSelectedImageCaption] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        const data = await getPipelineSchemeDetail(id);
        console.log("Fetched scheme detail:", data); // Debug log to verify scheme detail data
        setScheme(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load scheme detail");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchTabData = async () => {
      if (!id) return;

      try {
        setTabLoading(true);

        if (activeTab === "PHYSICAL_PROGRESS" && !physicalProgress) {
          const data = await getSchemePhysicalProgress(id);
          setPhysicalProgress(data);
        }

        if (activeTab === "MONTHLY_FINANCIALS" && !monthlyFinancials) {
          const data = await getSchemeMonthlyFinancials(id);
          setMonthlyFinancials(data);
        }

        if (activeTab === "SITE_GALLERY" && !gallery) {
          const data = await getSchemeGallery(id);
          console.log("Fetched gallery data:", data); // Debug log to verify gallery data
          setGallery(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tab data");
      } finally {
        setTabLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab, id, physicalProgress, monthlyFinancials, gallery]);

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!id) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError("");

      await uploadSchemeGalleryImage(id, {
        file,
        caption: file.name,
      });

      const refreshed = await getSchemeGallery(id);
      setGallery(refreshed);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-page">
          <div className="detail-state">Loading scheme detail...</div>
        </main>
      </div>
    );
  }

  if (error && !scheme) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-page">
          <div className="detail-state error">{error}</div>
        </main>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-page">
          <div className="detail-state error">Scheme not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        <div className="detail-page">
          <button className="detail-back-btn" onClick={() => navigate("/pipeline")}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          {error ? <div className="detail-inline-error">{error}</div> : null}

          <div className="detail-layout">
            <aside className="detail-left pretty-card">
              <div className="detail-left-inner">
                <div className="detail-adp-no">{scheme.adpNo}</div>
                <h1>{scheme.schemeName}</h1>

                <div className="detail-status-badge">{scheme.approvalStatus}</div>

                <div className="detail-info-grid">
                  <div><span>Sector</span><strong>{scheme.sector || "—"}</strong></div>
                  <div><span>District</span><strong>{scheme.district || "—"}</strong></div>
                  <div><span>Type</span><strong>{scheme.type || "—"}</strong></div>
                  <div><span>Sub-Type</span><strong>{scheme.subType || "—"}</strong></div>
                  <div><span>Exec. Status</span><strong>{scheme.executionStatus || "—"}</strong></div>
                  <div><span>Initial Apprv Date</span><strong>{scheme.initialApprovalDate || "—"}</strong></div>
                  <div><span>Target Date</span><strong>{scheme.targetDate || "—"}</strong></div>
                </div>

                <div className="detail-section">
                  <h3>Scope of Scheme</h3>
                  <div className="detail-note-box">
                    {scheme.scopeOfScheme || "No scope added yet."}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Financials (CFY) — Rs Millions</h3>
                  <div className="detail-financial-list">
                    <div><span>Estimated Cost</span><strong>Rs {Number(scheme.estimatedCost || 0).toFixed(2)}M</strong></div>
                    <div><span>Prior Exp (Last FY)</span><strong>Rs {Number(scheme.priorExpLastFy || 0).toFixed(2)}M</strong></div>
                    <div><span>Throw-forward</span><strong>Rs {Number(scheme.throwForward || 0).toFixed(2)}M</strong></div>
                    <div><span>Allocation CFY</span><strong>Rs {Number(scheme.allocationCfy || 0).toFixed(2)}M</strong></div>
                    <div><span>Rev Alloc CFY</span><strong>Rs {Number(scheme.revAllocationCfy || 0).toFixed(2)}M</strong></div>
                    <div><span>Releases CFY</span><strong>Rs {Number(scheme.releasesCfy || 0).toFixed(2)}M</strong></div>
                    <div><span>Expenditure CFY</span><strong>Rs {Number(scheme.expenditureCfy || 0).toFixed(2)}M</strong></div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="detail-right pretty-card">
              <div className="detail-tabs">
                <button
                  className={activeTab === "PIPELINE_STATUS" ? "detail-tab active" : "detail-tab"}
                  onClick={() => setActiveTab("PIPELINE_STATUS")}
                >
                  Pipeline & Status
                </button>

                <button
                  className={activeTab === "PHYSICAL_PROGRESS" ? "detail-tab active" : "detail-tab"}
                  onClick={() => setActiveTab("PHYSICAL_PROGRESS")}
                >
                  Physical Progress
                </button>

                <button
                  className={activeTab === "MONTHLY_FINANCIALS" ? "detail-tab active" : "detail-tab"}
                  onClick={() => setActiveTab("MONTHLY_FINANCIALS")}
                >
                  Monthly Financials
                </button>

                <button
                  className={activeTab === "SITE_GALLERY" ? "detail-tab active" : "detail-tab"}
                  onClick={() => setActiveTab("SITE_GALLERY")}
                >
                  Site Gallery
                </button>
              </div>

              <div className="detail-tab-content">
                {tabLoading ? <div className="detail-tab-state">Loading...</div> : null}

                {activeTab === "PIPELINE_STATUS" && (
                  <>
                    <div className="detail-warning-box">
                      <h4>Bottleneck / Status Note</h4>
                      <p>
                        <strong>Note:</strong> {scheme.statusNote || "No active bottleneck note available."}
                      </p>

                      <div className="detail-remark-row">
                        <input
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="Add remark..."
                        />
                        <button type="button">Post</button>
                      </div>
                    </div>

                    <div className="detail-stage-section">
                      <h3>Stage Progression</h3>

                      <div className="stage-list">
                        {scheme.pipelineStages.map((stage) => (
                          <div key={stage.key} className="stage-item">
                            <div
                              className={`stage-dot ${stage.status === "DONE"
                                ? "done"
                                : stage.status === "CURRENT"
                                  ? "current"
                                  : "upcoming"
                                }`}
                            />
                            <div
                              className={`stage-card ${stage.status === "CURRENT"
                                ? "current"
                                : stage.status === "DONE"
                                  ? "done"
                                  : "upcoming"
                                }`}
                            >
                              <h4>{stage.title}</h4>

                              {stage.status === "DONE" && stage.completedDate ? (
                                <p className="done-text">Completed: {stage.completedDate}</p>
                              ) : null}

                              {stage.status === "CURRENT" ? (
                                <>
                                  <p className="current-text">CURRENT PENDING STAGE</p>
                                  <div className="stage-action-badge">
                                    Action Required By: {stage.pendingWith?.replaceAll("_", " ")}
                                  </div>

                                  <div className="stage-actions">
                                    <button type="button" className="secondary">
                                      <Upload size={16} />
                                      <span>Attach Doc</span>
                                    </button>
                                    <button type="button" className="primary">
                                      Mark Complete</button>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "PHYSICAL_PROGRESS" && (
                  <div className="physical-progress-section">
                    <h2>Physical Progress Remarks Log</h2>
                    <p>Historical log of all on-ground progress updates.</p>

                    <div className="physical-progress-card">
                      <h4>Current Overall Completion</h4>
                      <div className="progress-row">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${physicalProgress?.overallCompletionPercentage || 0}%`,
                            }}
                          />
                        </div>
                        <strong>{physicalProgress?.overallCompletionPercentage || 0}%</strong>
                      </div>
                    </div>

                    {!physicalProgress?.remarks?.length ? (
                      <div className="detail-empty-text">No historical remarks available.</div>
                    ) : (
                      <div className="remarks-list">
                        {physicalProgress.remarks.map((item) => (
                          <div key={item.id} className="remark-card">
                            <p>{item.text}</p>
                            <small>{item.createdAt}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "MONTHLY_FINANCIALS" && (
                  <div className="monthly-financials-section">
                    <div className="monthly-financials-header">
                      <h2>Monthly Expenditure</h2>
                      <button type="button" className="export-btn">
                        <Download size={16} />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="financial-table-wrap">
                      <table className="financial-table">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Month</th>
                            <th colSpan={2}>Releases (Rs M)</th>
                            <th colSpan={2}>Expenditure (Rs M)</th>
                          </tr>
                          <tr>
                            <th>Cap</th>
                            <th>Rev</th>
                            <th>Cap</th>
                            <th>Rev</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(monthlyFinancials?.months || []).map((row) => (
                            <tr key={row.month}>
                              <td>{row.month}</td>
                              <td>{row.releaseCap}</td>
                              <td>{row.releaseRev}</td>
                              <td>{row.expenditureCap}</td>
                              <td>{row.expenditureRev}</td>
                            </tr>
                          ))}
                          <tr className="total-row">
                            <td>TOTAL</td>
                            <td>{monthlyFinancials?.totals.releaseCap || 0}</td>
                            <td>{monthlyFinancials?.totals.releaseRev || 0}</td>
                            <td>{monthlyFinancials?.totals.expenditureCap || 0}</td>
                            <td>{monthlyFinancials?.totals.expenditureRev || 0}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "SITE_GALLERY" && (
                  <div className="site-gallery-section">
                    <h2>Site Pictures</h2>

                    <div className="gallery-grid">
                      <label className="gallery-upload-card">
                        <Upload size={24} />
                        <span>{uploadingImage ? "Uploading..." : "Add Picture"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                          onChange={handleGalleryUpload}
                          hidden
                        />
                      </label>

                      {(gallery?.items || []).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="gallery-card"
                          onClick={() => {
                            setSelectedImage(item.imageUrl);
                            setSelectedImageCaption(item.caption || item.uploadedBy || "Site Picture");
                          }}
                        >
                          <img src={item.imageUrl} alt={item.caption || "Site"} />
                          <div className="gallery-overlay">
                            <strong>{item.caption || item.uploadedBy}</strong>
                            <small>{item.uploadedAt}</small>
                          </div>
                        </button>
                      ))}
                    </div>

                    {!gallery?.items?.length ? (
                      <div className="detail-empty-text gallery-empty-text">
                        No site pictures uploaded yet.
                      </div>
                    ) : null}

                    {selectedImage ? (
                      <div
                        className="image-preview-modal"
                        onClick={() => {
                          setSelectedImage(null);
                          setSelectedImageCaption(null);
                        }}
                      >
                        <div
                          className="image-preview-content"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="image-preview-close"
                            onClick={() => {
                              setSelectedImage(null);
                              setSelectedImageCaption(null);
                            }}
                          >
                            ×
                          </button>

                          <img
                            src={selectedImage}
                            alt={selectedImageCaption || "Preview"}
                            className="image-preview-full"
                          />

                          {selectedImageCaption ? (
                            <div className="image-preview-caption">{selectedImageCaption}</div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}