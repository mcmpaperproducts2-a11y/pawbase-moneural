import Link from "next/link";

export default function PortalHomePage() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-4xl place-items-center px-4 py-10">
      <section className="w-full rounded-md border border-border bg-white p-6">
        <p className="text-sm font-semibold text-primary">Owner portal</p>
        <h1 className="mt-2 text-2xl font-bold">Book stays and follow pet updates</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link href="/portal/book" className="rounded-md border border-border p-4 font-semibold">Book a stay</Link>
          <Link href="/portal/pets" className="rounded-md border border-border p-4 font-semibold">My pets</Link>
          <Link href="/portal/updates" className="rounded-md border border-border p-4 font-semibold">Updates</Link>
        </div>
      </section>
    </main>
  );
}
