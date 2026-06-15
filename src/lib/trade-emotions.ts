import type { EmotionalState } from "@/types/database";
import {
  Brain,
  Flame,
  Shield,
  Smile,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const EMOTIONAL_STATES: {
  value: EmotionalState;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "calm", label: "Calm", icon: Smile },
  { value: "confident", label: "Confident", icon: Shield },
  { value: "anxious", label: "Anxious", icon: Brain },
  { value: "fomo", label: "FOMO", icon: Flame },
  { value: "revenge", label: "Revenge", icon: Zap },
];

export const ASSET_CLASSES = [
  { value: "stocks", label: "Stocks" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "options", label: "Options" },
  { value: "futures", label: "Futures" },
] as const;
