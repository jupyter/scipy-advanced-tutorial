# Notebook extensions

Notebook extensions allow users to control the behavior of the Notebook and add functionality.

Extensions capabilities can range from loading notebook files from [Google Drive](https://github.com/jupyter/jupyter-drive), or PostgreSQL server, presenting notebooks in the form of a slideshow, to adding a convenient button or keyboard shortcut for an action the user does often.

The way we write Jupyter/IPython is to provide the minimal sensible default, with easy access to configuration for extension to modify behavior.

Extensions can be composed of many pieces, but you will mostly find a Javascript part that lives on the frontend side (ie, the Browser), and a part that lives on the server side (written in Python). For now, we will focus on the Javascript side.

There are a number of repos here and there on the internet, and we haven't taken the time to write a Jupyter Store (yet), to make extensions easily installable. Well, I suppose this could be done as an extension, and your research on the web will probably show that it can be done, but we will still focus on the old manual way of installing extension to learn how things works, because that's why you are here.

Ok, so here are links to some active repos, with extensions:

 - https://github.com/ipython-contrib/IPython-notebook-extensions – check out the right branch for your version of IPython. If you are using IPython 3.x, you want extensions from the 3.x branch.
 - https://bitbucket.org/ipre/calico/ look in the `notebook/nbextension` folder.

Ok, let's go. I've made a minimal extension for you in `extensions` next to this file. Link or copy it over into:


```shell
$ ls ~/.ipython/nbextensions/
hello-scipy.js
```

> Tip: `~/.ipython` is the per-user config, there are system wide install location,
and in 4.0 some of these folders will be `jupyter` instead of `ipython`.


Now let's open a notebook and configure it to load the extension automatically.
In a new notebook, or the one I provides with a reminder of the instructions, open the developer console
and enter the following:


```js
IPython.notebook.config.update({
  "load_extensions": {"hello-scipy":true}
})
```

Now Reload your page, and look at the Javascript console - it should tell you what to do next!

## Explanation

Do not be preoccupied with what `IPython.notebook.config.update` is: we will see that later.

The `"load_extensions"` part takes a dict with the names of extensions, and whether they are loaded
or not. It is one of the config value which is now stored on server side.

There is a way to activate extensions from outside the notebook, but we won't see
that for now.

### The extension

```js
define([], function(){

    function _on_load(){
          console.info('Hello SciPy 2015')
    }

    return {load_ipython_extension: _on_load };
})
```

The define call: `define(function(){` suggests that we have no dependencies,

For readability, we define a function that will be called on notebook load at the right time.
We keep python convention that `_xxx` is private.
```js
  function _on_load(){
    console.info('Hello SciPy 2015')
}
```

We only export a function called `load_ipython_extension` to the outside world:
`return {load_ipython_extension: _on_load };`. Anything outside of this dict will
be inaccessible for the rest of the code. You can see that as Python's `__all__`.

Note that you will find legacy extensions on the internet that *do not define*
`load_ipython_extension` and rely on IPython's events, and `custom.js`.
While it mostly works for the time being, these extensions will break in the future
and are subject to race conditions.

While our Javascript API is still highly in motion, and not guaranteed stable,
we'll try our best to make updating extensions that use `load_ipython_extension` easier
that the ones using events and `custom.js`!


## New keyboard shortcut !

Ok, so now let's modify our extension in order to be able to actually modify the
User interface. We will try-to create a shortcut that kill the kernel without confirmation,
and clear all the cell, plus re-run all the things.

First things, we want to get access to all the IPython instance, to do so we want
to import the right module so that `IPython` variable can be used safely.

Change the first line to the following


```js
define(['base/js/namespace'], function(IPython){
```

I remind you that this is basically equivalent to :

```python
import base.js.namespace as IPython
```


Now in your `_on_load` you can access `IPython.<things>`. If you fail
to use the above way of declaring import, IPython might still be accessible on your
machine with your current workload. Though it might break in some cases.
Using `define([...])` insure in the dependency graph that the right file is loaded,
and that the local name will be `IPython` (hint, in next release the global name might be `Jupyter`).

Ok, now let's make a detour and [Keyboard Shortcut](./05-keyboardshortcut.md).

A few things you might need :

```javascript
var internal_name = IPython.keyboard_manager.actions.register(data, name , `scipy-2015`)
IPython.keyboard_manager.command_shortcuts.remove_shortcut(string)
IPython.keyboard_manager.command_shortcuts.add_shortcut(string, internal_name)
```

The notebook instance have a `clear_all_output` method, and a `kernel` attribute.
The `kernel` instance has a `restart` method that have a `on_success` and `on_error` callbacks.


...

have you figured it out ?

My solution:

```js
function (env) {
    var on_success = undefined;
    var on_error = undefined;

    env.notebook.clear_all_output();
    env.notebook.kernel.restart(function(){
          setTimeout(function(){ // wait 1 sec,
              // todo listen on Kernel ready event.
              console.log('executing all cells')
              env.notebook.execute_all_cells()
          }, 1000)
        },
        on_error // Todo also
    );
}
```

```js
// register our new action
var action_name = IPython.keyboard_manager.actions.register(
      clear_all_cell_restart,
      'clear-all-cells-restart',
      'scipy-2015')

// unbind 00
IPython.keyboard_manager.command_shortcuts.remove_shortcut('0,0')

// bind 000
IPython.keyboard_manager.command_shortcuts.add_shortcut('0,0,0', action_name)
```


### Why use an action.

How are things up until now ? You might feel like the code is a bit too verbose,
and that some part are unnecessary right ? Now we will start to see why we use such
verbose methods.

You might have seen that some attributes of action seem to be unused.

```
help: 'Clear all cell and restart kernel without confirmations',
icon : 'fa-recycle',
help_index : '',
```

Now that your extension works go get a look in the help menu, keyboard shortcut submenu.
If all is fine, you should see your new shortcut in there, with the help text.
The help index is use to order/group the common shortcut together. The only last
unused piece is the icon.

With all theses attribute, you can easily bind an _action_, to either a keyboard shortcut,
a button in a toolbar, or in a menu item (api is not there yet for that though).
We often saw people wanting the same action in two places, and duplicating code,
which is a bit painful. By defining action separately this make it easy to use these
in many places keeping it DRY. This also allow you to distribute actions library
without actually binding them and let user do their own key/icon bindings.

Let see that in next section with toolbars.

### toolbars.

Ok, that will be pretty simple you already did all the job :-)

You just need to know that following exist, and take a list of action names:

`IPython.toolbar.add_buttons_group`

Now, go edit your custom extension ! You can also try to install `markcell.js` extension,
`require()` it in your extension and try to use someof the methods defined in it.
This show you how to spread your extension potentially across many files.

Here is my solution:

```
IPython.toolbar.add_buttons_group(['scipy-2015.clear-all-cells-restart','ipython.restart-kernel'])
```

each call to this API will generate a new group of button with the default icons,
and if you hover the button the help text will remind you the action.



### interact with user

You can ask a value with the `base/js/dialog` module that have some convenience function.

This module have a `modal` function that you can use like that:

```
dialog.modal({
    body: text_or_dom_node , // jQuery is you friend
    title: string,
    buttons: {
      'Ok':{
            class: 'btn-primary',
            click: on_ok_callback
            },
      'Cancell':{
              //... (or nothing to just dismiss )
            }
    },
    notebook:env.notebook,
    keyboard_manager: env.notebook.keyboard_manager,
})
```


### server side handler.

Ok, enough javascript (for now). Let's get back into a sane language.
Notebook extension on the client-side have been there for quite a while,
and we recently added the ability to have a server side extension.

Server side extension are, as any IPython extension simply Python modules that
define a specific method. In our case `load_jupyter_server_extension`
(Yes we are ready for the future).

Here is the minimal extension you can have:

```python
def load_jupyter_server_extension(nbapp):
    pass
```

I've already provided that for you, in the `extensions` dir.
You can try to run the following, and look at the console while starting the notebook,
you will be able to see a new login message.

```
python3 -m IPython  notebook --notebook-dir=~ --NotebookApp.server_extensions="['extensions.server_ext']"
```


Now let's add a handler capable of preating requests:
