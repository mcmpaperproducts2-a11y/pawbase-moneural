# PawBase ERP

PawBase is a mobile-first ERP foundation for kennel and pet boarding businesses.

This scaffold includes a working login module, custom JWT session handling, role-based permissions, protected routes, and a `super_admin` role with access to every control.

## Multi-Tenant SaaS Model

PawBase is modeled as a multi-tenant SaaS app:

- Every business is a `tenant`.
- Every operational record should carry `tenant_id`.
- Tenant users only read and mutate rows for their own tenant.
- Platform `super_admin` users can switch tenant context and manage all tenants.
- Tenant admins can manage users, roles, permissions, modules, billing, and audit logs only inside their own tenant.
- Owner portal users are scoped to `tenant_id + owner_id`.

The wireframe explorer includes sample tenants and a tenant switcher to show the intended platform-admin workflow.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000/login`.

Demo credentials:

```text
Email: admin@example.com
Password: admin123
Role: super_admin
```

## Auth And Roles

- Auth uses the application `users` model rather than Supabase Auth.
- Login validates credentials through `/api/auth/login`.
- Successful login sets an HTTP-only `pawbase_access` cookie.
- App routes under `/dashboard`, `/admin`, and other ERP modules are protected by middleware.
- `super_admin` bypasses permission checks and receives every module control in navigation and admin screens.

## Environment

Create `apps/web/.env.local` for real deployments:

```text
JWT_SECRET=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For login, add a row in `users`:

```text
email: admin@example.com
role: super_admin
is_active: true
password_hash: bcrypt hash of admin123
```

The service role key is used only inside server API routes. Do not expose it in `NEXT_PUBLIC_*` variables.

## Availability Notes

- Enable Supabase PITR in the Supabase dashboard for production.
- Use Vercel instant rollback for failed deploy recovery.
- Configure Sentry alerting for error-rate spikes above 1% in 5 minutes.
- Connect `/api/health` to UptimeRobot or Better Uptime for 1-minute checks.
