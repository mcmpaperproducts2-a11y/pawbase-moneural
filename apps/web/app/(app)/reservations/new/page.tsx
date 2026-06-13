import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function NewReservationPage() {
  return <ModuleWorkspace module={getModuleDefinition("reservations") ?? moduleDefinitions[0]} mode="new" />;
}
