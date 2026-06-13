import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function CareReservationPage({ params }: { params: { reservation_id: string } }) {
  return <ModuleWorkspace module={getModuleDefinition("care") ?? moduleDefinitions[0]} mode="detail" detailId={params.reservation_id} />;
}
