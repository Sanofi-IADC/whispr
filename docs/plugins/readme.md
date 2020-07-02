# Plugins

## Create a plugin

Create a new repository and clone it to you computer. 

Publish this repository to npm by following npm's documentation: 
[https://docs.npmjs.com/creating-node-js-modules](https://docs.npmjs.com/creating-node-js-modules)

## Add your plugin to whispr

* Add the package of your plugin:
```shell script
npm install your-plugin --save
```

* Add the name of your plugin in the plugins enum of the `src/event/event.service.ts` file:
```javascript
export const pluginNames = [
  'your-plugin',
];
```

## Make your plugin register listeners

In your plugin's `index.js` file, export a `listeners` property that is an array of
listeners.

Those listeners must have the following properties:
* `callback`: a function that has the signature of the `ListenerCallback` 
type in the `src/interfaces/listener.interface.ts` file.
* `eventName`: one of the EventNames registered in the enum of the `event.entity.ts` file.
* `filter`: allows you to filter on the event if you want your callback 
to be called only for events of a specific payload. See [filters documentation](../filters).

```javascript
    // index.js

    module.exports.listeners = [
      {
        callback: (event) => { /* your code */ },
        eventName: 'WHISP_CREATED',
        filter: {}
      },
      ... // other listeners
    ];
```
