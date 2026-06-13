export function OccupancyCard({ current, total, pct, free, maintenance }: { current: number; total: number; pct: number; free: number; maintenance: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const color = pct > 95 ? "#ef4444" : pct > 80 ? "#f59e0b" : "#10b981";
  return (
    <div className="col-span-2 flex items-center gap-4 rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#34322f" strokeWidth="8" />
        <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} transform="rotate(-90 44 44)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="44" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f6f1e8">{current}/{total}</text>
        <text x="44" y="56" textAnchor="middle" fontSize="10" fill="#b9b0a3">units</text>
      </svg>
      <div>
        <div className="text-2xl font-bold text-[#f6f1e8]">{pct}%</div>
        <div className="text-sm font-semibold text-[#b9b0a3]">Occupancy</div>
        <div className="mt-1 text-xs font-semibold text-[#7d756a]">{free} free · {maintenance} maintenance</div>
      </div>
    </div>
  );
}
