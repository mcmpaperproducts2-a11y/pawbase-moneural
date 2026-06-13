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
  LogIn,
  LogOut,
  Map,
  PawPrint,
  Plus,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { sampleTenants } from "@/lib/data/sample-saas-data";

type ScreenId = "dashboard" | "reservations" | "entry" | "kennel" | "checkin" | "care" | "billing" | "reports" | "admin";

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
    id: "entry",
    label: "Entry",
    title: "New reservation entry",
    icon: Plus,
    stats: [
      { label: "Owner", value: "Select" },
      { label: "Pet", value: "Select" },
      { label: "Quote", value: "₹0" },
      { label: "Status", value: "Draft", tone: "amber" }
    ],
    sections: [
      {
        title: "Reservation entry",
        items: [
          { badge: "1", title: "Owner and pet", meta: "Search existing owner or add a new profile", chip: "Open" },
          { badge: "2", title: "Dates and unit", meta: "Choose check-in, check-out, kennel type, unit", chip: "Open" },
          { badge: "3", title: "Services and quote", meta: "Add grooming, meals, transport, discounts", chip: "Open" }
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

const bottomNav: ScreenId[] = ["dashboard", "reservations", "entry", "kennel", "checkin", "care", "billing", "reports", "admin"];

const entryForms = [
  {
    id: "reservation",
    label: "Reservation",
    fields: ["Owner", "Pet", "Check-in", "Check-out", "Kennel unit", "Services", "Quote", "Deposit"]
  },
  {
    id: "owner",
    label: "Owner",
    fields: ["Name", "Email", "Primary phone", "Address", "Emergency contact", "Notes"]
  },
  {
    id: "pet",
    label: "Pet",
    fields: ["Owner", "Name", "Species", "Breed", "Weight", "Temperament", "Vaccinations", "Feeding notes"]
  },
  {
    id: "kennel",
    label: "Kennel",
    fields: ["Unit number", "Type", "Capacity", "Rate", "Status", "Maintenance notes"]
  },
  {
    id: "checkin",
    label: "Check-in/out",
    fields: ["Reservation", "Condition notes", "Photo", "Documents", "Medication handover", "Staff signature"]
  },
  {
    id: "care",
    label: "Care log",
    fields: ["Pet", "Feeding", "Medication", "Exercise", "Mood", "Care notes"]
  },
  {
    id: "incident",
    label: "Incident",
    fields: ["Pet", "Severity", "Description", "Action taken", "Owner notified", "Vet notified"]
  },
  {
    id: "billing",
    label: "Invoice",
    fields: ["Owner", "Reservation", "Line items", "Discount", "GST", "Payment method", "Receipt"]
  },
  {
    id: "staff",
    label: "Staff shift",
    fields: ["Staff member", "Role", "Shift date", "Start time", "End time", "Assigned tasks"]
  },
  {
    id: "inventory",
    label: "Inventory",
    fields: ["Item", "Category", "Quantity", "Unit cost", "Reorder level", "Supplier"]
  },
  {
    id: "admin",
    label: "User / role",
    fields: ["Tenant", "User", "Email", "Role", "Module permissions", "Active status"]
  }
];

export function WireframeExplorer() {
  const [activeId, setActiveId] = useState<ScreenId>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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
              <span className="text-center">{isLoggedIn ? active.label : "Login"}</span>
              <span />
            </div>
            <div className="mt-7 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold leading-tight">{isLoggedIn ? active.title : "Sign in to PawBase"}</h1>
                <p className="text-sm text-[#d5c9b7]">
                  {isLoggedIn ? `${tenant.name} · ${tenant.plan} plan` : "admin@example.com · admin123"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn((current) => !current);
                  pushEvent(isLoggedIn ? "Logged out" : "Logged in as super admin");
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#514f49] text-[#ddd5c7]"
                aria-label={isLoggedIn ? "Log out" : "Log in"}
                title={isLoggedIn ? "Log out" : "Log in"}
              >
                {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
              </button>
            </div>
            {isLoggedIn ? (
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
            ) : null}
          </div>

          <div className="max-h-[660px] min-h-[630px] overflow-y-auto px-4 pb-24 pt-4">
            {isLoggedIn ? (
              <>
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

                <ModulePanel active={active} tenant={tenant} onEvent={pushEvent} onNavigate={setActiveId} />

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
              </>
            ) : (
              <LoginPanel
                onLogin={() => {
                  setIsLoggedIn(true);
                  setActiveId("dashboard");
                  pushEvent("Logged in as super admin");
                }}
              />
            )}
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

function ModulePanel({
  active,
  tenant,
  onEvent,
  onNavigate
}: {
  active: Screen;
  tenant: (typeof sampleTenants)[number];
  onEvent: (label: string) => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  if (active.id === "reservations") {
    return (
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Reservation pipeline</h2>
        <div className="mb-3 rounded-md border border-[#46433d] bg-[#242421] px-3 py-2 text-xs font-bold text-[#d8cfbf]">
          Tenant-scoped bookings for {tenant.name}
        </div>
        <button
          type="button"
          onClick={() => {
            onEvent("New reservation entry started");
            onNavigate("entry");
          }}
          className="mb-3 flex min-h-[58px] w-full items-center gap-3 rounded-lg border border-[#2fad7e] bg-[#18382d] p-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#34c084] text-white">
            <Plus size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">New reservation entry</span>
            <span className="block truncate text-xs font-semibold text-[#bce8d5]">Owner, pet, dates, unit, services, quote</span>
          </span>
          <span className="rounded-full bg-[#ecf4ff] px-2 py-1 text-xs font-bold text-[#0d5c9d]">New</span>
        </button>
        <div className="mb-3 rounded-lg border border-[#46433d] bg-[#2c2c2a] p-3">
          <div className="mb-2 text-xs font-bold uppercase text-[#d7cfbf]">Quick entry form</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {["Owner", "Pet", "Dates", "Unit"].map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => onEvent(`${field} selected for new reservation`)}
                className="h-10 rounded-md border border-[#4a4842] bg-[#20201e] px-2 text-left text-[#f6f1e8]"
              >
                {field}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onEvent("Reservation saved as confirmed")}
            className="mt-3 h-10 w-full rounded-md bg-[#34c084] text-sm font-bold text-white"
          >
            Save reservation
          </button>
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

  if (active.id === "entry") {
    return <EntryPanel tenant={tenant} onEvent={onEvent} onNavigate={onNavigate} />;
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

function EntryPanel({
  tenant,
  onEvent,
  onNavigate
}: {
  tenant: (typeof sampleTenants)[number];
  onEvent: (label: string) => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  const [selectedFormId, setSelectedFormId] = useState(entryForms[0].id);
  const selectedForm = entryForms.find((form) => form.id === selectedFormId) ?? entryForms[0];

  return (
    <section className="mt-4">
      <h2 className="mb-3 text-sm font-bold uppercase text-[#d7cfbf]">Data entry hub</h2>
      <div className="rounded-lg border border-[#2fad7e] bg-[#18382d] p-3 text-xs font-bold text-[#bce8d5]">
        All records created here are tenant-scoped to {tenant.name}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {entryForms.map((form) => (
          <button
            key={form.id}
            type="button"
            onClick={() => {
              setSelectedFormId(form.id);
              onEvent(`${form.label} entry selected`);
            }}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-bold ${
              selectedFormId === form.id
                ? "border-[#34c084] bg-[#34c084] text-white"
                : "border-[#4a4842] bg-[#20201e] text-[#d8cfbf]"
            }`}
          >
            {form.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 rounded-lg border border-[#46433d] bg-[#2c2c2a] p-3">
        <div>
          <div className="text-xs font-bold uppercase text-[#d7cfbf]">Active form</div>
          <div className="mt-1 text-lg font-bold">{selectedForm.label}</div>
        </div>
        {selectedForm.fields.map((field, index) => (
          <button
            key={field}
            type="button"
            onClick={() => onEvent(`${selectedForm.label}: ${field} edited`)}
            className="flex min-h-11 items-center justify-between rounded-md border border-[#4a4842] bg-[#20201e] px-3 text-left"
          >
            <span>
              <span className="block text-[11px] font-bold uppercase text-[#cabead]">{field}</span>
              <span className="block text-sm font-bold text-[#f6f1e8]">{sampleFieldValue(field, index)}</span>
            </span>
            <span className="rounded-full bg-[#ecf4ff] px-2 py-1 text-xs font-bold text-[#0d5c9d]">Edit</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            onEvent(`${selectedForm.label} saved`);
            if (selectedForm.id === "reservation") {
              onNavigate("reservations");
            }
          }}
          className="h-11 rounded-md bg-[#34c084] text-sm font-bold text-white"
        >
          Save {selectedForm.label.toLowerCase()}
        </button>
      </div>
    </section>
  );
}

function sampleFieldValue(field: string, index: number) {
  const values: Record<string, string> = {
    Owner: "Asha Rao",
    Pet: "Bruno",
    "Check-in": "15 Jun 2026",
    "Check-out": "19 Jun 2026",
    "Kennel unit": "Garden A-03",
    Services: "Boarding + grooming",
    Quote: "₹8,400",
    Deposit: "₹2,000",
    Name: "Bruno",
    Email: "admin@example.com",
    "Primary phone": "+91 98000 00001",
    Address: "Bengaluru",
    "Emergency contact": "Kabir Menon",
    Notes: "Handle with care",
    Species: "Dog",
    Breed: "Weimaraner",
    Weight: "24 kg",
    Temperament: "Social",
    Vaccinations: "Rabies valid",
    "Feeding notes": "Twice daily",
    "Unit number": "A-03",
    Type: "Garden Suite",
    Capacity: "1 pet",
    Rate: "₹1,800/night",
    Status: "Available",
    "Maintenance notes": "Sanitized",
    Reservation: "BLR-1042",
    "Condition notes": "Healthy arrival",
    Photo: "Attached",
    Documents: "Verified",
    "Medication handover": "None",
    "Staff signature": "Priya",
    Feeding: "Morning complete",
    Medication: "Due at 4pm",
    Exercise: "Yard group A",
    Mood: "Happy",
    "Care notes": "Ate well",
    Severity: "Medium",
    Description: "Minor scrape",
    "Action taken": "Cleaned and logged",
    "Owner notified": "Yes",
    "Vet notified": "No",
    "Line items": "Boarding, grooming",
    Discount: "0%",
    GST: "18%",
    "Payment method": "UPI",
    Receipt: "Email + WhatsApp",
    "Staff member": "Priya Nair",
    Role: "Manager",
    "Shift date": "13 Jun 2026",
    "Start time": "09:00",
    "End time": "17:00",
    "Assigned tasks": "Care board",
    Item: "Royal Canin",
    Category: "Food",
    Quantity: "12",
    "Unit cost": "₹1,200",
    "Reorder level": "10",
    Supplier: "Pet Supply Co",
    Tenant: "PawBase Bengaluru",
    User: "PawBase Super Admin",
    "Module permissions": "All controls",
    "Active status": "Active"
  };

  return values[field] ?? `Sample value ${index + 1}`;
}

function LoginPanel({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-[#46433d] bg-[#2c2c2a] p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#34c084] text-white">
            <LockKeyhole size={18} />
          </span>
          <div>
            <div className="font-bold">Super admin login</div>
            <div className="text-xs font-semibold text-[#cabead]">Multi-tenant SaaS control center</div>
          </div>
        </div>
        <label className="grid gap-2 text-xs font-bold uppercase text-[#d7cfbf]">
          Email
          <input className="h-10 rounded-md border border-[#4a4842] bg-[#20201e] px-3 text-sm normal-case text-[#f6f1e8]" value="admin@example.com" readOnly />
        </label>
        <label className="mt-3 grid gap-2 text-xs font-bold uppercase text-[#d7cfbf]">
          Password
          <input className="h-10 rounded-md border border-[#4a4842] bg-[#20201e] px-3 text-sm normal-case text-[#f6f1e8]" value="admin123" readOnly type="password" />
        </label>
        <button type="button" onClick={onLogin} className="mt-4 h-11 w-full rounded-md bg-[#34c084] font-bold text-white">
          Login
        </button>
      </div>
      <div className="rounded-lg border border-[#46433d] bg-[#242421] p-3 text-xs font-semibold text-[#d8cfbf]">
        Supabase login also exists at /login and uses the users table when environment variables are configured.
      </div>
    </section>
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
