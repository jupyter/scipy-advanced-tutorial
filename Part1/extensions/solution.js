define(['base/js/namespace'],function(Jupyter){


    var clear_all_cell_restart = {
        help: 'Clear all cell and restart kernel without confirmations',
        icon : 'fa-recycle',
        help_index : '',
        handler : function (env) {
            var on_success = undefined;
            var on_error = undefined;

            env.notebook.clear_all_output();
            env.notebook.kernel.restart(function(){
                setTimeout(function(){ // wait 1 sec, 
                    // todo listen on Kernel ready event. 
                    env.notebook.execute_all_cells()
                }, 1000)
                }, on_error);
        }
    }
    
    function _on_load(){
        console.info('Hello SciPy 2015')
        console.info(atob('SWYgeW91IHJlYWQgdGhhdCBpbiB5b3VyIGJyb3dzZXIgY29uc29sZSB5b3UgY2FuIG5vdyBzYXkgYXQgbG91ZCA6'))
        console.info(atob('IkkgYW0gYSBKYXZhc2NyaXB0IGV4cGVydCI='))
        console.info(atob('VGhpcyB3YXkgSSBjYW4ga25vdyB3aGVuIG1ham9yaXR5IG9mIHBlb3BsZSBhcmUgcmVhZHkgYW5kIG1vdmUgb24gOi0p'))

        // register our new action
        var action_name = IPython.keyboard_manager.actions.register(clear_all_cell_restart, 'clear-all-cells-restart', 'scipy-2015')
        
        // unbind 00
        IPython.keyboard_manager.command_shortcuts.remove_shortcut('0,0')

        // bind 000
        IPython.keyboard_manager.command_shortcuts.add_shortcut('0,0,0', action_name) 

        IPython.toolbar.add_buttons_group(['scipy-2015.clear-all-cells-restart','ipython.restart-kernel'])
          
    }
    
    return {load_ipython_extension: _on_load };
})
