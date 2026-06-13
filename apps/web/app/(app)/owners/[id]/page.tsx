import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function OwnerDetailPage({ params }: { params: { id: string } }) {
  return <ModuleWorkspace module={getModuleDefinition("owners") ?? moduleDefinitions[0]} mode="detail" detailId={params.id} />;
}
