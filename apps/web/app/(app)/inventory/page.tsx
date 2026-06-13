import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function InventoryPage() {
  return <ModuleWorkspace module={getModuleDefinition("inventory") ?? moduleDefinitions[0]} />;
}
