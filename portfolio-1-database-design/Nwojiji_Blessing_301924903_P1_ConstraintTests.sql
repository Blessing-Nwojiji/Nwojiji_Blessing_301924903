-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. patient pk. Expected: pk_patient, SQLSTATE 23505.
INSERT INTO portfolio."patient" ("patient_id", "full_name", "birth_date", "phone")
VALUES (1, 'Casey Taylor', '1990-08-20', NULL);

-- 2. patient id nn. Expected: patient_id, SQLSTATE 23502.
INSERT INTO portfolio."patient" ("patient_id", "full_name", "birth_date", "phone")
VALUES (NULL, 'Casey Taylor', '1990-08-20', NULL);

-- 3. patient name nn. Expected: full_name, SQLSTATE 23502.
INSERT INTO portfolio."patient" ("patient_id", "full_name", "birth_date", "phone")
VALUES (9001, NULL, '1990-08-20', NULL);

-- 4. patient birth nn. Expected: birth_date, SQLSTATE 23502.
INSERT INTO portfolio."patient" ("patient_id", "full_name", "birth_date", "phone")
VALUES (9002, 'Casey Taylor', NULL, NULL);

-- 5. clinician pk. Expected: pk_clinician, SQLSTATE 23505.
INSERT INTO portfolio."clinician" ("clinician_id", "full_name", "specialty")
VALUES (2, 'Riley Chen', 'Pediatrics');

-- 6. clinician id nn. Expected: clinician_id, SQLSTATE 23502.
INSERT INTO portfolio."clinician" ("clinician_id", "full_name", "specialty")
VALUES (NULL, 'Riley Chen', 'Pediatrics');

-- 7. clinician name nn. Expected: full_name, SQLSTATE 23502.
INSERT INTO portfolio."clinician" ("clinician_id", "full_name", "specialty")
VALUES (9003, NULL, 'Pediatrics');

-- 8. clinician specialty nn. Expected: specialty, SQLSTATE 23502.
INSERT INTO portfolio."clinician" ("clinician_id", "full_name", "specialty")
VALUES (9004, 'Riley Chen', NULL);

-- 9. clinic pk. Expected: pk_clinic, SQLSTATE 23505.
INSERT INTO portfolio."clinic" ("clinic_id", "name", "city")
VALUES (3, 'Hilltop Clinic', 'Riverton');

-- 10. clinic id nn. Expected: clinic_id, SQLSTATE 23502.
INSERT INTO portfolio."clinic" ("clinic_id", "name", "city")
VALUES (NULL, 'Hilltop Clinic', 'Riverton');

-- 11. clinic name nn. Expected: name, SQLSTATE 23502.
INSERT INTO portfolio."clinic" ("clinic_id", "name", "city")
VALUES (9005, NULL, 'Riverton');

-- 12. clinic city nn. Expected: city, SQLSTATE 23502.
INSERT INTO portfolio."clinic" ("clinic_id", "name", "city")
VALUES (9006, 'Hilltop Clinic', NULL);

-- 13. appointment pk. Expected: pk_appointment, SQLSTATE 23505.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (4, 1, 2, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 14. appointment patient fk. Expected: fk_appointment_0, SQLSTATE 23503.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9007, 9008, 2, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 15. appointment clinician fk. Expected: fk_appointment_1, SQLSTATE 23503.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9009, 1, 9010, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 16. appointment clinic fk. Expected: fk_appointment_2, SQLSTATE 23503.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9011, 1, 2, 9012, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 17. appointment id nn. Expected: appointment_id, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (NULL, 1, 2, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 18. appointment patient nn. Expected: patient_id, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9013, NULL, 2, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 19. appointment clinician nn. Expected: clinician_id, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9014, 1, NULL, 3, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 20. appointment clinic nn. Expected: clinic_id, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9015, 1, 2, NULL, '2026-12-02T09:00:00Z', 'completed', 30, 75.5);

-- 21. appointment starts nn. Expected: starts_at, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9016, 1, 2, 3, NULL, 'completed', 30, 75.5);

-- 22. appointment status nn. Expected: status, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9017, 1, 2, 3, '2026-12-02T09:00:00Z', NULL, 30, 75.5);

-- 23. appointment duration nn. Expected: duration_minutes, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9018, 1, 2, 3, '2026-12-02T09:00:00Z', 'completed', NULL, 75.5);

-- 24. appointment fee nn. Expected: fee, SQLSTATE 23502.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9019, 1, 2, 3, '2026-12-02T09:00:00Z', 'completed', 30, NULL);

-- 25. appointment duration check. Expected: appointment_duration_positive, SQLSTATE 23514.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9020, 1, 2, 3, '2026-12-02T09:00:00Z', 'completed', 0, 75.5);

-- 26. appointment slot unique. Expected: appointment_slot, SQLSTATE 23505.
INSERT INTO portfolio."appointment" ("appointment_id", "patient_id", "clinician_id", "clinic_id", "starts_at", "status", "duration_minutes", "fee")
VALUES (9021, 1, 2, 3, '2026-12-01T09:00:00Z', 'scheduled', 30, 75.5);
