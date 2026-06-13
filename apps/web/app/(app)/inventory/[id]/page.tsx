import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  return <ModuleWorkspace module={getModuleDefinition("inventory") ?? moduleDefinitions[0]} mode="detail" detailId={params.id} />;
}
