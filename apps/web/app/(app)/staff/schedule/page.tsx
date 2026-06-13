import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function StaffSchedulePage() {
  return <ModuleWorkspace module={getModuleDefinition("staff") ?? moduleDefinitions[0]} mode="calendar" />;
}
