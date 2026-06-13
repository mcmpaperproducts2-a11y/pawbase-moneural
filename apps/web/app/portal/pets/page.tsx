export default function PortalPetsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">My pets</h1>
      <div className="mt-5 grid gap-3">
        {["Bailey", "Milo", "Luna"].map((pet) => (
          <div key={pet} className="rounded-md border border-border bg-white p-4">
            <div className="font-semibold">{pet}</div>
            <div className="text-sm text-muted-foreground">Vaccination status and stay history available.</div>
          </div>
        ))}
      </div>
    </main>
  );
}
