import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function ReservationsPage() {
  return <ModuleWorkspace module={getModuleDefinition("reservations") ?? moduleDefinitions[0]} />;
}
