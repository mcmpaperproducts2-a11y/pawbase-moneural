function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export function AlertsFeed({ alerts }: { alerts: Array<{ id: string; pet: string; owner: string; vaccine_name: string; expiry_date: string }> }) {
  return (
    <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
      <h2 className="mb-3 font-bold text-[#f6f1e8]">Alerts</h2>
      <div className="grid gap-2">
        {alerts.map((alert) => {
          const days = daysUntil(alert.expiry_date);
          return (
            <div key={alert.id} className={`rounded-md border p-3 ${days < 7 ? "border-red-900 bg-red-950/30" : "border-[#7a5a24] bg-[#2b2112]"}`}>
              <div className="font-bold text-[#f6f1e8]">{alert.pet}: {alert.vaccine_name}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{alert.owner} · expires in {days} days</div>
            </div>
          );
        })}
        {!alerts.length ? <div className="rounded-md bg-[#151514] p-3 text-sm text-[#9ce4bf]">No expiring vaccinations in the next 14 days.</div> : null}
      </div>
    </section>
  );
}
