# REST API

::: tip
The whispr REST API is very limited compared to the GrahQL API. We will gradually make some improvements but we strongly recommend trying out GraphQL first. It's very simple, and more powerful than REST. You'll love it, we promise!
:::

## Get all Whisps

* Method: `GET`
* Path: '/whisp'
* Success: `200`

Returns all the whisps.

## Get a Whisp

* Method: `GET`
* Path: '/whisp/**:whispId**'
* Success: `200`

Returns a whisp identified by its [`_id`](../../models/whisp.md#_id)

## Create a Whisp

* Method: `POST`
* Path: '/whisp'
* Success: `201`

Creates a new whisp from the `body`. The available fields of the whisp entity are listed [here](../../models/whisp.md)

## Update a Whisp

* Method: `PATCH`
* Path: '/whisp/**:whispId**'
* Success: `204`

Updates the fields given in the `body` of a whisp identified by its [`_id`](../../models/whisp.md#_id). The available fields of the whisp entity are listed [here](../../models/whisp.md)

## Replace a Whisp

* Method: `PUT`
* Path: '/whisp/**:whispId**'
* Success: `204`

Replaces a whisp given identified by its [`_id`](../../models/whisp.md#_id) by a new whisp given in the `body` . The available fields of the whisp entity are listed [here](../../models/whisp.md)

## Delete a Whisp

* Method: `DELETE`
* Path: '/whisp/**:whispId**'
* Success: `204`

Deletes a whisp identified by its [`_id`](../../models/whisp.md#_id)

## Get all TagGroups

* Method: `GET`
* Path: '/TagGroup'
* Success: `200`

Returns all the tagGroups.

## Get a TagGroup

* Method: `GET`
* Path: '/TagGroup/**:tagGroupId**'
* Success: `200`

Returns a tagGroup identified by its [`_id`](../../models/tagGroup.md#_id)

## Create a TagGroup

* Method: `POST`
* Path: '/TagGroup'
* Success: `201`

Creates a new tagGroup from the `body`. The available fields of the tagGroup entity are listed [here](../../models/tagGroup.md)

## Update a TagGroup

* Method: `PATCH`
* Path: '/TagGroup/**:tagGroupId**'
* Success: `204`

Updates the fields given in the `body` of a tagGroup identified by its [`_id`](../../models/tagGroup.md#_id). The available fields of the tagGroup entity are listed [here](../../models/tagGroup.md)

## Replace a TagGroup

* Method: `PUT`
* Path: '/TagGroup/**:tagGroupId**'
* Success: `204`

Replaces a tagGroup given identified by its [`_id`](../../models/tagGroup.md#_id) by a new tagGroup given in the `body` . The available fields of the tagGroup entity are listed [here](../../models/tagGroup.md)

## Delete a TagGroup

* Method: `DELETE`
* Path: '/TagGroup/**:tagGroupId**'
* Success: `204`

Deletes a tagGroup identified by its [`_id`](../../models/tagGroup.md#_id)

## Get all Webhooks

* Method: `GET`
* Path: '/webhook'
* Success: `200`

Returns all the webhooks.

## Create a Webhook

* Method: `POST`
* Path: '/webhook'
* Success: `201`

Creates a new webhook from the `body`. The available fields of the webhook entity are listed [here](../models/webhook.md)

## Delete a Webhook

* Method: `DELETE`
* Path: '/webhook/**:id**'
* Success: `204`

Deletes a webhook identified by its [`_id`](../models/webhook.md#_id)
