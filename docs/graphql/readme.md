# GraphQL API

> In this section we will be providing examples that you can use inside your very own playground available here [http://localhost:3000/graphql](http://localhost:3000/graphql) (if you activated it).

## Whisps: Query

### whispById

Retrieves the matching whisp by its [`_id`](../../models/whisp.md#_id).

```GraphQL
query getWhispById($whispId: String!) {
  whispById(
    id: $whispId
  ) {
    _id # fields you want to retrieve from the whisp
  }
}
```

Query variables

```javascript
{ "whispId": "5ed644d46f91b10034d731f1" }
```

You can find the list of available fields [here](../../models/whisp.md).

### whisps

Retrieves all the whisps matching a set of conditions.

```GraphQL
query getWhisps($whisp: WhispInputType!) {
  whisps(whisp: $whisp) {
    _id # fields you want to retrieve from the whisp
  }
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to filter on
    }
}
```

If you want to retrieve all the whisps you can set the `whisp` parameter to `{}`

You can find the list of available fields [here](../../models/whisp.md).

### whispsCount

Returns the count of matching whisps.

It takes the same parameter as the query [whisps](#whisps)

```GraphQL
query getWhispCount($whisp: WhispInputType!) {
  whispsCount(whisp: $whisp)
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to filter on
    }
}
```

You can find the list of available fields [here](../../models/whisp.md).

## Whisps: Mutation

### createWhisp

Creates a new whisp.

```GraphQL
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id # fields you want to retrieve from the created whisp
  }
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to populate
    }
}
```

You can find the list of available fields [here](../../models/whisp.md).

### updateWhisp

Updates an existing whisp.

```GraphQL
mutation updateWhisp($whisp: WhispInputType!, $id: String) {
  updateWhisp(whisp: $whisp, id: $id) {
    _id # fields you want to retrieve from the updated whisp
  }
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to update
    },
    "id": "5ed644d46f91b10034d731f1"
}
```

You can find the list of available fields [here](../../models/whisp.md).

### replaceWhisp

Replaces an existing whisp. This endpoint has the same signature as [`updateWhisp`](#updateWhisp), however instead of updating the fields provided in the `whisp` parameter, it will instead replace the whisp in the database with the `whisp` parameter.

```GraphQL
mutation replaceWhisp($whisp: WhispInputType!, $id: String) {
  replaceWhisp(whisp: $whisp, id: $id) {
    _id # fields you want to retrieve from the updated whisp
  }
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to populate
    },
    "id": "5ed644d46f91b10034d731f1"
}
```

You can find the list of available fields [here](../../models/whisp.md).

### deleteWhisp

Deletes the matching whisp by its [`_id`](../../models/whisp.md#_id).

```GraphQL
mutation deleteWhispById($whispId: String!) {
  deleteWhisp(
    id: $whispId
  )
}
```

Query variables

```javascript
{ "whispId": "5ed644d46f91b10034d731f1" }
```

## Whisps: Subscription

### whispAdded

Subscribes the caller to the  'whispAdded' event. The caller will receive the new whisps that match the provided filter.

```GraphQL
subscription whispSubscription($whisp: WhispInputType!) {
  whispAdded(whisp: $whisp) {
    _id # fields you want to retrieve from the created whisp
  }
}
```

Query variables

```javascript
{
    "whisp": {
        "closed": false // fields you want to filter the created whisp on
    }
}
```

> In this section we will be providing examples that you can use inside your very own playground available here [http://localhost:3000/graphql](http://localhost:3000/graphql) (if you activated it).

## TagGroups: Query

### tagGroupById

Retrieves the matching tagGroup by its [`_id`](../../models/tagGroup.md#_id).

```GraphQL
query getTagGroupById($tagGroupId: String!) {
  tagGroupById(
    id: $tagGroupId
  ) {
    _id # fields you want to retrieve from the tagGroup
  }
}
```

Query variables

```javascript
{ "tagGroupId": "5ed644d46f91b10034d731f1" }
```

You can find the list of available fields [here](../../models/tagGroup.md).

### tagGroups

Retrieves all the tagGroups matching a set of conditions.

```GraphQL
query getTagGroups($tagGroup: TagGroupInputType!) {
  tagGroups(tagGroup: $tagGroup) {
    _id # fields you want to retrieve from the tagGroup
  }
}
```

Query variables

```javascript
{
    "tagGroup": {
        "title": "I'm looking for this specific title" // fields you want to filter on
    }
}
```

If you want to retrieve all the tagGroups you can set the `tagGroup` parameter to `{}`

You can find the list of available fields [here](../../models/tagGroup.md).

## TagGroups: Mutation

### createTagGroup

Creates a new tagGroup.

```GraphQL
mutation createTagGroup($tagGroup: TagGroupInputType!) {
  createTagGroup(tagGroup: $tagGroup) {
    _id # fields you want to retrieve from the created tagGroup
  }
}
```

Query variables

```javascript
{
    "tagGroup": {
        "title": "A great title for a new tagGroup" // fields you want to populate
    }
}
```

You can find the list of available fields [here](../../models/tagGroup.md).

### updateTagGroup

Updates an existing tagGroup.

```GraphQL
mutation updateTagGroup($tagGroup: TagGroupInputType!, $id: String) {
  updateTagGroup(tagGroup: $tagGroup, id: $id) {
    _id # fields you want to retrieve from the updated tagGroup
  }
}
```

Query variables

```javascript
{
    "tagGroup": {
        "title": "This title is definetly better" // fields you want to update
    },
    "id": "5ed644d46f91b10034d731f1"
}
```

You can find the list of available fields [here](../../models/tagGroup.md).

### replaceTagGroup

Replaces an existing tagGroup. This endpoint has the same signature as [`updateTagGroup`](#updateTagGroup), however instead of updating the fields provided in the `tagGroup` parameter, it will instead replace the tagGroup in the database with the `tagGroup` parameter.

```GraphQL
mutation replaceTagGroup($tagGroup: TagGroupInputType!, $id: String) {
  replaceTagGroup(tagGroup: $tagGroup, id: $id) {
    _id # fields you want to retrieve from the updated tagGroup
  }
}
```

Query variables

```javascript
{
    "tagGroup": {
        "title": "A really cool title" // fields you want to populate
    },
    "id": "5ed644d46f91b10034d731f1"
}
```

You can find the list of available fields [here](../../models/tagGroup.md).

### deleteTagGroup

Deletes the matching tagGroup by its [`_id`](../../models/tagGroup.md#_id).

```GraphQL
mutation deleteTagGroupById($tagGroupId: String!) {
  deleteTagGroup(
    id: $tagGroupId
  )
}
```

Query variables

```javascript
{ "tagGroupId": "5ed644d46f91b10034d731f1" }
```
