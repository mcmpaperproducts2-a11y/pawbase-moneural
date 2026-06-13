import { ModuleWorkspace } from "@/components/modules/ModuleWorkspace";
import { getModuleDefinition, moduleDefinitions } from "@/lib/modules/definitions";

export default function BillingPage() {
  return <ModuleWorkspace module={getModuleDefinition("billing") ?? moduleDefinitions[0]} />;
}
