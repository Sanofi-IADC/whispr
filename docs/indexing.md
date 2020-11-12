# Indexing

## Default Index

By default whispr creates a compound index on the fields applicationID and closed fields to provide a general improved performance by filtering on those field.

## Custom Index

In case of that you have special filtering requirements, which costs a lot of performance it's recommended to create additional indexes.
You have to do the following to create a new index

```bash
# Go to the whisps db with your mongo client
use whisps

# for creating a new index to a specific collection use db.collection.createIndex( <key and index type specification>, <options> )
# normal index
db.whisps.createIndex({"applicationID": 1})
# compound index
db.whisps.createIndex({"applicationID": 1, "closed": -1})

```
