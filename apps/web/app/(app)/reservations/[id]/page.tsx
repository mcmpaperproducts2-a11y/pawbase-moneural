import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  return <ModuleWorkspace module={getModuleDefinition("reservations") ?? moduleDefinitions[0]} mode="detail" detailId={params.id} />;
}
