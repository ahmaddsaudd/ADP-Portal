import { useEffect, useMemo, useState } from "react";
import { Search, Maximize2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MasterSheetTable from "../components/master-sheet/MasterSheetTable";
import { getAdpSchemes } from "../services/adpSchemes.service";
import type { AdpSchemeListItem } from "../types/adpScheme.types";
import "../styles/dashboard.css";
import "../styles/master-sheet.css";

const normalize = (value?: string) =>
  (value || "").toUpperCase().replace(/\s+/g, "_");

export default function MasterSheetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState<AdpSchemeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);

  const approvalStatusFilter = searchParams.get("approvalStatus") || "";
  const searchFilter = searchParams.get("search") || "";

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const result = await getAdpSchemes();
        setSchemes(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load schemes");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesApprovalStatus = approvalStatusFilter
        ? normalize(scheme.approvalStatus) === normalize(approvalStatusFilter) ||
        (approvalStatusFilter === "PROPOSED" && normalize(scheme.approvalStatus) === "UNAPPROVED")
        : true;

      const searchText =
        `${scheme.adpNo || ""} ${scheme.schemeName || ""}`.toLowerCase();

      const matchesSearch = searchFilter
        ? searchText.includes(searchFilter.toLowerCase())
        : true;

      return matchesApprovalStatus && matchesSearch;
    });
  }, [schemes, approvalStatusFilter, searchFilter]);

  const handleStatusChange = (value: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value) next.delete("approvalStatus");
    else next.set("approvalStatus", value);

    setSearchParams(next);
  };

  const handleSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value) next.delete("search");
    else next.set("search", value);

    setSearchParams(next);
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

        <div className="master-sheet-page">
          <section className="master-sheet-card pretty-card">
            <div className="master-sheet-header">
              <div>
                <h1>Master Tracker Sheet</h1>
              </div>

              <div className="master-sheet-actions">
                <select
                  className="master-filter"
                  value={approvalStatusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="UNDER_REVISION">Under Revision</option>
                  <option value="UNAPPROVED">Unapproved</option>
                  <option value="PROPOSED">Proposed</option>
                </select>

                <div className="master-search-wrap">
                  <Search size={16} />
                  <input
                    className="master-search"
                    placeholder="Search ADP # or name..."
                    value={searchFilter}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                <button
                  className="expand-btn"
                  type="button"
                  onClick={() => setIsFinancialExpanded((prev) => !prev)}
                >
                  <Maximize2 size={16} />
                  <span>{isFinancialExpanded ? "Collapse Cap/Rev" : "Expand Cap/Rev"}</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="master-state">Loading schemes...</div>
            ) : error ? (
              <div className="master-state error">{error}</div>
            ) : (
              <MasterSheetTable schemes={filteredSchemes}
                isFinancialExpanded={isFinancialExpanded}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}