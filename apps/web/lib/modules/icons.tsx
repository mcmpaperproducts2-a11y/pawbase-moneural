import {
  Activity,
  Bed,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Gauge,
  HeartPulse,
  Package,
  PawPrint,
  Settings,
  Stethoscope,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  bed: Bed,
  calendar: CalendarDays,
  card: CreditCard,
  clipboard: ClipboardCheck,
  gauge: Gauge,
  heart: HeartPulse,
  package: Package,
  paw: PawPrint,
  settings: Settings,
  stethoscope: Stethoscope,
  users: Users
};

export function getModuleIcon(name: string) {
  return icons[name] ?? Activity;
}
