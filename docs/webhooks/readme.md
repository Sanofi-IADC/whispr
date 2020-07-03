# Webhooks

Whispr also provides a webhook system. Webhooks are event listeners that will
make a `POST` call to a url you provided, when an event is triggered.

## Webhook registration

You can use [GraphQL](../graphql/readme.md#Webhooks:_Mutation) or 
[REST](../rest/readme.md#Create_a_Webhook) to create or delete a webhook.

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
