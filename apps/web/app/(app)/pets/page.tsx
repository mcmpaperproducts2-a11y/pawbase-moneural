import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function PetsPage() {
  return <ModuleWorkspace module={getModuleDefinition("pets") ?? moduleDefinitions[0]} />;
}
