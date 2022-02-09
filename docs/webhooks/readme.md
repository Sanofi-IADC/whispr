# Webhooks

Whispr also provides a webhook system. Webhooks are event listeners that will
make a `POST` call to a url you provided, when an event is triggered.

## Webhook registration

You can use [GraphQL](../api/graphql.md#Webhooks:_Mutation) or 
[REST](../api/rest.md#Create_a_Webhook) to create or delete a webhook.

To create a webhook, you should provide:
- the url that will be called when the event is triggered
- the event names the webhook will be listening to
- (optional) the filter on the event if you want to be notified only for events of 
a specific payload

For example, here is the payload you should provide to create a webhook that will call
`https://webhook.url` when a whisp is created and that whisp applicationId is 
"application1".
 
 ```json
{
     "url": "https://webhook.url",
     "events": ["WHISP_CREATED"],
     "filter":  { "applicationId": "application1" }
 }
 ```

## Webhook filter

More info on filters [here](../filters). The filter is capable of the mongoDB query language for a complex scenario a query like this can be used:
 ```json
{
    "url": "https://webhook.url",
    "events": ["WHISP_CREATED","WHISP_UPDATED"],
    "filter":  {
        "key1": { "$eq": "valueA" },
        "key2": { "$gte": 5 },
        "key3": { "$in": ["valueB", "valueC"] },
        "key4.key5": { "$lt": 5 },
    }
 }
 ```
## Webhook call

The call a webhook makes to the url you provided is a `POST` with the event name and 
event payload as body.

In the case of our example above, it would be: 

`POST`: `https://webhook.url`
 ```json
 {
     "eventName": "WHISP_CREATED",
     "content": whispEntity
 }
 ```

### Webhook proxy / CA

In order to use a proxy set the `HTTP_PROXY` or `HTTPS_PROXY` environment variables.

You can pass a custom `CA_CERTIFICATE` by setting the variable. It can contains the path to one or multiple certificates in the Docker File, separated by comma. 