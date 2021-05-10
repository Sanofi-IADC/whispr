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

```json
{ "whispId": "5ed644d46f91b10034d731f1" }
```

You can find the list of available fields [here](../../models/whisp.md).

### whisps

Retrieves all the whisps matching a set of conditions.

```GraphQL
query getWhisps($filter: JSONObject!, $sort: JSONObject, $limit: Int) {
  whisps(filter: $filter, sort: $sort, limit: $limit) {
    _id # fields you want to retrieve from the whisp
  }
}
```

You can find the list of available fields [here](../../models/whisp.md).

Query variables

```json
{
  "filter": { "att1": "value1" },
  "sort": { "att1": 1  },
  "limit": 3
}
```

* The filtering options are described [here](./filters.md).
* The `/whisps` query accepts mongoose filtering functionality.
* The sort variable accepts two values `1` (ascending), and `-1` (descending)
* You can sort on nested fields this way:


```json
{
  "sort": { "att1.att2": 1  }
}
```

### whispsCount
::: warning
This query will be deprecated in the next major release of whispr in favour of the renamed whispCount query which supports custom grouping.
:::
Returns the count of matching whisps.

It takes the same parameter as the query [whisps](#whisps)

```GraphQL
query getWhispCount($filter: JSONObject!) {
  whispsCount(filter: $filter)
}
```

Query variables

```json
{
  "filter": { "att1": "value1" }
}
```

* The filtering options are described [here](./filters.md).
* The `/whispsCount` query accepts mongoose filtering functionality.

### whispCount

Returns an array with count of matching whisps, grouped by the specified object.

This query uses MongoDB aggregation to group and count objects. It is the same as the MongoDB [countDocuments() function](https://docs.mongodb.com/manual/reference/method/db.collection.countDocuments/) but allows a custom group object.

**Parameters**
* filter: optional JSONObject! array of filters to apply. These will be applied with OR logic, all whisps matching any of the filters will be counted. Filtering options accept mongoose filtering functionality, described [here](./filters.md).
* group: optional JSONObject! which contains the object fields that you would like to group on.


```GraphQL
query getWhispCountGrouped($filters: [JSONObject!], $group: JSONObject! ) {
  whispCount(filter: $filters, group: $group)
  {
    _id
    count
  }
}
```

The query variables below provide two filters which will be applied with an OR condition, and two grouping fields which will be used to group counts based on object properties. The name and number of grouping fields is arbitrary.

Note that both filter and group parameters are optional. If no group is specified your query will return a single group with a null _id object.

```json
  {
    "filters":[{
      "applicationID": "SMUDGE",
      "data.customData.id": "503"
    },
    {
      "applicationID": "SMUDGE",
      "data.customData.id": "504"
    }],
    "group": { "mainGrouping": "$data.customData.id", "secondaryGrouping": "$data.customData.description"}
  }
```

Example output from the query above:
```json

"whispCount": [
    {
      "_id": {
        "mainGrouping": "503",
        "secondaryGrouping": "AAAA"
      },
      "count": 100
    },
    {
      "_id": {
        "mainGrouping": "504",
        "secondaryGrouping": "AAAA"
      },
      "count": 297
    },
    {
      "_id": {
        "mainGrouping": "504",
        "secondaryGrouping": "BBBB"
      },
      "count": 3
    }
```

Example output with no group parameter:
```json
"whispCount": [
  {
    "_id": null,
    "count": 505797
  }
```

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

```json
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

```json
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

```json
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

```json
{ "whispId": "5ed644d46f91b10034d731f1" }
```

## Whisps: Subscription

### whispAdded

Subscribes the caller to the  'whispAdded' event. The caller will receive the new whisps that match the provided filter.

```GraphQL
subscription whispSubscription($filter: JSONObject!) {
  whispAdded(filter: $filter) {
    _id # fields you want to retrieve from the created whisp
  }
}
```

Query variables

```json
{
  "filter": { "att1": "value1" }
}
```
* The filtering options are described [here](./filters.md).

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

```json
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

```json
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

```json
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

```json
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

```json
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

```json
{ "tagGroupId": "5ed644d46f91b10034d731f1" }
```

## Webhooks: Query

You can find the list of available fields [here](../models/webhook.md).

### webhooks

Retrieves all the webhooks.

```GraphQL
query getWebhooks {
  webhooks {
    _id # fields you want to retrieve from the webhook
  }
}
```

## Webhooks: Mutation

### createWebhook

Creates a new webhook.

```GraphQL
mutation createWebhook($webhook: WebhookInputType!) {
  createWebhook(webhook: $webhook) {
    _id # fields you want to retrieve from the created webhook
  }
}
```

Query variables

```json
{
    "webhook": {
        "url": "https://webhook.url",
        "events": ["EVENT_NAME"],
        "filter":  { "applicationId": "application1"}
    }
}
```
### deleteWebhook

Deletes the matching webhook by its [`_id`](../models/webhook.md#_id).


```GraphQL
mutation deleteWebhook($webhookId: String!) {
  deleteWebhook (
    id: $webhookId
  )
}
```

Query variables

```json
{ "webhookId": "5ef5f304a07efa0041904d52" }
```
