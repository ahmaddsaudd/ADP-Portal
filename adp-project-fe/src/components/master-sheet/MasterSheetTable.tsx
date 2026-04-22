import { useNavigate } from "react-router-dom";
import type { AdpSchemeListItem } from "../../types/adpScheme.types";
import StatusBadge from "./StatusBadge";

type Props = {
  schemes: AdpSchemeListItem[];
  isFinancialExpanded: boolean;
};

const toNum = (value?: number | string) => {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
};

const formatNumber = (value?: number | string) => {
  return toNum(value).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

type FinancialTripleProps = {
  cap?: number | string;
  rev?: number | string;
  total?: number | string;
  expanded: boolean;
  className?: string;
};

function FinancialTriple({
  cap,
  rev,
  total,
  expanded,
  className = "",
}: FinancialTripleProps) {
  if (!expanded) {
    return <td className={`num-cell ${className}`}>{formatNumber(total)}</td>;
  }

  return (
    <>
      <td className={`num-cell ${className}`}>{formatNumber(cap)}</td>
      <td className={`num-cell ${className}`}>{formatNumber(rev)}</td>
      <td className={`num-cell ${className}`}>{formatNumber(total)}</td>
    </>
  );
}

export default function MasterSheetTable({
  schemes,
  isFinancialExpanded,
}: Props) {
  const navigate = useNavigate();
  const span = isFinancialExpanded ? 3 : 1;

  return (
    <div className="master-sheet-table-wrapper">
      <table className="master-sheet-table">
        <thead>
          <tr>
            <th rowSpan={2}>ADP #</th>
            <th rowSpan={2}>Scheme Name</th>
            <th rowSpan={2}>District</th>
            <th rowSpan={2}>Sector</th>
            <th rowSpan={2}>Type</th>
            <th rowSpan={2}>Sub-Type</th>
            <th rowSpan={2}>Approval Status</th>
            <th rowSpan={2}>Execution Status</th>
            <th rowSpan={2}>Initial Apprv</th>
            <th rowSpan={2}>Target Date</th>

            <th colSpan={span} className="col-estimated">Estimated Cost</th>
            <th colSpan={span} className="col-prior">Prior Exp</th>
            <th colSpan={span} className="col-throw">Throw Forward</th>
            <th colSpan={span} className="col-alloc">Allocation Current FY</th>
            <th colSpan={span} className="col-revalloc">Rev. Alloc Current FY</th>
            <th colSpan={span} className="col-release">Releases Current FY</th>

            <th rowSpan={2}>Actions</th>
          </tr>

          <tr>
            {isFinancialExpanded ? (
              <>
                <th className="col-estimated">Cap</th>
                <th className="col-estimated">Rev</th>
                <th className="col-estimated">Total</th>

                <th className="col-prior">Cap</th>
                <th className="col-prior">Rev</th>
                <th className="col-prior">Total</th>

                <th className="col-throw">Cap</th>
                <th className="col-throw">Rev</th>
                <th className="col-throw">Total</th>

                <th className="col-alloc">Cap</th>
                <th className="col-alloc">Rev</th>
                <th className="col-alloc">Total</th>

                <th className="col-revalloc">Cap</th>
                <th className="col-revalloc">Rev</th>
                <th className="col-revalloc">Total</th>

                <th className="col-release">Cap</th>
                <th className="col-release">Rev</th>
                <th className="col-release">Total</th>
              </>
            ) : (
              <>
                <th className="col-estimated">Total</th>
                <th className="col-prior">Total</th>
                <th className="col-throw">Total</th>
                <th className="col-alloc">Total</th>
                <th className="col-revalloc">Total</th>
                <th className="col-release">Total</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {schemes.length === 0 ? (
            <tr>
              <td colSpan={11 + span * 6} className="empty-row">
                No schemes found.
              </td>
            </tr>
          ) : (
            schemes.map((scheme) => (
              <tr
                key={scheme.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  navigate(`/pipeline/${scheme.id}`);
                }}
                style={{ cursor: "pointer" }}
              >
                <td className="adp-cell">{scheme.adpNo}</td>
                <td className="scheme-name-cell">{scheme.schemeName}</td>
                <td>{scheme.district || "—"}</td>
                <td>{scheme.sector || "—"}</td>
                <td>{scheme.type || "—"}</td>
                <td>{scheme.subType || "—"}</td>
                <td>
                  <StatusBadge value={scheme.approvalStatus} type="approval" />
                </td>
                <td>
                  <StatusBadge value={scheme.executionStatus} type="execution" />
                </td>
                <td>{formatDate(scheme.initialApprovalDate)}</td>
                <td>{formatDate(scheme.targetDate)}</td>

                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.estimatedCostCap}
                  rev={scheme.estimatedCostRev}
                  total={scheme.estimatedCostTotal}
                  className="col-estimated"
                />
                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.priorExpCap}
                  rev={scheme.priorExpRev}
                  total={scheme.priorExpTotal}
                  className="col-prior"
                />
                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.throwForwardCap}
                  rev={scheme.throwForwardRev}
                  total={scheme.throwForwardTotal}
                  className="col-throw"
                />
                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.allocCfyCap}
                  rev={scheme.allocCfyRev}
                  total={scheme.allocCfyTotal}
                  className="col-alloc"
                />
                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.revAllocCfyCap}
                  rev={scheme.revAllocCfyRev}
                  total={scheme.revAllocCfyTotal}
                  className="col-revalloc"
                />
                <FinancialTriple
                  expanded={isFinancialExpanded}
                  cap={scheme.releasesCfyCap}
                  rev={scheme.releasesCfyRev}
                  total={scheme.releasesCfyTotal}
                  className="col-release"
                />

                <td>
                  <button
                    type="button"
                    className="table-edit-btn"
                    onClick={() => navigate(`/adp-schemes/${scheme.id}/edit`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}