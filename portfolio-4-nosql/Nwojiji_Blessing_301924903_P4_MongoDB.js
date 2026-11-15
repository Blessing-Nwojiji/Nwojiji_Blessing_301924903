// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("appointment_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("appointment_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "appointment_created",
                    "appointment_rescheduled"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "appointment"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "appointment_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("appointment_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "appointment_rescheduled",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "reschedule_reason": "illustrative reschedule_reason",
                "cancellation_reason": "illustrative cancellation_reason",
                "completion_note": "illustrative completion_note"
            }
        }
    }
]));
  await db.getCollection("appointment_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("appointment_events").find({"eventType":"appointment_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("appointment_events").find({"source.key.appointment_id":4}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("appointment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("appointment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("appointment_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("appointment_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("appointment_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
