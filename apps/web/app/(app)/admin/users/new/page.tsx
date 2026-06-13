import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function NewAdminUserPage() {
  return <ModuleWorkspace module={getModuleDefinition("admin") ?? moduleDefinitions[0]} mode="new" />;
}
