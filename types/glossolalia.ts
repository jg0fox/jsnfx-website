export type TierId = "tier1" | "tier2";

export interface Tier {
  id: TierId;
  title: string;
  description: string;
  phenomena: Phenomenon[];
}

export interface Phenomenon {
  id: string;
  number: number;
  tier: TierId;
  title: string;
  overview: string;
  keyConcepts: KeyConcept[];
  sources: Source[];
  thoughtExperiments: ThoughtExperiment[];
  exercise?: ExerciseType;
}

export interface KeyConcept {
  term: string;
  description: string;
}

export interface Source {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  summary: string;
  whyItMatters: string;
  experimentRelevance: string;
  doiUrl: string;
}

export interface ThoughtExperiment {
  id: string;
  prompt: string;
}

export type ExerciseType =
  | "semantic-satiation"
  | "framing-effect"
  | "bouba-kiki"
  | "stroop-effect";

export interface QuizQuestion {
  id: string;
  phenomenonId: string;
  phenomenonTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number | null>;
  revealed: Record<string, boolean>;
  score: number;
  total: number;
}
