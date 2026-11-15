# Hospital / Clinic System — SQL queries

## 1. Show related appointment, patient, clinician records (up to 20).

```sql
SELECT t0."appointment_id" AS "appointment_appointment_id",
       t0."starts_at" AS "appointment_starts_at",
       t1."patient_id" AS "patient_patient_id",
       t1."full_name" AS "patient_full_name",
       t2."clinician_id" AS "clinician_clinician_id",
       t2."full_name" AS "clinician_full_name"
FROM portfolio."appointment" t0
JOIN portfolio."patient" t1 ON t0."patient_id" = t1."patient_id"
JOIN portfolio."clinician" t2 ON t0."clinician_id" = t2."clinician_id"
ORDER BY t0."appointment_id", t1."patient_id", t2."clinician_id"
LIMIT 20;
```

| appointment_appointment_id | appointment_starts_at | patient_patient_id | patient_full_name | clinician_clinician_id | clinician_full_name |
| --- | --- | --- | --- | --- | --- |
| 4 | 2026-12-01T09:00:00+00:00 | 1 | Alex Morgan | 2 | Jordan Lee |

## 2. Find appointment records where starts_at matches "2026-12-01T09:00:00Z" (up to 20).

```sql
SELECT * FROM portfolio."appointment"
WHERE "starts_at" IS NOT DISTINCT FROM '2026-12-01T09:00:00Z'
ORDER BY "appointment_id"
LIMIT 20;
```

| appointment_id | patient_id | clinician_id | clinic_id | starts_at | status | duration_minutes | fee |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 1 | 2 | 3 | 2026-12-01T09:00:00+00:00 | scheduled | 30 | 75.5 |

## 3. Count appointment records for each patient_id (up to 20 groups).

```sql
SELECT "patient_id", count(*) AS record_count
FROM portfolio."appointment"
GROUP BY "patient_id"
ORDER BY record_count DESC, "patient_id" NULLS LAST
LIMIT 20;
```

| patient_id | record_count |
| --- | --- |
| 1 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.257 | 1.213, 1.257, 1.979 | Sort → Seq Scan | 139 |
| After index | 0.185 | 0.183, 0.185, 0.223 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 30 |

The median execution time changed from 1.257 ms to 0.185 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.175..1.177 rows=25 loops=1)
  Seq Scan on appointment (actual time=0.014..1.143 rows=25 loops=1)
Planning Time: 0.315 ms
Execution Time: 1.213 ms
```

### Before index, run 2

```text
Sort (actual time=1.232..1.234 rows=25 loops=1)
  Seq Scan on appointment (actual time=0.015..1.198 rows=25 loops=1)
Planning Time: 0.316 ms
Execution Time: 1.257 ms
```

### Before index, run 3

```text
Sort (actual time=1.942..1.944 rows=25 loops=1)
  Seq Scan on appointment (actual time=0.02..1.893 rows=25 loops=1)
Planning Time: 0.436 ms
Execution Time: 1.979 ms
```

### After index, run 1

```text
Sort (actual time=0.129..0.131 rows=25 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.028..0.095 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.015 rows=25 loops=1)
Planning Time: 0.506 ms
Execution Time: 0.183 ms
```

### After index, run 2

```text
Sort (actual time=0.131..0.132 rows=25 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.027..0.096 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=25 loops=1)
Planning Time: 0.574 ms
Execution Time: 0.185 ms
```

### After index, run 3

```text
Sort (actual time=0.169..0.171 rows=25 loops=1)
  Bitmap Heap Scan on appointment (actual time=0.029..0.105 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=25 loops=1)
Planning Time: 0.538 ms
Execution Time: 0.223 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Nwojiji_Blessing_301924903_P2_Queries.sql, then Nwojiji_Blessing_301924903_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Nwojiji_Blessing_301924903_P2_QueryResults.png) · [Index comparison](screenshots/Nwojiji_Blessing_301924903_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

