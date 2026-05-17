import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  createAdpSchemeCosting,
  getAdpSchemeById,
  updateAdpSchemeCosting,
} from "../services/adpSchemes.service";
import "../styles/dashboard.css";
import "../styles/adp-scheme-form.css";
import type { AdpSchemeCostingFormValues } from "../types/adpScheme.types";
import { DEFAULT_FINANCIAL_YEAR, FINANCIAL_YEARS } from "../constants/financialYears";

const defaultCostingForm: AdpSchemeCostingFormValues = {
  financialYear: "2025-2026",
  estimatedCostCap: "",
  estimatedCostRev: "",
  priorExpCap: "",
  priorExpRev: "",
  throwForwardCap: "",
  throwForwardRev: "",
  allocCfyCap: "",
  allocCfyRev: "",
  revAllocCfyCap: "",
  revAllocCfyRev: "",
  releasesCfyCap: "",
  releasesCfyRev: "",
  moduleACap: "",
  moduleARev: "",
  moduleBCap: "",
  moduleBRev: "",
};

export default function AdpSchemeCostingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schemeName, setSchemeName] = useState("");
  const [costingId, setCostingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdpSchemeCostingFormValues>(defaultCostingForm);
  const [loading, setLoading] = useState(true);
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
        setSchemeName(data.schemeName || "");

        const currentCosting =
          data.costings?.find((c) => c.financialYear === "2025-2026") ||
          data.costings?.[0];

        if (currentCosting) {
          setCostingId(currentCosting.id);
          setForm({
            financialYear: currentCosting.financialYear || "2025-2026",
            estimatedCostCap: currentCosting.estimatedCostCap || "",
            estimatedCostRev: currentCosting.estimatedCostRev || "",
            priorExpCap: currentCosting.priorExpCap || "",
            priorExpRev: currentCosting.priorExpRev || "",
            throwForwardCap: currentCosting.throwForwardCap || "",
            throwForwardRev: currentCosting.throwForwardRev || "",
            allocCfyCap: currentCosting.allocCfyCap || "",
            allocCfyRev: currentCosting.allocCfyRev || "",
            revAllocCfyCap: currentCosting.revAllocCfyCap || "",
            revAllocCfyRev: currentCosting.revAllocCfyRev || "",
            releasesCfyCap: currentCosting.releasesCfyCap || "",
            releasesCfyRev: currentCosting.releasesCfyRev || "",
            moduleACap: currentCosting.moduleACap || "",
            moduleARev: currentCosting.moduleARev || "",
            moduleBCap: currentCosting.moduleBCap || "",
            moduleBRev: currentCosting.moduleBRev || "",
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load costing");
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
    if (!id) return;

    try {
      setSaving(true);
      setError("");

      const payload: AdpSchemeCostingFormValues = {
        financialYear: form.financialYear,
        estimatedCostCap: form.estimatedCostCap ?? "",
        estimatedCostRev: form.estimatedCostRev ?? "",
        priorExpCap: form.priorExpCap ?? "",
        priorExpRev: form.priorExpRev ?? "",
        throwForwardCap: form.throwForwardCap ?? "",
        throwForwardRev: form.throwForwardRev ?? "",
        allocCfyCap: form.allocCfyCap ?? "",
        allocCfyRev: form.allocCfyRev ?? "",
        revAllocCfyCap: form.revAllocCfyCap ?? "",
        revAllocCfyRev: form.revAllocCfyRev ?? "",
        releasesCfyCap: form.releasesCfyCap ?? "",
        releasesCfyRev: form.releasesCfyRev ?? "",
        moduleACap: form.moduleACap ?? "",
        moduleARev: form.moduleARev ?? "",
        moduleBCap: form.moduleBCap ?? "",
        moduleBRev: form.moduleBRev ?? "",
      };

      if (costingId) {
        await updateAdpSchemeCosting(costingId, payload);
      } else {
        await createAdpSchemeCosting(id, payload);
      }

      navigate("/master-sheet");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save costing");
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
              <h1>Costing Information</h1>
              <p>{schemeName ? `Update costing for ${schemeName}.` : "Update scheme costing."}</p>
            </div>

            {loading ? (
              <div className="scheme-form-state">Loading costing...</div>
            ) : (
              <form onSubmit={handleSubmit} className="scheme-form">
                <div className="scheme-form-grid">
                  <div className="form-field form-field-wide">
                    <label>Financial Year</label>

                    <select
                      name="financialYear"
                      value={form.financialYear}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {FINANCIAL_YEARS.map((year) => (
                        <option key={year} value={year}>
                          FY {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Estimated Cost Capital</label>
                    <input name="estimatedCostCap" value={form.estimatedCostCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Estimated Cost Revenue</label>
                    <input name="estimatedCostRev" value={form.estimatedCostRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Prior Expenses Capital</label>
                    <input name="priorExpCap" value={form.priorExpCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Prior Expenses Revenue</label>
                    <input name="priorExpRev" value={form.priorExpRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Throw Forward Capital</label>
                    <input name="throwForwardCap" value={form.throwForwardCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Throw Forward Revenue</label>
                    <input name="throwForwardRev" value={form.throwForwardRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Current Alloc CFY Capital</label>
                    <input name="allocCfyCap" value={form.allocCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Current Alloc CFY Revenue</label>
                    <input name="allocCfyRev" value={form.allocCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Rev Current Alloc CFY Capital</label>
                    <input name="revAllocCfyCap" value={form.revAllocCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Rev Current Alloc CFY Revenue</label>
                    <input name="revAllocCfyRev" value={form.revAllocCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Releases CFY Capital</label>
                    <input name="releasesCfyCap" value={form.releasesCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Releases CFY Revenue</label>
                    <input name="releasesCfyRev" value={form.releasesCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Module A Capital</label>
                    <input name="moduleACap" value={form.moduleACap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Module A Revenue</label>
                    <input name="moduleARev" value={form.moduleARev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Module B Capital</label>
                    <input name="moduleBCap" value={form.moduleBCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Module B Revenue</label>
                    <input name="moduleBRev" value={form.moduleBRev} onChange={handleChange} />
                  </div>
                </div>

                {error ? <div className="scheme-form-error">{error}</div> : null}

                <div className="scheme-form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>

                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Costing"}
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