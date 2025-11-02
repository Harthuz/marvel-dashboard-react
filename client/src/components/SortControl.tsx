import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import type { SortBy } from "@/types/mcu";

interface SortControlProps {
  currentSort: SortBy;
  onSortChange: (sort: SortBy) => void;
}

export default function SortControl({
  currentSort,
  onSortChange,
}: SortControlProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={currentSort === "chronology" ? "default" : "outline"}
        size="sm"
        onClick={() => onSortChange("chronology")}
        className="gap-2"
      >
        <Clock className="w-4 h-4" />
        Ordem Cronológica
      </Button>
      <Button
        variant={currentSort === "release" ? "default" : "outline"}
        size="sm"
        onClick={() => onSortChange("release")}
        className="gap-2"
      >
        <Calendar className="w-4 h-4" />
        Ordem de Lançamento
      </Button>
    </div>
  );
}

