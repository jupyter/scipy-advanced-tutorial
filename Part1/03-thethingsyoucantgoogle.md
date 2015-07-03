# The things you can't Google

There are some things that are inherently hard to Google.
Let's takes for example `html5 website` (I want https://html5.org/). Google have difficulties understanding. You might encounter a few of these during web development.

![cannotknow](cannotknot.jpg)

## jQuery (aka `$`)

In Javascript, `$` is a valid identifier. By convention, a widely used Javascript library known as [`jQuery`](jquery.org) injects itself into the global namespace as `$`. (But beware! `$` can also be a browser native interface that looks and behave almost like jQuery, but only in the console.)

jQuery is a library to do a lot of important but not really related things. Code written with it is much more concise, but often not very clear. It's not great, but it's almost indispensable, and a lot of Javascript uses it.

You will often see jQuery used like `$('...')`. If the string part looks like an HTML tag (`$('<div>')`), it's making a new element. If it looks like a CSS selector, it's selecting existing tags. This can give you some short and readable syntax like `$('.cell:odd').remove()` instead of:

```javascript
var elts = document.getElementsByClassName('cell');
var to_remove = [];
for(var i in elts){
    if (i%2 === 0){
        to_remove.push(es[i]);
    }
}

...
```

`$.something` are generally utility functions.


## This or that ?

In Javascript you will often find the following construct :

```javascript
var that = this;
```

This, or should I say that, is often confusing for the newcomer, especially if he or she comes from a Python background. `this` looks alluringly similar to `self`, but it doesn't always refer to what the experience Pythonista might expect.

In Javascript, there is no real difference between objects and functions. When the programmer creates what looks like a class and methods, that's not how Javascript sees it. The keyword `this` always refer to the current context the object is in, which by default is the **current function**.

Let's take for example the following piece of code, that could be thought of as the `execute` method of a cell:

```javascript
Cell.prototype.execute = function(){
  this.kernel.execute(this.code)  // this refer to a Cell object.
}
```

To delay the execution, one is tempted to write:


```javascript
Cell.prototype.execute = function(delay){
  var do_ex = function(){
    this.kernel.execute(this.code)  // this refer to `do_ex` object.
  };

  setTimeout(do_ex, delay);
}
```

As the comment point out, `this` do refer to the current function. The way around that is to use a closure around `that`:

```javascript
Cell.prototype.execute = function(delay){
  var that = this;
  var do_ex = function(){
    that.kernel.execute(that.code)  // *that* is still the Cell object
  };

  setTimeout(do_ex, delay);
}
```

Another way to achieve the same thing is to use `$.proxy`, that will set the context (value of `this` of a callback). It is about the same as using a closure, but `$.proxy` can be used on a function you did not construct, or for which you cannot create a closure around the context you like.

```javascript
Cell.prototype.execute = function(delay){
  var do_ex = $.proxy(function(){
    this.kernel.execute(this.code)  // now this will be the Cell object
  }, this);

  setTimeout(do_ex, delay);
}
```


## Underscore (aka `_`),

One of the beauty of javascript is its ability to use un-googleable names that have ambiguous meaning. This is one of the reason you find `.js` or `js` suffixes in javascript to reduce the ambiguity. Though it is not always the case. In particular you will find a few modules that have the good habit of being bound (or bind themselves) to `_`. Thus you might see things like `_.map`, `_.proxy`,`_.filter`, ...

Most of the time the library bound to `_` is called "Underscore", but still rarely name "Underscore.js". It provides a few utilities function.

## use strict

## unlimited argument, default to undefined

## require

## IIFE

You might find the following Here and there. These are Immediately Invoked Function Expression. You might find them:

 - At module/file level
 - In loops.

```
X = (function(A){
  // do stuff
  // loosely
  // var X = something(A)
  //
  return X
})(A)
```

(look like lisp right ?)

These are basically a work around some scoping problem in JS. Imagine that in python:

```
>>> for i in range(5):
>>>    print(i)
5
5
5
5
5
```

You could fix that by:
```
myfun = lambda x:print(x)
for i in range(5):
    myfun(i)
```
That can be rewritten as

```
for i in range(5):
    (lambda x:print(x))(i)
```

Same in js

```
  //...
  X = do_stuff(A)
```

wrap in a function

```
function(A){
  ...
  return do_stuff(A)
}
```
Make it an expression

```
(
function(A){...}
)
```

Call with A as parameter, and assign to X

```
X = (function...)(A)
```
