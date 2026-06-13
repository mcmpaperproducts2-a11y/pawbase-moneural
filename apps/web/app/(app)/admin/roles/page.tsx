import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function AdminRolesPage() {
  return <ModuleWorkspace module={getModuleDefinition("admin") ?? moduleDefinitions[0]} mode="detail" detailId="roles" />;
}
