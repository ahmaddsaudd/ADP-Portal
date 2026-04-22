import { useNavigate } from "react-router-dom";
import type { PipelineItem } from "../../types/pipeline";

type Props = {
  item: PipelineItem;
};

function formatPendingWith(value: string) {
  return value.replaceAll("_", " ");
}

export default function PipelineCard({ item }: Props) {
  const navigate = useNavigate();

  return (
    <div
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
        <div>
          <p className="pipeline-adp-no">{item.adpNo}</p>
          <h4>{item.schemeName}</h4>
        </div>

        {item.isStalled ? (
          <span className="pipeline-alert-badge">Stalled</span>
        ) : null}
      </div>

      <div className="pipeline-scheme-meta">
        <div className="pipeline-meta-item">
          <span>District</span>
          <strong>{item.district || "—"}</strong>
        </div>

        <div className="pipeline-meta-item">
          <span>Sector</span>
          <strong>{item.sector || "—"}</strong>
        </div>

        <div className="pipeline-meta-item">
          <span>Pending With</span>
          <strong>{formatPendingWith(item.pendingWith)}</strong>
        </div>

        <div className="pipeline-meta-item">
          <span>Approval</span>
          <strong>{item.approvalStatus}</strong>
        </div>

        <div className="pipeline-meta-item">
          <span>Execution</span>
          <strong>{item.executionStatus}</strong>
        </div>
      </div>
    </div>
  );
}