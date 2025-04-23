import { LucideIcon } from "lucide-react";

export interface GuideStepProps {
  title: string;
  description: string;
  code?: string;
  language?: string;
  icon?: LucideIcon;
}

export interface GuideProps {
  title: string;
  description: string;
  steps: GuideStepProps[];
}

export type GuideType = "custom" | "boilerplate" | null;
