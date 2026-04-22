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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const payload = {
        financialYear: form.financialYear,
        estimatedCostCap: form.estimatedCostCap || undefined,
        estimatedCostRev: form.estimatedCostRev || undefined,
        priorExpCap: form.priorExpCap || undefined,
        priorExpRev: form.priorExpRev || undefined,
        throwForwardCap: form.throwForwardCap || undefined,
        throwForwardRev: form.throwForwardRev || undefined,
        allocCfyCap: form.allocCfyCap || undefined,
        allocCfyRev: form.allocCfyRev || undefined,
        revAllocCfyCap: form.revAllocCfyCap || undefined,
        revAllocCfyRev: form.revAllocCfyRev || undefined,
        releasesCfyCap: form.releasesCfyCap || undefined,
        releasesCfyRev: form.releasesCfyRev || undefined,
        moduleACap: form.moduleACap || undefined,
        moduleARev: form.moduleARev || undefined,
        moduleBCap: form.moduleBCap || undefined,
        moduleBRev: form.moduleBRev || undefined,
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
          <div className="fy-select">FY 2025–26</div>

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
                    <input
                      name="financialYear"
                      value={form.financialYear}
                      onChange={handleChange}
                      placeholder="2025-2026"
                    />
                  </div>

                  <div className="form-field">
                    <label>Estimated Cost Cap</label>
                    <input name="estimatedCostCap" value={form.estimatedCostCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Estimated Cost Rev</label>
                    <input name="estimatedCostRev" value={form.estimatedCostRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Prior Exp Cap</label>
                    <input name="priorExpCap" value={form.priorExpCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Prior Exp Rev</label>
                    <input name="priorExpRev" value={form.priorExpRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Throw Forward Cap</label>
                    <input name="throwForwardCap" value={form.throwForwardCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Throw Forward Rev</label>
                    <input name="throwForwardRev" value={form.throwForwardRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Alloc CFY Cap</label>
                    <input name="allocCfyCap" value={form.allocCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Alloc CFY Rev</label>
                    <input name="allocCfyRev" value={form.allocCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Rev Alloc CFY Cap</label>
                    <input name="revAllocCfyCap" value={form.revAllocCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Rev Alloc CFY Rev</label>
                    <input name="revAllocCfyRev" value={form.revAllocCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Releases CFY Cap</label>
                    <input name="releasesCfyCap" value={form.releasesCfyCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Releases CFY Rev</label>
                    <input name="releasesCfyRev" value={form.releasesCfyRev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Module A Cap</label>
                    <input name="moduleACap" value={form.moduleACap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Module A Rev</label>
                    <input name="moduleARev" value={form.moduleARev} onChange={handleChange} />
                  </div>

                  <div className="form-field">
                    <label>Module B Cap</label>
                    <input name="moduleBCap" value={form.moduleBCap} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Module B Rev</label>
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