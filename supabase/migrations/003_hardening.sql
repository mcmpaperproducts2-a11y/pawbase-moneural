REVOKE ALL ON users FROM anon, authenticated;
REVOKE ALL ON user_sessions FROM anon, authenticated;
REVOKE ALL ON password_resets FROM anon, authenticated;
REVOKE ALL ON audit_logs FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO service_role;
GRANT INSERT ON audit_logs TO service_role;

ALTER TABLE users ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE inventory_items ADD CONSTRAINT non_negative_stock CHECK (quantity_on_hand >= 0);

CREATE OR REPLACE FUNCTION check_reservation_conflict()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM reservations
    WHERE kennel_unit_id = NEW.kennel_unit_id
      AND id != NEW.id
      AND status NOT IN ('cancelled', 'no_show')
      AND daterange(check_in_date, check_out_date) && daterange(NEW.check_in_date, NEW.check_out_date)
  ) THEN
    RAISE EXCEPTION 'Kennel unit % is already reserved for these dates', NEW.kennel_unit_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER no_double_booking
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION check_reservation_conflict();
