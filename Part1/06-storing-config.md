# Storing configuration

Your extension may need to store user data such as preferences. You could
use `localStorage` for this, but if the user opens a different browser, or runs
the notebook on a different port, previously stored information won't be
available. So we provide an API to store config through the server.

First, load `services/config` in your extension:

```javascript
define(['services/config'
       ],
function(configmod) {
  ...
});
```

There are two classes in this module:

- `ConfigSection` talks to the server to load and store config.
- `ConfigWithDefaults` is a nicer API for the code using configurable values.

First, you need to set up a ConfigSection:

```javascript
var config = new configmod.ConfigSection('myextension',
                                {base_url: utils.get_body_data("baseUrl")});
config.load();
```

In this example, `'myextension'` is the name of the config section. The server
stores your config in a file with this name. One section should suffice for an
extension.

The `.load()` method is asynchronous: it will start loading the config, but
it won't wait for loading to finish.

## Using configuration values

Next, let's create a `ConfigWithDefaults` object:

```javascript
var foo_config = new configmod.ConfigWithDefaults(config, {
                          visible: true,
                          colour: '#fe6500'
                        }, 'foo')
```

There are three arguments here:

1. `config`: the `ConfigSection` we created before.
2. The default values, which we'll use if we haven't stored something else in
   the config.
3. A subsection name, if you need to subdivide the config section. For simple
   extensions, you can leave this out.

The next step depends on what should happen if we try to get a value while the
config is still loading. If it should wait for loading to finish:

```javascript
foo_config.get('colour').then(function(colour) {
  // do things with colour
});
```

If it should use the default instead of waiting:

```javascript
colour = foo_config.get_sync('colour');
```

## Setting configuration

To set a single value:

```javascript
foo_config.set('visible', false);
```

This is also asynchronous: it sends the new value off, but doesn't wait for a
reply.
