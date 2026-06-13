import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function CheckinPage() {
  return <ModuleWorkspace module={getModuleDefinition("checkin") ?? moduleDefinitions[0]} />;
}
