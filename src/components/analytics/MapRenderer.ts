import type { VisitorLocation } from "@/actions/analytics";

export interface MapRendererProps {
  locations: VisitorLocation[];
  selectedIp?: string | null;
}
