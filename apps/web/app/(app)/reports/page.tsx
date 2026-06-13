import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function ReportsPage() {
  return <ModuleWorkspace module={getModuleDefinition("reports") ?? moduleDefinitions[0]} />;
}
