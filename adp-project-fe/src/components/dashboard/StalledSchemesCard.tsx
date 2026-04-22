import type { StalledScheme } from "../../types/dashboard.types";

type Props = {
  schemes: StalledScheme[];
};

export default function StalledSchemesCard({ schemes }: Props) {
  return (
    <div className="stalled-card">
      <h3 className="stalled-title">Stalled Schemes</h3>

      <div className="stalled-list">
        {schemes.length === 0 ? (
          <div className="empty-stalled">No stalled schemes found.</div>
        ) : (
          schemes.map((scheme, index) => (
            <div className="stalled-item" key={scheme.id || index}>
              <div className="stalled-top-row">
                <span className="stalled-adp">{scheme.adpNo || "N/A"}</span>
                <span className="stalled-status">{scheme.status || "N/A"}</span>
              </div>

              <h4 className="stalled-name">{scheme.schemeName || "Unnamed Scheme"}</h4>

              <p className="stalled-pending">
                PENDING: {scheme.pendingWith || "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}