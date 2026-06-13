import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function HealthPage() {
  return <ModuleWorkspace module={getModuleDefinition("health") ?? moduleDefinitions[0]} />;
}
