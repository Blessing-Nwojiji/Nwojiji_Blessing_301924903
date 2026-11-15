# Hospital / Clinic System — ER diagram

```mermaid
erDiagram
    direction LR
    patient {
        bigint patient_id PK
        text full_name
        date birth_date
        text phone "Optional"
    }
    clinician {
        bigint clinician_id PK
        text full_name
        text specialty
    }
    clinic {
        bigint clinic_id PK
        text name
        text city
    }
    appointment {
        bigint appointment_id PK
        bigint patient_id FK
        bigint clinician_id FK
        bigint clinic_id FK
        timestamptz starts_at
        text status
        integer duration_minutes
        numeric fee
    }
    patient ||--o{ appointment : "patient_id"
    clinician ||--o{ appointment : "clinician_id"
    clinic ||--o{ appointment : "clinic_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Nwojiji_Blessing_301924903_ERDiagram.png)
