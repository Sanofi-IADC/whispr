# REST TagGroup Endpoints
## Get All TagGroups

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