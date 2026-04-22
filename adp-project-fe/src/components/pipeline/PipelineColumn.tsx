import type { PipelineColumn as PipelineColumnType } from "../../types/pipeline";
import PipelineCard from "./PipelineCard";

type Props = {
  column: PipelineColumnType;
};

export default function PipelineColumn({ column }: Props) {
  return (
    <div className="pipeline-column">
      <div className="pipeline-column-header">
        <h3>{column.title}</h3>
        <span>{column.count}</span>
      </div>

      <div className="pipeline-column-body">
        {column.items.length === 0 ? (
          <div className="pipeline-empty">No schemes pending here</div>
        ) : (
          column.items.map((item) => (
            <PipelineCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}