# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection appointment_events for appointment_created and appointment_rescheduled events. These are fictional event examples based on appointment, patient, clinician, clinic.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related patient, clinician, clinic details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "appointment_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "appointment",
        "key": {
            "appointment_id": 4
        },
        "snapshot": {
            "appointment_id": 4,
            "patient_id": 1,
            "clinician_id": 2,
            "clinic_id": 3,
            "starts_at": "2026-12-01T09:00:00Z",
            "status": "scheduled",
            "duration_minutes": 30,
            "fee": 75.5
        }
    },
    "embedded": {
        "patient": [
            {
                "key": {
                    "patient_id": 1
                },
                "snapshot": {
                    "patient_id": 1,
                    "full_name": "Alex Morgan",
                    "birth_date": "1985-04-12",
                    "phone": "+1-555-0101"
                },
                "via": [
                    "appointment.patient_id → patient"
                ]
            }
        ],
        "clinician": [
            {
                "key": {
                    "clinician_id": 2
                },
                "snapshot": {
                    "clinician_id": 2,
                    "full_name": "Jordan Lee",
                    "specialty": "Family Medicine"
                },
                "via": [
                    "appointment.clinician_id → clinician"
                ]
            }
        ],
        "clinic": [
            {
                "key": {
                    "clinic_id": 3
                },
                "snapshot": {
                    "clinic_id": 3,
                    "name": "Riverside Clinic",
                    "city": "Springfield"
                },
                "via": [
                    "appointment.clinic_id → clinic"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 1 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 2 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("appointment_events").find({"eventType":"appointment_created"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "appointment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "appointment_id": 4
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("appointment_events").find({"source.key.appointment_id":4}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "appointment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "appointment_id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "appointment_rescheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "appointment_id": 4
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("appointment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "appointment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "appointment_id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "appointment_rescheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "appointment_id": 4
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("appointment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| appointment_created | 1 |
| appointment_rescheduled | 1 |

## Validation and suitability

MongoDB inserted 2 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 2 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Nwojiji_Blessing_301924903_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Nwojiji_Blessing_301924903_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

