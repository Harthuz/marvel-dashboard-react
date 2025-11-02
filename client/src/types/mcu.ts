export interface MCUProduction {
  title: string;
  type: "Filme" | "Série" | "Série Animada" | "Especial";
  release_year: number;
  release_order: number;
  chronology_order: number;
  phase: string;
  synopsis: string;
  watched: boolean;
  poster_url: string;
}

export type SortBy = "chronology" | "release";

