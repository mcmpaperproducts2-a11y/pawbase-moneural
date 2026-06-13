import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function CarePage() {
  return <ModuleWorkspace module={getModuleDefinition("care") ?? moduleDefinitions[0]} />;
}
