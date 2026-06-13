INSERT INTO tenants (id, name, slug, plan, region, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'PawBase Bengaluru', 'pawbase-bengaluru', 'enterprise', 'India South', true),
  ('20000000-0000-0000-0000-000000000002', 'PawBase Mumbai', 'pawbase-mumbai', 'growth', 'India West', true),
  ('20000000-0000-0000-0000-000000000003', 'PawBase Delhi', 'pawbase-delhi', 'starter', 'India North', true);

INSERT INTO users (id, tenant_id, email, full_name, role, is_active, password_hash)
VALUES
  ('00000000-0000-0000-0000-000000000001', null, 'admin@example.com', 'PawBase Super Admin', 'super_admin', true, '$2b$12$TVERYqEAA9bXvleHwseUeOGrxVYDX1VcIibPgiGw2ptEGvu3MDLTe'),
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'manager@pawbase.app', 'Bengaluru Manager', 'manager', true, 'replace-with-bcrypt-hash'),
  ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'reception@pawbase.app', 'Bengaluru Front Desk', 'receptionist', true, 'replace-with-bcrypt-hash'),
  ('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'mumbai.manager@pawbase.app', 'Mumbai Manager', 'manager', true, 'replace-with-bcrypt-hash');

INSERT INTO kennel_types (id, tenant_id, name, description, base_rate, capacity)
VALUES
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Garden Suite', 'Outdoor-adjacent premium unit', 1800, 1),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Cat Condo', 'Quiet feline boarding unit', 1200, 1),
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Mumbai Deluxe', 'Premium city boarding unit', 2200, 1);

INSERT INTO owners (id, tenant_id, first_name, last_name, email, phone_primary)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Asha', 'Rao', 'asha@example.com', '+919800000001'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Kabir', 'Menon', 'kabir@example.com', '+919800000002'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Neha', 'Shah', 'neha@example.com', '+919800000003');

INSERT INTO pets (id, tenant_id, owner_id, name, species, breed, temperament)
VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Bruno', 'dog', 'Weimaraner', 'social'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Rio', 'dog', 'Beagle', 'playful'),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'Mochi', 'cat', 'Persian', 'quiet');

INSERT INTO reservations (id, tenant_id, pet_id, owner_id, status, check_in_date, check_out_date, total_amount)
VALUES
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'checked_in', CURRENT_DATE, CURRENT_DATE + 4, 8400),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'confirmed', CURRENT_DATE + 1, CURRENT_DATE + 5, 7200),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'checked_in', CURRENT_DATE, CURRENT_DATE + 2, 4820);
