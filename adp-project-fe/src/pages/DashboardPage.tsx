import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/dashboard/SummaryCard";
import BreakdownCard from "../components/dashboard/BreakdownCard";
import StalledSchemesCard from "../components/dashboard/StalledSchemesCard";
import { getDashboardData } from "../services/dashboard.service";
import type { DashboardResponse } from "../types/dashboard.types";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const result = await getDashboardData();
                setData(result);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString("en-PK", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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

                <div className="dashboard-body">
                    {loading ? (
                        <p>Loading dashboard...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data ? (
                        <>
                            <div className="page-header">
                                <h1>Portfolio Overview</h1>
                                <p>
                                    ADP 2025–26 · Last updated {formatDate(data.summary.lastUpdated)}
                                </p>
                            </div>

                            <div className="summary-grid">
                                <SummaryCard
                                    title="TOTAL SCHEMES"
                                    value={data.summary.totalSchemes}
                                    topBorderClass="border-slate"
                                />
                                <SummaryCard
                                    title="TOTAL ALLOC. (CFY)"
                                    value={formatCurrency(data.summary.totalAllocationCfy)}
                                    topBorderClass="border-green"
                                />
                                <SummaryCard
                                    title="TOTAL RELEASES (CFY)"
                                    value={formatCurrency(data.summary.totalReleasesCfy)}
                                    topBorderClass="border-purple"
                                />
                                <SummaryCard
                                    title="TOTAL EXPENDITURE (CFY)"
                                    value={formatCurrency(data.summary.totalExpenditureCfy)}
                                    topBorderClass="border-red"
                                />
                            </div>

                            <div className="dashboard-main-grid">
                                <div className="execution-card">
                                    <h2>Scheme Execution & Approval Breakdown</h2>
                                    <p>Click any card to automatically filter the Master Sheet.</p>

                                    <div className="breakdown-grid">
                                        <BreakdownCard
                                            title="Approved"
                                            total={data.breakdown.approved.total}
                                            variant="approved"
                                            onClick={() => navigate("/master-sheet?status=APPROVED")}
                                            rows={[
                                                {
                                                    label: "On Track / Continue",
                                                    count: data.breakdown.approved.onTrackOrContinue,
                                                },
                                                {
                                                    label: "Unsatisfactory",
                                                    count: data.breakdown.approved.unsatisfactory,
                                                },
                                            ]}
                                        />

                                        <BreakdownCard
                                            title="Under Revision"
                                            total={data.breakdown.underRevision.total}
                                            variant="revision"
                                            onClick={() => navigate("/master-sheet?status=UNDER_REVISION")}
                                            rows={[
                                                {
                                                    label: "Standard Processing",
                                                    count: data.breakdown.underRevision.standardProcessing,
                                                },
                                                {
                                                    label: "Unsatisfactory",
                                                    count: data.breakdown.underRevision.unsatisfactory,
                                                },
                                            ]}
                                        />

                                        <BreakdownCard
                                            title="Unapproved"
                                            total={data.breakdown.unapproved.total}
                                            variant="unapproved"
                                            onClick={() => navigate("/master-sheet?status=UNAPPROVED")}
                                            rows={[
                                                {
                                                    label: "Proposed Drafts",
                                                    count: data.breakdown.unapproved.proposedDrafts,
                                                },
                                                {
                                                    label: "Formulating PC-1",
                                                    count: data.breakdown.unapproved.formulatingPc1,
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <StalledSchemesCard schemes={data.stalledSchemes} />
                            </div>
                        </>
                    ) : null}
                </div>
            </main>
        </div>
    );
}