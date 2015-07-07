define(function(){
    "use strict"

    function _on_load(){
        console.info('Hello SciPy 2015');
        console.info(atob('SWYgeW91IHJlYWQgdGhhdCBpbiB5b3VyIGJyb3dzZXIgY29uc29sZSB5b3UgY2FuIG5vdyBzYXkgYXQgbG91ZCA6'));
        console.info(atob('IkkgYW0gYSBKYXZhc2NyaXB0IGV4cGVydCI='));
        console.info(atob('VGhpcyB3YXkgSSBjYW4ga25vdyB3aGVuIG1ham9yaXR5IG9mIHBlb3BsZSBhcmUgcmVhZHkgYW5kIG1vdmUgb24gOi0p'));
    }
    return {load_ipython_extension: _on_load };
})
