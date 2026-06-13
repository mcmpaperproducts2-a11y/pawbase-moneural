import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function KennelPage() {
  return <ModuleWorkspace module={getModuleDefinition("kennel") ?? moduleDefinitions[0]} />;
}
