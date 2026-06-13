export default function PortalBookPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Book a stay</h1>
      <div className="mt-5 rounded-md border border-border bg-white p-4">
        <label className="grid gap-2 text-sm font-medium">
          Preferred dates
          <input className="h-11 rounded-md border border-border px-3" placeholder="15 Jun - 20 Jun" />
        </label>
        <button className="mt-4 h-11 rounded-md bg-primary px-4 font-semibold text-primary-foreground">Request booking</button>
      </div>
    </main>
  );
}
