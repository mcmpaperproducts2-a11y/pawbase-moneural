import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function OwnersPage() {
  return <ModuleWorkspace module={getModuleDefinition("owners") ?? moduleDefinitions[0]} />;
}
