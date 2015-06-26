# The things you can't Google

There are inherently some things that are hard to Google.
Let's takes for example `html5 website` (I want https://html5.org/). Google have difficulties understanding. You might encounter a few of these during web development.

![cannotknow](cannotknot.jpg)


# jQuery (aka `$`)

In Javascript `$` is a valid identifier. By convention, q widely use Javascript library known a [`jQuery`](jquery.org) inject itself in global namespace as `$`. Unless when it's not. In which case `$` might be browser native interface that looks and behave almost like jQuery, but only in console.

If you could wrote jQuery as a python package, it is would be the following.

A callable module, that behave sometime as a class constructor, and have static methods that are getters and setters (with same name, depending on the number of parameter). It also execute code at startup, add some importhook mechanisme and probably rewrite the Ast.
[Q](https://pypi.python.org/pypi/q) is probably the kind of things that get closes to that. It is aweful, but we have not done better, and you can't live without.

Anyway, you will see different construct: `$(...)`, and `$.something`. The first is a convenient wrapper around DOM (or collection of DOM) elements. It allow you to get some short and readable syntax like `$('.cell:odd').remove()` instead of:

```
var elts = document.getElementsByClassName('cell');
var to_remove = [];
for(var i in elts){
    if (i%2 === 0){
        to_remove.push(es[i]);
    }
}

...

```

Try think of `$(...)` as objects with superpowers.


`$.` are just generally utilities function.


## This or that ?

In Javascript you will often find the following construct :

```
var that = this;
```

This, or shouls I say that, is often confusing for the newcomer, especially if he or she comes from a Python background. The reason is simple, the parallel is easy between `self` and `this`. Though, as Javascript is prototype base and does not really have the notion of object like python, `this` does often not refer to what the experience Pythonista think is current object.

In Javascript, there is no reall difference between objects, and function. When the programmer mimic the class inheritance and believe that he is actually creating method on a class, for which `this` will refer to the current object he is mistaking. The keyword `this` alway refer to the current context the object is in, which by default is the **current function**.

Let's take for example the following piece of code, that coudl be thought as the `execute` method of a cell :

```javascript`

Cell.prototype.execute = function(){
  this.kernel.execute(this.code)  // this refer to a Cell object.
}
```

Let one want to delay the execution, one is tempted to write:


```javascript`

Cell.prototype.execute = function(delay){
  var do_ex = function(){
    this.kernel.execute(this.code)  // this refer to `do_ex` object.
  }

  setTimeout(do_ex, delay);
}
```

As the comment point out, `this` do refer to the current function. The way around that is to use a closure around `that`, hence the `var that = this`.
A seond similar construct one could find, is the use of `$.proxy`, that will set the context (value of `this` of a callback). It is a bout the same as using a close except for the fact that `$.proxy` can be use on function you did not construct, or for which you cannot create a closure around the context you like.

## Underscore (aka `_`),

One of the beauty of javascript is it'a ability to use ungoogleable names that have ambiguous meaning. This is one of the reason you find `.js` or `js` suffixes in javascript to lift he ambiguity. Though it is not always the case. In particular you will find a few modules that have the good habit of being bound (or bing themselves ) to `_`. Thus you might see things like `_.map`, `_.proxy`,`_.filter`, ...

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
