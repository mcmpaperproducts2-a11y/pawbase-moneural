import { Suspense } from "react";
import { PetForm } from "@/components/pets/PetForm";

export default function NewPetPage() {
  return <div className="grid gap-4"><h1 className="text-2xl font-bold">New pet</h1><Suspense><PetForm /></Suspense></div>;
}
