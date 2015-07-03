# Keyboard Shortcuts

Fair warning: All these APIs are unstable, and can change at any time.

Through Javascript you can access the keyboard manager.

The keyboard manager maps (some) shortcuts in command and edit mode to 'actions'.

A shortcut is a string that represents a sequence of several key presses. Commas separate each step of the sequence, and dashes separate keys that have to be pressed together.

For example `a,b,c,d` represent the succession of pressing the letters A, B, C and D without modifier.
`Shift-a,b,c,d` will have only the  `A` key pressed with shift modifier, and `Shift-a,Shift-b,Shift-c,Shift-d` represents holding shift and pressing `a,b,c,d` in order.

Bind some existing actions in command mode, using the javascript console (where `>` and `<` are in and out prompt):


```javascript
> IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-k','ipython.move-selected-cell-up')
< undefined

> IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-j','ipython.move-selected-cell-down')
< undefined
```

To see the list of available actions, you can issue the following in the developper console:

```javascript
> $.map(
     IPython.keyboard_manager.command_shortcuts.actions._actions,
     function(k,v){return v}
     )

< ["ipython.run-select-next",
"ipython.execute-in-place",
"ipython.execute-and-insert-after",
"ipython.go-to-command-mode",
...
"ipython.move-cursor-down-or-next-cell",
"ipython.scroll-down", "ipython.scroll-up",
"ipython.save-notebook"]
```


## Actions

In the previous section, you actually bound a keyboard shortcut to an action.

You are most likely to want the same behavior as other users and/or to have buttons or menu do the same things as keyboard shortcut.

Also, if like me you are not a huge fan of Javascript, you prefer to avoid rewriting anonymous function in your config file.

An action is, in its simplest form, a name given to a sequence of API calls done in the notebook frontend. Some action are already pre-defined in Jupyter/IPython, and we prefix their name by `ipython`. Extensions can also register their own actions to be used.
The API and naming of actions is still in flux, so what you read here is still approximate.

As of this writing, an action is a combination of a `handler`, an `icon` and a `help_text`. The handler is a JavaScript function, that would be called in the right context when the action is triggered.
The `help_text` and `icon` are extra meta-data that are used in various context. For example, if you add an action to a toolbar a button will be created. The icon will automatically be applied to the button, and the help text will appear on hover. Actions also have the capacity to call sub-actions. This make the combination of multiple repetitive tasks easy to customize.

The quick way to bind a function to a shortcut is to use an anonymous action:

```javascript
IPython.keyboard_manager.command_shortcuts.add_shortcut(
    'Ctrl-C,Meta-C,Meta-b,u,t,t,e,r,f,l,y',
    {
        handler:function(){
          window.open('https://xkcd.com/378/')
        }
    }
)
```

This is a bit hard to type quickly enough, but _Real Programmer_
should probably understand how to use this.

### Defining an action

// icons are taken from font-awesome.
// names should not contain spaces.

```javascript
IPython.keyboard_manager.actions.register
```

Choose icons from [Font Awesome](http://fortawesome.github.io/Font-Awesome/icons/)

```javascript
var clear_all_cell_restart = {
    help: 'Clear all cell and restart kernel without confirmations',
    icon : 'fa-recycle',
    help_index : '',
    handler : function (env) {
        var on_success = undefined;
        var on_error = undefined;
        env.notebook.clear_all_output();
        env.notebook.kernel(on_success, on_error);
    }
}
```

```javascript
IPython.keyboard_manager.actions.register(clear_all_cell_restart, 'clear-all-cells-restart', 'scipy-2015')
```
