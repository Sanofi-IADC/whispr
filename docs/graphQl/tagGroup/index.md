# GraphQl TagGroup Endpoints

> In this section we will be providing examples that you can use inside your very own playground available here [http://localhost:3000/graphql](http://localhost:3000/graphql) (if you activated it).

## Query

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

## Mutation

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
