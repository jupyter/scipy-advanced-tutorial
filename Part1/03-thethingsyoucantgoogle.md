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

Javascript uses the keyword `var` to declare variable.  One of the gotchas, is that if you do not use `var` you will implicitely refer to a variable in the global namespace (which in browser is the `window` object).To prevent that at the top of your module scope, use the string `"use strint"`, in quote. This will make your browser less tolerant to the above issues (and a few other), which will save you from Headhache.

```javascript
define([..., reauirements], function(a,b,c){
  "use strict";
})
```

Top of module scope does not always mean top of file, using `"use strict"` at top of file, might be an issue when working with legacy code.


## unlimited argument, default to undefined

One things to ba aware of is that javascript will never complain if you pass to many of too few arguments to a function.

Thus you probably want to check argumets for undefined. This can be helpful though for default values.

```
> var say_hi = function(name){ console.log('Hi', name || 'unamed person')}
undefined
> say_hi()
Hi unamed person
> say_hi('Matthias')
Hi Matthias

```

## ==, ===

Javascript test for equality is done with triple equal, not double equal,
double equal will try to cast both memebers before doing a "smart" comparison,
leading to sometime unexpected behavior:


```javascript
> '0' == 0
true
> 0 == ''
true
> '' == '0'
false
```

## require

Javascript do not have a nice concept of import have we have in Python when you
are working in browser. In particular because file loading nned to be asyncronous.

One of the way to go around that is to use Asynchromous Module Definition (aka
  AMD),and we often do that with a lib call  `require` or `requirejs`.
To use requirejs you need to know that 2 functions. `define` and `require`.


```javascript
define(
  ['matplotlib/pyplot',
   'numpy'
   'IPtython/notebook'], function(
     pyplot,
     np,
     notebook
     ){
       "use strict"
        // your module
   }
)
```

`require` is used in the same way unless you want to run the code that create the
module as soon as possible. Rule of thumb: use `define` unless you cannot.

In **some** cases, you can though use a simple syntax:

```javascript
define(function(){
  "use strict";
  var numpy = require('numpy')  
  var pyplot = require('matplotlib.pyplot')
  var np = require('numpy')

  //... your module
})
```

Which is easier to read, but only works if the module you refer to has already been imported.
It also allow you to get handle to modules in the REPL.


## IIFE

You might find the following Here and there. These are Immediately Invoked Function Expression. You might find them:

 - At module/file level
 - In loops.

```javascript
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

```javascript
>>> for i in range(5):
>>>    print(i)
5
5
5
5
5
```

You could fix that by:

```javascript
myfun = lambda x:print(x)
for i in range(5):
    myfun(i)
```
That can be rewritten as

```javascript
for i in range(5):
    (lambda x:print(x))(i)
```

Same in js

```javascript
  //...
  X = do_stuff(A)
```

wrap in a function

```javascript
function(A){
  ...
  return do_stuff(A)
}
```
Make it an expression

```javascript
(
function(A){...}
)
```

Call with A as parameter, and assign to X

```javascript
X = (function...)(A)
```

## MDN

Last tip, [Mozilla Developper Network](https://developer.mozilla.org/) is your
friend, (pehabs even more than Google), and have often really **good** docs
with example on how to use javascript/html/css. To know wether some features can
be used on your browser you can check
[Can I use](http://caniuse.com/#search=translate) website.
