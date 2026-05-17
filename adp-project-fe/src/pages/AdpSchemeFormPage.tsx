import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  createAdpScheme,
  getAdpSchemeById,
  updateAdpScheme,
} from "../services/adpSchemes.service";
import "../styles/dashboard.css";
import "../styles/adp-scheme-form.css";
import type { AdpDistrict, AdpSchemeFormValues, AdpSubSector, AdpSubType } from "../types/adpScheme.types";
import { ADP_DISTRICTS, ADP_SUB_SECTORS, ADP_SUB_TYPES } from "../constants/adpOptions";
import { DEFAULT_FINANCIAL_YEAR, FINANCIAL_YEARS } from "../constants/financialYears";

const defaultForm: AdpSchemeFormValues = {
  adpNo: "",
  schemeName: "",
  district: "",
  sector: "",
  type: "",
  subType: "",
  approvalStatus: "",
  executionStatus: "",
  initialApprovalDate: "",
  targetDate: "",
};

export default function AdpSchemeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [form, setForm] = useState<AdpSchemeFormValues>(defaultForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(
    localStorage.getItem("selectedFinancialYear") || DEFAULT_FINANCIAL_YEAR
  );

  useEffect(() => {
    if (!id) return;

    const fetchScheme = async () => {
      try {
        setLoading(true);
        const data = await getAdpSchemeById(id);

        setForm({
          adpNo: data.adpNo || "",
          schemeName: data.schemeName || "",

          district: (data.district as AdpDistrict) || "",
          sector: (data.sector as AdpSubSector) || "",

          type: data.type || "",

          subType: (data.subType as AdpSubType) || "",

          approvalStatus: data.approvalStatus || "",
          executionStatus: data.executionStatus || "",
          initialApprovalDate: data.initialApprovalDate || "",
          targetDate: data.targetDate || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load scheme");
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload: AdpSchemeFormValues = {
        adpNo: form.adpNo,
        schemeName: form.schemeName,
        district: form.district ?? "",
        sector: form.sector ?? "",
        type: form.type ?? "",
        subType: form.subType ?? "",
        approvalStatus: form.approvalStatus ?? "",
        executionStatus: form.executionStatus ?? "",
        initialApprovalDate: form.initialApprovalDate ?? "",
        targetDate: form.targetDate ?? "",
      };

      if (isEditMode && id) {
        await updateAdpScheme(id, payload);
        navigate(`/adp-schemes/${id}/costing`);
      } else {
        const created = await createAdpScheme(payload);
        navigate(`/adp-schemes/${created.id}/costing`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save scheme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        <div className="dashboard-topbar">
          <select
            className="fy-select"
            value={selectedFinancialYear}
            onChange={(e) => {
              localStorage.setItem("selectedFinancialYear", e.target.value);
              setSelectedFinancialYear(e.target.value);
            }}
          >
            {FINANCIAL_YEARS.map((year) => (
              <option key={year} value={year}>
                FY {year}
              </option>
            ))}
          </select>

          <div className="dashboard-user-top">
            <h4>Minister</h4>
            <p>MOH OFFICE</p>
          </div>
        </div>

        <div className="scheme-form-page">
          <div className="scheme-form-card">
            <div className="scheme-form-header">
              <h1>{isEditMode ? "Edit Scheme" : "Create New Scheme"}</h1>
              <p>Save the scheme information, then continue to costing.</p>
            </div>

            {loading ? (
              <div className="scheme-form-state">Loading scheme...</div>
            ) : (
              <form onSubmit={handleSubmit} className="scheme-form">
                <div className="scheme-form-grid">
                  <div className="form-field">
                    <label>ADP No</label>
                    <input
                      name="adpNo"
                      value={form.adpNo}
                      onChange={handleChange}
                      placeholder="ADP-2025-001"
                      required
                    />
                  </div>

                  <div className="form-field form-field-wide">
                    <label>Scheme Name</label>
                    <input
                      name="schemeName"
                      value={form.schemeName}
                      onChange={handleChange}
                      placeholder="Construction of District Hospital Block A"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>District</label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                    >
                      <option value="">Select District</option>
                      {ADP_DISTRICTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Sub-sector</label>
                    <select
                      name="sector"
                      value={form.sector}
                      onChange={handleChange}
                    >
                      <option value="">Select Sub-sector</option>
                      {ADP_SUB_SECTORS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                      <option value="">Select type</option>
                      <option value="NEW">NEW</option>
                      <option value="ONGOING">ONGOING</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Sub-Type</label>
                    <select
                      name="subType"
                      value={form.subType}
                      onChange={handleChange}
                    >
                      <option value="">Select Sub-Type</option>
                      {ADP_SUB_TYPES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Approval Status</label>
                    <select
                      name="approvalStatus"
                      value={form.approvalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select status</option>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="UNDER_REVISION">UNDER_REVISION</option>
                      <option value="UNAPPROVED">UNAPPROVED</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Execution Status</label>
                    <select
                      name="executionStatus"
                      value={form.executionStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select status</option>
                      <option value="NOT_STARTED">NOT_STARTED</option>
                      <option value="CONTINUE">CONTINUE</option>
                      <option value="UNSATISFACTORY">UNSATISFACTORY</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Initial Approval Date</label>
                    <input
                      type="date"
                      name="initialApprovalDate"
                      value={form.initialApprovalDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label>Target Date</label>
                    <input
                      type="date"
                      name="targetDate"
                      value={form.targetDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error ? <div className="scheme-form-error">{error}</div> : null}

                <div className="scheme-form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("/master-sheet")}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Continue to Costing"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}