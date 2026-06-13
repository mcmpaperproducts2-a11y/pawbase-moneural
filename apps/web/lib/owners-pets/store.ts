export type Owner = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_primary: string;
  phone_secondary?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed?: string;
  color?: string;
  gender?: "male" | "female" | "unknown";
  date_of_birth?: string;
  weight_kg?: number;
  microchip_number?: string;
  is_neutered?: boolean;
  temperament?: "friendly" | "anxious" | "aggressive" | "calm" | "energetic" | "shy";
  feeding_instructions?: string;
  special_needs?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
};

export type Vaccination = { id: string; pet_id: string; vaccine_name: string; administered_date: string; expiry_date?: string; administered_by?: string };
export type Vet = { id: string; pet_id: string; vet_name: string; clinic_name?: string; phone?: string; email?: string; address?: string; is_primary: boolean };

let owners: Owner[] = [
  { id: "own-201", first_name: "Asha", last_name: "Rao", email: "asha@example.com", phone_primary: "+919876543210", city: "Bengaluru", notes: "Prefers WhatsApp updates", is_active: true, created_at: new Date().toISOString() },
  { id: "own-202", first_name: "Kabir", last_name: "Menon", email: "kabir@example.com", phone_primary: "+919876543211", city: "Chennai", is_active: true, created_at: new Date().toISOString() },
  { id: "own-203", first_name: "Neha", last_name: "Shah", email: "neha@example.com", phone_primary: "+919876543212", city: "Mumbai", is_active: true, created_at: new Date().toISOString() }
];

let pets: Pet[] = [
  { id: "pet-301", owner_id: "own-201", name: "Bailey", species: "dog", breed: "Golden Retriever", gender: "female", weight_kg: 27, temperament: "friendly", feeding_instructions: "2 cups kibble twice daily", is_neutered: true, is_active: true, created_at: new Date().toISOString() },
  { id: "pet-302", owner_id: "own-202", name: "Milo", species: "cat", breed: "Persian", gender: "male", temperament: "calm", special_needs: "Antibiotic after dinner", is_active: true, created_at: new Date().toISOString() },
  { id: "pet-303", owner_id: "own-203", name: "Luna", species: "dog", breed: "Indie", gender: "female", temperament: "anxious", is_active: true, created_at: new Date().toISOString() }
];

let vaccinations: Vaccination[] = [
  { id: "vac-1", pet_id: "pet-301", vaccine_name: "Rabies", administered_date: "2025-07-01", expiry_date: "2026-07-01", administered_by: "Dr. Iyer" },
  { id: "vac-2", pet_id: "pet-303", vaccine_name: "DHPP", administered_date: "2025-06-20", expiry_date: "2026-06-20", administered_by: "City Vet" }
];

let vets: Vet[] = [
  { id: "vet-1", pet_id: "pet-301", vet_name: "Dr. Iyer", clinic_name: "Indiranagar Pet Clinic", phone: "+918888888888", email: "vet@example.com", is_primary: true }
];

export function ownerName(owner: Owner) {
  return `${owner.first_name} ${owner.last_name}`.trim();
}

export function listOwners(q = "", active = "true") {
  const term = q.toLowerCase();
  return owners.filter((owner) => {
    const matches = !term || [ownerName(owner), owner.email ?? "", owner.phone_primary].join(" ").toLowerCase().includes(term);
    const activeMatch = active === "all" || owner.is_active === (active !== "false");
    return matches && activeMatch;
  }).map((owner) => ({ ...owner, pet_count: pets.filter((pet) => pet.owner_id === owner.id && pet.is_active).length }));
}

export function getOwner(id: string) {
  const owner = owners.find((item) => item.id === id);
  if (!owner) return null;
  const ownerPets = pets.filter((pet) => pet.owner_id === id && pet.is_active).map(enrichPet);
  return { ...owner, pet_count: ownerPets.length, pets: ownerPets, reservations: sampleReservations(id), financials: { total_spent: 12600, outstanding: 4200 } };
}

export function createOwner(input: Partial<Owner>) {
  if (input.email && owners.some((owner) => owner.email?.toLowerCase() === input.email?.toLowerCase())) return { error: "Email already in use", status: 409 as const };
  const owner: Owner = { id: `own-${Date.now()}`, first_name: input.first_name ?? "", last_name: input.last_name ?? "", phone_primary: input.phone_primary ?? "", email: input.email, phone_secondary: input.phone_secondary, address_line1: input.address_line1, address_line2: input.address_line2, city: input.city, state: input.state, postal_code: input.postal_code, emergency_contact_name: input.emergency_contact_name, emergency_contact_phone: input.emergency_contact_phone, notes: input.notes, is_active: true, created_at: new Date().toISOString() };
  owners = [owner, ...owners];
  return { owner };
}

export function updateOwner(id: string, input: Partial<Owner>) {
  const owner = owners.find((item) => item.id === id);
  if (!owner) return { error: "Owner not found", status: 404 as const };
  Object.assign(owner, input);
  return { owner };
}

export function deleteOwner(id: string) {
  if (sampleReservations(id).some((reservation) => ["confirmed", "checked_in"].includes(reservation.status))) return { error: "Owner has active reservations", status: 409 as const };
  return updateOwner(id, { is_active: false });
}

export function listPets(filters: { q?: string; owner_id?: string; species?: string } = {}) {
  const term = (filters.q ?? "").toLowerCase();
  return pets.filter((pet) => {
    const owner = owners.find((item) => item.id === pet.owner_id);
    return pet.is_active && (!filters.owner_id || pet.owner_id === filters.owner_id) && (!filters.species || filters.species === "all" || pet.species === filters.species) && (!term || [pet.name, pet.breed ?? "", owner ? ownerName(owner) : ""].join(" ").toLowerCase().includes(term));
  }).map(enrichPet);
}

export function getPet(id: string) {
  const pet = pets.find((item) => item.id === id);
  if (!pet) return null;
  return { ...enrichPet(pet), vaccinations: vaccinations.filter((item) => item.pet_id === id), vets: vets.filter((item) => item.pet_id === id).sort((a, b) => Number(b.is_primary) - Number(a.is_primary)), reservations: sampleReservations(pet.owner_id) };
}

export function createPet(input: Partial<Pet>) {
  if (!input.owner_id || !owners.some((owner) => owner.id === input.owner_id)) return { error: "Owner is required", status: 400 as const };
  const pet: Pet = { id: `pet-${Date.now()}`, owner_id: input.owner_id, name: input.name ?? "", species: input.species ?? "dog", breed: input.breed, color: input.color, gender: input.gender, date_of_birth: input.date_of_birth, weight_kg: input.weight_kg ? Number(input.weight_kg) : undefined, microchip_number: input.microchip_number, is_neutered: input.is_neutered, temperament: input.temperament, feeding_instructions: input.feeding_instructions, special_needs: input.special_needs, photo_url: input.photo_url, is_active: true, created_at: new Date().toISOString() };
  pets = [pet, ...pets];
  return { pet: enrichPet(pet) };
}

export function updatePet(id: string, input: Partial<Pet>) {
  const pet = pets.find((item) => item.id === id);
  if (!pet) return { error: "Pet not found", status: 404 as const };
  Object.assign(pet, input);
  return { pet: enrichPet(pet) };
}

export function deletePet(id: string) {
  return updatePet(id, { is_active: false });
}

export function listVaccinations(petId: string) { return vaccinations.filter((item) => item.pet_id === petId); }
export function addVaccination(petId: string, input: Partial<Vaccination>) {
  const vaccination = { id: `vac-${Date.now()}`, pet_id: petId, vaccine_name: input.vaccine_name ?? "", administered_date: input.administered_date ?? new Date().toISOString().slice(0, 10), expiry_date: input.expiry_date, administered_by: input.administered_by };
  vaccinations = [vaccination, ...vaccinations];
  return vaccination;
}
export function deleteVaccination(id: string) { vaccinations = vaccinations.filter((item) => item.id !== id); }

export function listVets(petId: string) { return vets.filter((item) => item.pet_id === petId); }
export function addVet(petId: string, input: Partial<Vet>) {
  if (input.is_primary) vets = vets.map((vet) => vet.pet_id === petId ? { ...vet, is_primary: false } : vet);
  const vet = { id: `vet-${Date.now()}`, pet_id: petId, vet_name: input.vet_name ?? "", clinic_name: input.clinic_name, phone: input.phone, email: input.email, address: input.address, is_primary: Boolean(input.is_primary) };
  vets = [vet, ...vets];
  return vet;
}

function enrichPet(pet: Pet) {
  const owner = owners.find((item) => item.id === pet.owner_id);
  const alert = vaccinations.filter((item) => item.pet_id === pet.id && item.expiry_date).sort((a, b) => String(a.expiry_date).localeCompare(String(b.expiry_date)))[0];
  return { ...pet, owner, owner_name: owner ? ownerName(owner) : "Unknown owner", vaccination_alert: alert };
}

function sampleReservations(ownerId: string) {
  return [
    { id: "res-1042", status: "checked_in", check_in_date: "2026-06-13", check_out_date: "2026-06-18", kennel_unit: "Garden Suite 04", invoice_status: "paid", owner_id: ownerId },
    { id: "res-1011", status: "completed", check_in_date: "2026-05-10", check_out_date: "2026-05-13", kennel_unit: "Deluxe 11", invoice_status: "paid", owner_id: ownerId }
  ];
}
