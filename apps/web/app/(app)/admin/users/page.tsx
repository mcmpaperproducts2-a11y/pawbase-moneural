import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function AdminUsersPage() {
  return <ModuleWorkspace module={getModuleDefinition("admin") ?? moduleDefinitions[0]} />;
}
