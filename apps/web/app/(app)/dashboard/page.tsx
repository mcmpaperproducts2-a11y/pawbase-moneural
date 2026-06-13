import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function DashboardPage() {
  const module = getModuleDefinition("dashboard") ?? moduleDefinitions[0];
  return <ModuleWorkspace module={module} />;
}
