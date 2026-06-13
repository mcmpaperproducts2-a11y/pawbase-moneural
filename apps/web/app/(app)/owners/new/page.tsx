import { OwnerForm } from "@/components/pets/OwnerForm";

export default function NewOwnerPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">New owner</h1>
      <OwnerForm />
    </div>
  );
}
