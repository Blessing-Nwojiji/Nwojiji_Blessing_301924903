# Hospital / Clinic System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| patient_id | appointment records (list) |
| --- | --- |
| 1 | [4] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| appointment.appointment_id | appointment.patient_id | appointment.clinician_id | appointment.clinic_id | appointment.status | patient.patient_id | patient.full_name | clinician.clinician_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 1 | 2 | 3 | scheduled | 1 | Alex Morgan | 2 |

Key: appointment_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## appointment_example

| appointment.appointment_id | appointment.patient_id | appointment.clinician_id | appointment.clinic_id | appointment.status | patient.patient_id | patient.full_name | clinician.clinician_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 1 | 2 | 3 | scheduled | 1 | Alex Morgan | 2 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## patient

| patient_id | full_name | birth_date | phone |
| --- | --- | --- | --- |
| 1 | Alex Morgan | 1985-04-12 | +1-555-0101 |

## clinician

| clinician_id | full_name | specialty |
| --- | --- | --- |
| 2 | Jordan Lee | Family Medicine |

## clinic

| clinic_id | name | city |
| --- | --- | --- |
| 3 | Riverside Clinic | Springfield |

## appointment

| appointment_id | patient_id | clinician_id | clinic_id | starts_at | status | duration_minutes | fee |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 1 | 2 | 3 | 2026-12-01T09:00:00+00:00 | scheduled | 30 | 75.5 |

## Dependencies

- patient: (patient_id) → full_name, birth_date, phone
- clinician: (clinician_id) → full_name, specialty
- clinic: (clinic_id) → name, city
- appointment: (appointment_id) → patient_id, clinician_id, clinic_id, starts_at, status, duration_minutes, fee

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
