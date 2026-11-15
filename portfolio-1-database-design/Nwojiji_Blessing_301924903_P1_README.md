# Portfolio 1 — Database Design and Modelling

I organised the data into patient, clinician, clinic, appointment. The design document explains the fields, keys, relationships and business rules. The normalisation document shows the sample tables at 1NF, 2NF and 3NF.

## Database checks

| Table | Rows |
| --- | --- |
| patient | 1 |
| clinician | 1 |
| clinic | 1 |
| appointment | 1 |

The 26 invalid inserts were rejected at their expected constraints, and the valid sample rows remained unchanged.

## Files

- [Design](Nwojiji_Blessing_301924903_P1_Design.md)
- [ER diagram](Nwojiji_Blessing_301924903_P1_ERDiagram.md)
- [Normalisation](Nwojiji_Blessing_301924903_P1_Normalisation.md)
- [Schema](Nwojiji_Blessing_301924903_P1_Schema.sql)
- [Sample data](Nwojiji_Blessing_301924903_P1_SampleData.sql)
- [Constraint tests](Nwojiji_Blessing_301924903_P1_ConstraintTests.sql)
- [Table and constraint evidence](screenshots/Nwojiji_Blessing_301924903_P1_DatabaseResults.png)

## Run the SQL

Create a fresh PostgreSQL database. Run the schema first, then the sample data. Run the deliberately invalid statements in ConstraintTests.sql individually outside a transaction; each is expected to produce an error.

## References

- [PostgreSQL — constraints](https://www.postgresql.org/docs/17/ddl-constraints.html)

