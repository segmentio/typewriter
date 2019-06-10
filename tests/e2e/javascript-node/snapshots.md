```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "Empty Event",
    "properties": {},
    "type": "track",
    "userId": "user-1234"
}
```

```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "Event with All Types",
    "properties": {
        "required any": 123,
        "required array": [
            {
                "required sub-property": "Hello World"
            }
        ],
        "required array (empty)": [
            123,
            "Hello World"
        ],
        "required boolean": false,
        "required int": 123,
        "required nullable string": null,
        "required number": 3.1415,
        "required number or string": 123,
        "required object": {
            "required sub-property": "Hello World"
        },
        "required object (empty)": {
            "anything": "works"
        },
        "required string": "Hello World",
        "required string regex": "FOO"
    },
    "type": "track",
    "userId": "user-1234"
}
```

```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "42_--terrible==\"event'++name~!3",
    "properties": {
        "0000---terrible-property-name~!3": "foobar",
        "propertyNameCollision": "camelcase",
        "property_name_collision": "snakecase"
    },
    "type": "track",
    "userId": "user-1234"
}
```

```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "example naming collision",
    "properties": {},
    "type": "track",
    "userId": "user-1234"
}
```

```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "example_naming_collision",
    "properties": {},
    "type": "track",
    "userId": "user-1234"
}
```

```json
{
    "_metadata": {
        "nodeVersion": "10.15.3"
    },
    "context": {
        "library": {
            "name": "analytics-node",
            "version": "3.3.0"
        },
        "typewriter": {
            "language": "javascript",
            "version": "7.0.0"
        }
    },
    "event": "Violation Handler Test",
    "properties": {
        "required string regex": "YES"
    },
    "type": "track",
    "userId": "user-1234"
}
```