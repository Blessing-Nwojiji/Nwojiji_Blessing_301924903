-- Fictional sample records for Hospital / Clinic System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."patient" ("patient_id", "full_name", "birth_date", "phone") VALUES (1, 'Alex Morgan', '1985-04-12', '+1-555-0101');
INSERT INTO portfolio."clinician" ("clinician_id", "full_name", "specialty") VALUES (2, 'Jordan Lee', 'Family Medicine');
INSERT INTO portfolio."clinic" ("clinic_id", "name", "city") VALUES (3, 'Riverside Clinic', 'Springfield');
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee") VALUES (4, 1, 2, 3, '2026-12-01T09:00:00Z', 'scheduled', 30, 75.5);
COMMIT;
