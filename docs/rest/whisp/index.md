# REST Whisp Endpoints
## Get All Whisps

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
