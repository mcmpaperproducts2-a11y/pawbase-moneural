import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function InvoicePage({ params }: { params: { id: string } }) {
  return <ModuleWorkspace module={getModuleDefinition("billing") ?? moduleDefinitions[0]} mode="detail" detailId={params.id} />;
}
