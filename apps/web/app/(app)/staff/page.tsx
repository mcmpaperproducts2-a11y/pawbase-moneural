import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function StaffPage() {
  return <ModuleWorkspace module={getModuleDefinition("staff") ?? moduleDefinitions[0]} />;
}
