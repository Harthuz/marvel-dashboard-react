import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { MCUProduction } from "@/types/mcu";

interface MCUCardProps {
  production: MCUProduction;
  isWatched: boolean;
  onToggleWatched: (title: string) => void;
}

export default function MCUCard({
  production,
  isWatched,
  onToggleWatched,
}: MCUCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Poster Section */}
      <div className="relative overflow-hidden bg-muted aspect-[2/3] flex-shrink-0">
        <img
          src={production.poster_url}
          alt={production.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x450?text=" +
              encodeURIComponent(production.title);
          }}
        />
        {/* Badge for type */}
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
          {production.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Year */}
        <div className="mb-2">
          <h3 className="font-bold text-sm line-clamp-2 mb-1">
            {production.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{production.release_year}</span>
            <span className="text-primary font-semibold">{production.phase}</span>
          </div>
        </div>

        {/* Watched Checkbox */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <Checkbox
            id={`watched-${production.title}`}
            checked={isWatched}
            onCheckedChange={() => onToggleWatched(production.title)}
            className="cursor-pointer"
          />
          <label
            htmlFor={`watched-${production.title}`}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Assistido
          </label>
        </div>

        {/* Synopsis Section */}
        <div className="flex-1">
          {isExpanded ? (
            <div className="text-xs text-foreground leading-relaxed mb-3">
              {production.synopsis}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {production.synopsis}
            </p>
          )}
        </div>

        {/* Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between text-xs h-auto py-2"
        >
          {isExpanded ? "Ocultar sinopse" : "Ver sinopse"}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </Card>
  );
}

