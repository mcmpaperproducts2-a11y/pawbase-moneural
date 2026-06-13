export type ModuleDefinition = {
  id: string;
  label: string;
  href: string;
  icon: string;
  summary: string;
  primaryAction: string;
  records: Array<{
    id: string;
    title: string;
    subtitle: string;
    status: string;
    amount?: string;
    data?: Record<string, string>;
  }>;
  transactions: Array<{
    id: string;
    label: string;
    at: string;
    by: string;
  }>;
};

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "gauge",
    summary: "Live operating view for occupancy, arrivals, departures, revenue, and alerts.",
    primaryAction: "Review today",
    records: [
      { id: "metric-1", title: "Current occupancy", subtitle: "34 of 50 units booked", status: "68%" },
      { id: "metric-2", title: "Today check-ins", subtitle: "Bailey, Luna, Rio", status: "3 due" },
      { id: "metric-3", title: "Pending invoices", subtitle: "Awaiting collection", status: "₹42,800" }
    ],
    transactions: [
      { id: "dash-tx-1", label: "Occupancy cache refreshed", at: "09:00", by: "System" },
      { id: "dash-tx-2", label: "Low stock alert raised", at: "09:12", by: "Inventory" }
    ]
  },
  {
    id: "reservations",
    label: "Reservations",
    href: "/reservations",
    icon: "calendar",
    summary: "Bookings, calendar availability, waitlist, confirmation, cancellation, and stay timelines.",
    primaryAction: "New reservation",
    records: [
      { id: "res-1042", title: "Bailey boarding stay", subtitle: "Asha Rao, Garden Suite 04", status: "confirmed", amount: "₹8,400" },
      { id: "res-1043", title: "Milo weekend care", subtitle: "Kabir Menon, Cat Condo 02", status: "checked_in", amount: "₹4,200" },
      { id: "res-1044", title: "Luna grooming add-on", subtitle: "Neha Shah, Deluxe 11", status: "waitlisted", amount: "₹2,100" }
    ],
    transactions: [
      { id: "res-tx-1", label: "Reservation confirmed", at: "08:15", by: "Front Desk" },
      { id: "res-tx-2", label: "WhatsApp confirmation queued", at: "08:16", by: "System" }
    ]
  },
  {
    id: "owners",
    label: "Owners",
    href: "/pets",
    icon: "users",
    summary: "Owner profiles, contacts, notes, emergency information, pets, and payment history inside Pets.",
    primaryAction: "Add owner",
    records: [
      { id: "own-201", title: "Asha Rao", subtitle: "2 pets, Bengaluru", status: "active" },
      { id: "own-202", title: "Kabir Menon", subtitle: "1 pet, Chennai", status: "active" },
      { id: "own-203", title: "Neha Shah", subtitle: "3 pets, Mumbai", status: "balance due" }
    ],
    transactions: [
      { id: "own-tx-1", label: "Emergency contact updated", at: "10:20", by: "Manager" },
      { id: "own-tx-2", label: "Invoice reminder sent", at: "10:28", by: "System" }
    ]
  },
  {
    id: "pets",
    label: "Pets",
    href: "/pets",
    icon: "paw",
    summary: "Owner and pet profiles, vaccinations, feeding instructions, special needs, photos, and history.",
    primaryAction: "Add pet",
    records: [
      { id: "pet-301", title: "Bailey", subtitle: "Golden Retriever, Asha Rao", status: "vaccines ok" },
      { id: "pet-302", title: "Milo", subtitle: "Persian cat, Kabir Menon", status: "boarding" },
      { id: "pet-303", title: "Luna", subtitle: "Indie dog, Neha Shah", status: "vaccine due" }
    ],
    transactions: [
      { id: "pet-tx-1", label: "Vaccination document uploaded", at: "11:05", by: "Reception" },
      { id: "pet-tx-2", label: "Feeding instruction changed", at: "11:17", by: "Owner portal" }
    ]
  },
  {
    id: "kennel",
    label: "Kennel",
    href: "/kennel",
    icon: "bed",
    summary: "Unit map, room status, maintenance blocks, kennel types, rates, and availability.",
    primaryAction: "Manage unit",
    records: [
      { id: "unit-a04", title: "Garden Suite 04", subtitle: "Bailey until 18 Jun", status: "occupied" },
      { id: "unit-c02", title: "Cat Condo 02", subtitle: "Milo until 16 Jun", status: "occupied" },
      { id: "unit-d11", title: "Deluxe 11", subtitle: "Ready for booking", status: "available" }
    ],
    transactions: [
      { id: "ken-tx-1", label: "Unit marked sanitized", at: "07:40", by: "Housekeeping" },
      { id: "ken-tx-2", label: "Maintenance hold released", at: "08:05", by: "Manager" }
    ]
  },
  {
    id: "checkin",
    label: "Check-in",
    href: "/checkin",
    icon: "clipboard",
    summary: "Arrival and departure workflows, signatures, condition notes, and checkout closeout.",
    primaryAction: "Start check-in",
    records: [
      { id: "chk-401", title: "Bailey arrival", subtitle: "Vaccination verified", status: "ready" },
      { id: "chk-402", title: "Milo check-out", subtitle: "Invoice pending", status: "payment due" },
      { id: "chk-403", title: "Rio arrival", subtitle: "Medication handover needed", status: "attention" }
    ],
    transactions: [
      { id: "chk-tx-1", label: "Condition photo attached", at: "09:44", by: "Reception" },
      { id: "chk-tx-2", label: "Check-in audit logged", at: "09:47", by: "System" }
    ]
  },
  {
    id: "care",
    label: "Care",
    href: "/care",
    icon: "heart",
    summary: "Daily care board, feeding, medication, exercise, mood, notes, and task completion.",
    primaryAction: "Log care",
    records: [
      { id: "care-501", title: "Morning feeding", subtitle: "Bailey, Luna, Rio", status: "6 complete" },
      { id: "care-502", title: "Medication round", subtitle: "Milo antibiotic", status: "due now" },
      { id: "care-503", title: "Evening play", subtitle: "Outdoor group A", status: "scheduled" }
    ],
    transactions: [
      { id: "care-tx-1", label: "Medication administered", at: "08:30", by: "Vet Staff" },
      { id: "care-tx-2", label: "Mood note saved", at: "08:52", by: "Groomer" }
    ]
  },
  {
    id: "health",
    label: "Health",
    href: "/health",
    icon: "stethoscope",
    summary: "Incidents, medical timelines, medication schedules, vet alerts, and vaccination reminders.",
    primaryAction: "Report incident",
    records: [
      { id: "hlth-601", title: "Luna vaccine expiry", subtitle: "DHPP due in 10 days", status: "amber" },
      { id: "hlth-602", title: "Milo medication course", subtitle: "2 doses remaining", status: "active" },
      { id: "hlth-603", title: "Bailey minor scrape", subtitle: "Owner notified", status: "resolved" }
    ],
    transactions: [
      { id: "hlth-tx-1", label: "Owner WhatsApp sent", at: "12:10", by: "System" },
      { id: "hlth-tx-2", label: "Vet SMS sent", at: "12:11", by: "System" }
    ]
  },
  {
    id: "billing",
    label: "Billing",
    href: "/billing",
    icon: "card",
    summary: "Invoices, POS, Razorpay payments, refunds, tax, receipts, and PDF downloads.",
    primaryAction: "Create invoice",
    records: [
      { id: "inv-701", title: "INV-701 Bailey stay", subtitle: "Issued to Asha Rao", status: "paid", amount: "₹8,400" },
      { id: "inv-702", title: "INV-702 Milo stay", subtitle: "UPI pending", status: "issued", amount: "₹4,200" },
      { id: "inv-703", title: "POS-113 Treats", subtitle: "Counter sale", status: "paid", amount: "₹650" }
    ],
    transactions: [
      { id: "bill-tx-1", label: "Razorpay order created", at: "13:05", by: "System" },
      { id: "bill-tx-2", label: "Receipt emailed", at: "13:07", by: "System" }
    ]
  },
  {
    id: "staff",
    label: "Staff",
    href: "/staff",
    icon: "activity",
    summary: "Team members, role assignment, shifts, task queues, and scheduling conflict checks.",
    primaryAction: "Assign shift",
    records: [
      { id: "stf-801", title: "Morning team", subtitle: "4 staff on shift", status: "covered" },
      { id: "stf-802", title: "Vet round", subtitle: "Dr. Iyer", status: "scheduled" },
      { id: "stf-803", title: "Care tasks", subtitle: "18 of 24 complete", status: "75%" }
    ],
    transactions: [
      { id: "stf-tx-1", label: "Shift conflict resolved", at: "14:15", by: "Manager" },
      { id: "stf-tx-2", label: "Task reassigned", at: "14:22", by: "Manager" }
    ]
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: "package",
    summary: "Stock levels, receiving, consumption, retail items, reorder alerts, and POS availability.",
    primaryAction: "Receive stock",
    records: [
      { id: "stk-901", title: "Chicken kibble 10kg", subtitle: "12 bags on hand", status: "ok" },
      { id: "stk-902", title: "Cat litter", subtitle: "3 bags on hand", status: "reorder" },
      { id: "stk-903", title: "Dental chews", subtitle: "Retail POS item", status: "selling" }
    ],
    transactions: [
      { id: "inv-tx-1", label: "Purchase received", at: "15:03", by: "Inventory" },
      { id: "inv-tx-2", label: "Boarding consumption logged", at: "15:14", by: "Care Team" }
    ]
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: "activity",
    summary: "Occupancy, revenue, demographics, staff efficiency, financial exports, and CSV downloads.",
    primaryAction: "Export CSV",
    records: [
      { id: "rpt-1001", title: "Occupancy trend", subtitle: "Last 30 days", status: "68% avg" },
      { id: "rpt-1002", title: "Revenue report", subtitle: "June month-to-date", status: "₹3.2L" },
      { id: "rpt-1003", title: "Staff efficiency", subtitle: "Daily task completion", status: "91%" }
    ],
    transactions: [
      { id: "rpt-tx-1", label: "Revenue CSV exported", at: "16:00", by: "Manager" },
      { id: "rpt-tx-2", label: "Report cache refreshed", at: "16:05", by: "System" }
    ]
  },
  {
    id: "admin",
    label: "Admin",
    href: "/admin",
    icon: "settings",
    summary: "Users, roles, permissions, modules, audit logs, security settings, and system controls.",
    primaryAction: "Manage users",
    records: [
      { id: "adm-1101", title: "PawBase Super Admin", subtitle: "admin@pawbase.app", status: "super_admin" },
      { id: "adm-1102", title: "Kennel Manager", subtitle: "manager@pawbase.app", status: "manager" },
      { id: "adm-1103", title: "Front Desk", subtitle: "reception@pawbase.app", status: "receptionist" }
    ],
    transactions: [
      { id: "adm-tx-1", label: "Permission matrix saved", at: "17:12", by: "Super Admin" },
      { id: "adm-tx-2", label: "Password reset issued", at: "17:18", by: "Super Admin" }
    ]
  }
];

export const primaryModules = ["dashboard", "reservations", "pets", "checkin", "admin"];

export function getModuleDefinition(id: string) {
  return moduleDefinitions.find((module) => module.id === id);
}

export function getModuleByHref(pathname: string) {
  return moduleDefinitions.find((module) => pathname === module.href || pathname.startsWith(`${module.href}/`));
}
