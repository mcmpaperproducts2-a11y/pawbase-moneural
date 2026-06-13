"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Gauge,
  HeartPulse,
  Home,
  LockKeyhole,
  Map,
  PawPrint,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { sampleTenants } from "@/lib/data/sample-saas-data";

type ScreenId = "dashboard" | "reservations" | "kennel" | "checkin" | "care" | "billing" | "reports" | "admin";

type Screen = {
  id: ScreenId;
  label: string;
  title: string;
  icon: LucideIcon;
  stats: Array<{ label: string; value: string; tone?: string }>;
  sections: Array<{
    title: string;
    items: Array<{ badge: string; title: string; meta: string; chip?: string; alert?: boolean }>;
  }>;
};

const screens: Screen[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Good morning, Priya",
    icon: Gauge,
    stats: [
      { label: "Boarding now", value: "18 / 24" },
      { label: "Today's revenue", value: "₹4,820", tone: "green" },
      { label: "Check-ins today", value: "3" },
      { label: "Check-outs today", value: "5", tone: "amber" }
    ],
    sections: [
      {
        title: "Checking in today",
        items: [
          { badge: "BW", title: "Bruno — Weimaraner", meta: "Sharma family · Unit A-03", chip: "2pm" },
          { badge: "ML", title: "Mochi — Persian cat", meta: "Lal family · Cat cabin C-01", chip: "4pm" }
        ]
      },
      {
        title: "Alerts",
        items: [
          { badge: "!", title: "Low stock: Royal Canin", meta: "4 units left · reorder level 10", chip: "Stock", alert: true },
          { badge: "V", title: "Vaccination expiring", meta: "Coco's rabies · expires in 8 days", chip: "Health", alert: true }
        ]
      }
    ]
  },
  {
    id: "reservations",
    label: "Reservations",
    title: "Reservation board",
    icon: CalendarDays,
    stats: [
      { label: "Confirmed", value: "26" },
      { label: "Waitlist", value: "4", tone: "amber" },
      { label: "Open quotes", value: "7" },
      { label: "Calendar fill", value: "81%", tone: "green" }
    ],
    sections: [
      {
        title: "Upcoming stays",
        items: [
          { badge: "RS", title: "Rio · Deluxe kennel", meta: "15 Jun - 19 Jun · Menon family", chip: "Confirm" },
          { badge: "TN", title: "Tuna · Cat cabin", meta: "16 Jun - 18 Jun · Iyer family", chip: "Paid" }
        ]
      },
      {
        title: "Availability actions",
        items: [
          { badge: "+", title: "Create booking", meta: "Pick owner, pet, dates, unit, add-ons", chip: "New" },
          { badge: "W", title: "Promote waitlist", meta: "Garden Suite opens tomorrow", chip: "Open" }
        ]
      }
    ]
  },
  {
    id: "kennel",
    label: "Kennel map",
    title: "Kennel occupancy",
    icon: Map,
    stats: [
      { label: "Available", value: "6", tone: "green" },
      { label: "Occupied", value: "18" },
      { label: "Reserved", value: "9", tone: "amber" },
      { label: "Maintenance", value: "2" }
    ],
    sections: [
      {
        title: "Unit map",
        items: [
          { badge: "A3", title: "Garden A-03 · Bruno", meta: "Occupied · check-out 18 Jun", chip: "Open" },
          { badge: "C1", title: "Cat cabin C-01 · Mochi", meta: "Occupied · quiet zone", chip: "Open" },
          { badge: "B7", title: "Deluxe B-07", meta: "Available · sanitized 9:20", chip: "Assign" }
        ]
      }
    ]
  },
  {
    id: "checkin",
    label: "Check-in",
    title: "Arrivals and departures",
    icon: ClipboardCheck,
    stats: [
      { label: "Due arrivals", value: "3" },
      { label: "Docs missing", value: "1", tone: "amber" },
      { label: "Departures", value: "5" },
      { label: "Paid exits", value: "4", tone: "green" }
    ],
    sections: [
      {
        title: "Check-in queue",
        items: [
          { badge: "RB", title: "Ruby arrival", meta: "Condition notes · vaccine verified", chip: "Start" },
          { badge: "CO", title: "Coco departure", meta: "Invoice ready · receipt pending", chip: "Close" }
        ]
      }
    ]
  },
  {
    id: "care",
    label: "Daily care",
    title: "Today's care board",
    icon: HeartPulse,
    stats: [
      { label: "Morning", value: "16 / 18" },
      { label: "Medication", value: "2 due", tone: "amber" },
      { label: "Exercise", value: "11 done" },
      { label: "Notes", value: "9 new", tone: "green" }
    ],
    sections: [
      {
        title: "Care tasks",
        items: [
          { badge: "AM", title: "Morning feed round", meta: "2 pets left · wet food exceptions", chip: "Log" },
          { badge: "RX", title: "Milo antibiotic", meta: "Due now · vet staff assigned", chip: "Administer", alert: true },
          { badge: "PM", title: "Evening play group", meta: "Outdoor yard · group A", chip: "Plan" }
        ]
      }
    ]
  },
  {
    id: "billing",
    label: "Billing",
    title: "Invoices and payments",
    icon: CreditCard,
    stats: [
      { label: "Open invoices", value: "12" },
      { label: "Due today", value: "₹28k", tone: "amber" },
      { label: "Paid today", value: "₹14k", tone: "green" },
      { label: "POS carts", value: "3" }
    ],
    sections: [
      {
        title: "Payment worklist",
        items: [
          { badge: "₹", title: "INV-701 · Bailey stay", meta: "Boarding + grooming · GST included", chip: "Paid" },
          { badge: "UP", title: "INV-702 · Milo stay", meta: "UPI link sent · awaiting webhook", chip: "Track" },
          { badge: "PO", title: "Counter POS sale", meta: "Treats + shampoo", chip: "Checkout" }
        ]
      }
    ]
  },
  {
    id: "reports",
    label: "Reports",
    title: "Analytics hub",
    icon: TrendingUp,
    stats: [
      { label: "Occupancy avg", value: "75%" },
      { label: "Revenue MTD", value: "₹3.2L", tone: "green" },
      { label: "Completion", value: "91%" },
      { label: "Exports", value: "8" }
    ],
    sections: [
      {
        title: "Report cards",
        items: [
          { badge: "OC", title: "Occupancy trend", meta: "Peak weekends · 30-day window", chip: "View" },
          { badge: "RV", title: "Revenue by service", meta: "Boarding, grooming, retail split", chip: "CSV" },
          { badge: "ST", title: "Staff efficiency", meta: "Task completion by shift", chip: "Open" }
        ]
      }
    ]
  },
  {
    id: "admin",
    label: "Admin",
    title: "Super admin console",
    icon: Settings,
    stats: [
      { label: "Users", value: "24" },
      { label: "Roles", value: "5" },
      { label: "Modules", value: "13" },
      { label: "Audit events", value: "428", tone: "green" }
    ],
    sections: [
      {
        title: "All controls unlocked",
        items: [
          { badge: "SA", title: "admin@example.com", meta: "super_admin · every module/action allowed", chip: "Active" },
          { badge: "RB", title: "Role matrix", meta: "CRUD and manage permissions per module", chip: "Edit" },
          { badge: "AU", title: "Audit log", meta: "User, table, action, date, diff export", chip: "Open" }
        ]
      }
    ]
  }
];

const bottomNav: ScreenId[] = ["dashboard", "reservations", "kennel", "checkin", "care", "billing", "reports", "admin"];

export function WireframeExplorer() {
  const [activeId, setActiveId] = useState<ScreenId>("dashboard");
  const [tenantId, setTenantId] = useState(sampleTenants[0].id);
  const [eventLog, setEventLog] = useState<string[]>(["Wireframe loaded", "Super admin controls enabled"]);
  const [deviceTime, setDeviceTime] = useState("");
  const active = useMemo(() => screens.find((screen) => screen.id === activeId) ?? screens[0], [activeId]);
  const tenant = useMemo(() => sampleTenants.find((item) => item.id === tenantId) ?? sampleTenants[0], [tenantId]);
  const ActiveIcon = active.icon;

  useEffect(() => {
    function updateTime() {
      setDeviceTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    }

    updateTime();
    const timer = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(timer);
  }, []);

  function pushEvent(label: string) {
    setEventLog((items) => [label, ...items].slice(0, 4));
  }

  return (
    <main className="min-h-screen bg-[#1b1b1a] px-3 py-3 text-[#f6f1e8]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7">
        <section className="relative w-full max-w-[390px] overflow-hidden rounded-[30px] border border-[#4d4b46] bg-[#111110] shadow-2xl">
          <div className="border-b border-[#3c3a36] bg-[#2a2a28] px-4 pb-4 pt-3">
            <div className="grid grid-cols-3 items-center text-xs font-bold text-[#d7d1c4]">
              <span>{deviceTime}</span>
              <span className="text-center">{active.label}</span>
              <span />
            </div>
            <div className="mt-7 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold leading-tight">{active.title}</h1>
                <p className="text-sm text-[#d5c9b7]">{tenant.name} · {tenant.plan} plan</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full text-[#ddd5c7]">
                {active.id === "admin" ? <ShieldCheck size={22} /> : <Bell size={21} />}
              </div>
            </div>
            <select
              value={tenantId}
              onChange={(event) => {
                setTenantId(event.target.value);
                pushEvent("Tenant context switched");
              }}
              className="mt-4 h-9 w-full rounded-md border border-[#4d4b46] bg-[#1f1f1d] px-3 text-sm font-bold text-[#f6f1e8]"
              aria-label="Tenant"
            >
              {sampleTenants.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="max-h-[660px] min-h-[630px] overflow-y-auto px-4 pb-24 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {active.stats.map((stat) => (
                <div key={stat.label} className="rounded-md bg-[#242421] p-3">
                  <div className="text-xs font-semibold text-[#c7bdad]">{stat.label}</div>
                  <div className={`mt-1 text-xl font-bold ${stat.tone === "green" ? "text-[#60c94d]" : stat.tone === "amber" ? "text-[#e3ae3c]" : "text-white"}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-[#46433d] bg-[#2b2b29] p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">Occupancy</div>
                <ActiveIcon size={18} className="text-[#2fb080]" />
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#24231f]">
                <div className="h-full w-3/4 rounded-full bg-[#2fad7e]" />
              </div>
              <div className="mt-1 text-xs font-semibold text-[#d7cfbf]">18 of 24 units occupied — 75%</div>
            </div>

            <ModulePanel active={active} tenant={tenant} onEvent={pushEvent} />

            <section className="mt-4">
              <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Transactions</h2>
              <div className="grid gap-2">
                {eventLog.map((item) => (
                  <div key={item} className="rounded-md border border-[#46433d] bg-[#242421] px-3 py-2 text-xs font-semibold text-[#d8cfbf]">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex gap-1 overflow-x-auto border-t border-[#3f3d38] bg-[#191918]/95 px-2 backdrop-blur">
            {bottomNav.map((id) => {
              const screen = screens.find((item) => item.id === id) ?? screens[0];
              const Icon = screen.icon;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveId(id)}
                  className={`grid min-h-16 min-w-[72px] place-items-center gap-1 text-[11px] font-bold ${activeId === id ? "text-[#34c084]" : "text-[#a9a094]"}`}
                >
                  <Icon size={18} />
                  <span>{screen.label.replace("Kennel map", "Kennel").replace("Daily care", "Care")}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="hidden items-center gap-2 rounded-full border border-[#494640] px-4 py-2 text-sm font-semibold text-[#cfc5b6] sm:flex">
          <LockKeyhole size={16} />
          Super admin demo: admin@example.com / admin123
        </div>
      </div>
    </main>
  );
}

function ModulePanel({ active, tenant, onEvent }: { active: Screen; tenant: (typeof sampleTenants)[number]; onEvent: (label: string) => void }) {
  if (active.id === "reservations") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Reservation pipeline</h2>
        <div className="mb-3 rounded-md border border-[#46433d] bg-[#242421] px-3 py-2 text-xs font-bold text-[#d8cfbf]">
          Tenant-scoped bookings for {tenant.name}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          {["Inquiry", "Confirmed", "Checked-in"].map((stage, index) => (
            <button key={stage} onClick={() => onEvent(`${stage} lane opened`)} className="rounded-md border border-[#46433d] bg-[#242421] p-3" type="button">
              <div className="text-lg text-white">{[7, 26, 18][index]}</div>
              <div className="text-[#cabead]">{stage}</div>
            </button>
          ))}
        </div>
        <CardList
          items={[
            ["RS", "Rio · Deluxe B-07", "15 Jun - 19 Jun · ₹7,200", "Quote"],
            ["TN", "Tuna · Cat cabin C-01", "16 Jun - 18 Jun · paid", "Confirm"],
            ["BW", "Bruno · Garden A-03", "Owner requested grooming add-on", "Edit"]
          ]}
          onEvent={onEvent}
        />
      </section>
    );
  }

  if (active.id === "kennel") {
    const units = ["A-01 free", "A-02 clean", "A-03 Bruno", "A-04 hold", "B-01 free", "B-02 Rio", "C-01 Mochi", "C-02 clean", "D-01 maint"];
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Interactive kennel map</h2>
        <div className="mb-3 rounded-md border border-[#46433d] bg-[#242421] px-3 py-2 text-xs font-bold text-[#d8cfbf]">
          {tenant.occupancy} occupied · {tenant.region}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {units.map((unit) => {
            const occupied = unit.includes("Bruno") || unit.includes("Rio") || unit.includes("Mochi");
            const blocked = unit.includes("maint") || unit.includes("hold");
            return (
              <button
                key={unit}
                type="button"
                onClick={() => onEvent(`Opened unit ${unit.split(" ")[0]}`)}
                className={`rounded-md border p-3 text-left text-xs font-bold ${
                  blocked ? "border-[#8a6a2d] bg-[#3a3020] text-[#f2c66f]" : occupied ? "border-[#774747] bg-[#392727] text-[#f3b5a9]" : "border-[#28634d] bg-[#1f342b] text-[#79d9ae]"
                }`}
              >
                <div>{unit.split(" ")[0]}</div>
                <div className="mt-2 text-[11px]">{unit.split(" ").slice(1).join(" ")}</div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (active.id === "checkin") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Check-in transaction</h2>
        <div className="rounded-lg border border-[#46433d] bg-[#2c2c2a] p-4">
          {["Reservation found", "Vaccination verified", "Condition photo attached", "Medication handover", "Staff signature"].map((step, index) => (
            <button key={step} onClick={() => onEvent(`${step} completed`)} className="flex w-full items-center gap-3 border-b border-[#44413b] py-3 last:border-b-0" type="button">
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${index < 3 ? "bg-[#34c084] text-white" : "bg-[#efe1c4] text-[#8a5f19]"}`}>{index + 1}</span>
              <span className="text-sm font-bold">{step}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (active.id === "care") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Daily care board</h2>
        <div className="grid gap-3">
          {["Morning", "Afternoon", "Evening"].map((period) => (
            <div key={period} className="rounded-lg border border-[#46433d] bg-[#2c2c2a] p-3">
              <div className="mb-2 font-bold">{period}</div>
              <div className="grid gap-2">
                {["Feed", "Medication", "Play"].map((task) => (
                  <button key={task} onClick={() => onEvent(`${period} ${task.toLowerCase()} logged`)} className="flex items-center justify-between rounded-md bg-[#20201e] px-3 py-2 text-sm font-semibold" type="button">
                    <span>{task}</span>
                    <span className="rounded-full bg-[#ecf4ff] px-2 py-1 text-[11px] text-[#0d5c9d]">Log</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (active.id === "billing") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Invoice and POS</h2>
        <div className="rounded-lg border border-[#46433d] bg-[#2c2c2a] p-4">
          {[
            ["Boarding nights", "₹6,000"],
            ["Grooming add-on", "₹1,200"],
            ["GST", "₹1,296"]
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-[#44413b] py-2 text-sm font-semibold last:border-b-0">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <button onClick={() => onEvent("Razorpay payment captured")} className="mt-4 h-10 w-full rounded-md bg-[#34c084] font-bold text-white" type="button">
            Capture payment
          </button>
        </div>
      </section>
    );
  }

  if (active.id === "reports") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Reports dashboard</h2>
        <div className="grid gap-3">
          {["Occupancy", "Revenue", "Staff efficiency"].map((report, index) => (
            <button key={report} onClick={() => onEvent(`${report} CSV exported`)} className="rounded-lg border border-[#46433d] bg-[#2c2c2a] p-3 text-left" type="button">
              <div className="flex items-end gap-1">
                {[42, 68, 54, 81, 75].map((height, barIndex) => (
                  <span key={barIndex} className="w-8 rounded-t bg-[#34c084]" style={{ height: `${height / (index + 1.5)}px` }} />
                ))}
              </div>
              <div className="mt-3 font-bold">{report}</div>
              <div className="text-xs font-semibold text-[#cabead]">Tap to export CSV</div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (active.id === "admin") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Super admin controls</h2>
        <div className="rounded-lg border border-[#28634d] bg-[#1f342b] p-3 text-sm font-bold text-[#9ce4bf]">admin@example.com has all create, read, update, delete, and manage permissions.</div>
        <div className="mt-3 rounded-lg border border-[#46433d] bg-[#2c2c2a] p-3">
          <div className="text-xs font-bold uppercase text-[#d7cfbf]">Tenant administration</div>
          <div className="mt-2 text-sm font-bold">{tenant.name}</div>
          <div className="text-xs font-semibold text-[#cabead]">{tenant.users} users · {tenant.petsBoarding} pets boarding · {tenant.revenueMonthToDate} MTD</div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
          {["Users", "Roles", "Perms", "Audit", "Modules", "Billing", "Care", "Reports"].map((control) => (
            <button key={control} onClick={() => onEvent(`${control} control opened`)} className="rounded-md border border-[#46433d] bg-[#2c2c2a] p-2" type="button">
              {control}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {active.sections.map((section) => (
        <section key={section.title} className="mt-4">
          <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">{section.title}</h2>
          <CardList items={section.items.map((item) => [item.badge, item.title, item.meta, item.chip ?? "Open"])} onEvent={onEvent} />
        </section>
      ))}
    </>
  );
}

function CardList({ items, onEvent }: { items: string[][]; onEvent: (label: string) => void }) {
  return (
    <div className="mt-3 grid gap-3">
      {items.map(([badge, title, meta, chip]) => (
        <button key={title} type="button" onClick={() => onEvent(`${title} opened`)} className="flex min-h-[58px] w-full items-center gap-3 rounded-lg border border-[#4a4842] bg-[#2c2c2a] p-3 text-left">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e8f2ef] text-sm font-bold text-[#08735b]">{badge}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold">{title}</span>
            <span className="block truncate text-xs font-semibold text-[#cabead]">{meta}</span>
          </span>
          <span className="rounded-full bg-[#ecf4ff] px-2 py-1 text-xs font-bold text-[#0d5c9d]">{chip}</span>
        </button>
      ))}
    </div>
  );
}
