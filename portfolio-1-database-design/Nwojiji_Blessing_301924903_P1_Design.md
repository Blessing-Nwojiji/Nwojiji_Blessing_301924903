# Hospital / Clinic System — database design

My case study records patient, clinician, clinic, appointment.

## Users

- Clinic reception staff
- Clinicians
- Clinic administrators

## Main operations

- Register patients and clinicians
- Record appointments and their status
- Review appointments by clinic and date

## Entities

| Entity | Information stored |
| --- | --- |
| patient | Stores a patient's identifying and contact details. |
| clinician | Stores clinicians who provide appointments. |
| clinic | Stores clinics where appointments take place. |
| appointment | Records a patient visit with its clinician, clinic, time, status, duration, and fee. |

## patient

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| patient_id | BIGINT | PK | Yes |
| full_name | TEXT |  | Yes |
| birth_date | DATE |  | Yes |
| phone | TEXT |  | No |


## clinician

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| clinician_id | BIGINT | PK | Yes |
| full_name | TEXT |  | Yes |
| specialty | TEXT |  | Yes |


## clinic

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| clinic_id | BIGINT | PK | Yes |
| name | TEXT |  | Yes |
| city | TEXT |  | Yes |


## appointment

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| appointment_id | BIGINT | PK | Yes |
| patient_id | BIGINT | FK | Yes |
| clinician_id | BIGINT | FK | Yes |
| clinic_id | BIGINT | FK | Yes |
| starts_at | TIMESTAMPTZ |  | Yes |
| status | TEXT |  | Yes |
| duration_minutes | INTEGER |  | Yes |
| fee | NUMERIC(18,2) |  | Yes |
- patient_id → patient.patient_id
- clinician_id → clinician.clinician_id
- clinic_id → clinic.clinic_id

## Relationships and business rules

- Every appointment must reference an existing patient.
- Every appointment must reference an existing clinician.
- Every appointment must reference an existing clinic.
- Appointment duration must be greater than zero minutes.
- At most one appointment with status scheduled may use a clinician and start time; enforce with a partial unique constraint on clinician_id and starts_at for scheduled rows.

## Assumptions

- Each patient, clinician, clinic, and appointment has a synthetic single-column identifier that is globally unique.
- Each appointment belongs to exactly one patient, one clinician, and one clinic.
- An appointment start time is stored as a timestamp; birth dates are stored as dates.
- Only one scheduled appointment may occupy a clinician's start time; other statuses do not reserve the slot.
- The model records a single appointment fee and duration, not billing or clinical records.

