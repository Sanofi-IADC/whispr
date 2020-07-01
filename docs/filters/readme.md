# Filters

Our GraphQL and REST endpoints sometimes offer you the possibility to filter, here is 
how this variable works:

#### No filter
```json
{
  "filter": {}
}
```

#### Simple filter
```json
{
  "filter": { "att1": "value1" }
}
```

#### Filter on nested field
```json
{
  "filter": { "att1.att2": "value2" }
}
```

#### Filter on object
```json
{
  "filter": { "att1": { "att2": "value2" } }
}
```

#### Differences between Filter on nested field and Filter on object

This object will be returned by both the "Filter on nested field" and the "Filter on object":
```json
{
  "att1": {
    "att2": "value2",
  }
}
```

This object will be returned by the "Filter on nested field" but not by the "Filter on object":
```json
{
  "att1": {
    "att2": "value2",
    "att3": "value3"
  }
}
```

#### Filter with array
```json
{
  "filter": { "att1": [ "value1", "value2" ] }
}
```

#### Additional filtering functionality
Additionally some endpoints offer you the possibility to use all mongo
filtering options. This is specified in the endpoint documentation.

For example, to match all values that are not equal to a 
specified value, you can do:

```json
{
  "filter": { "att1": { "$ne": "value1" } }
}
```
