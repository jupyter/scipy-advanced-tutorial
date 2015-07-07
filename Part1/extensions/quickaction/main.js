
define(['jquery',
        'base/js/dialog',
        'base/js/utils',
       ],
    function($, dialog, utils) {
        "use strict";

    var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;
     
        // an array that will be populated with substring matches
        matches = [];
     
        // regex used to determine if a string contains the substring `q`
        var substrRegex = new RegExp(q, 'i');
     
        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });
     
        cb(matches);
      };
    };


    function quick_action() {
        // Show the user a dialog to choose and insert a citation
        var cell = IPython.notebook.get_selected_cell();
        
        var entry_box = $('<input type="text"/>');
        var dialog_body = $("<div/>")
                    .append($('<form/>').append(entry_box));
        dialog_body.addClass("quickaction-dialog");

            
            // Display dialog
            dialog.modal({
                notebook: IPython.notebook,
                keyboard_manager: IPython.keyboard_manager,
                title : "Quick Do",
                body : dialog_body,
                open: function() {
                    // Submit on pressing enter
                    var that = $(this);
                    that.find('form').submit(function () {
                        that.find('.btn-primary').first().click();
                        return false;
                    });
                    entry_box.autocomplete({source:Object.keys(IPython.keyboard_manager.actions._actions)});
                    entry_box.focus();
                },
                buttons : {
                    "Cancel" : {},
                    "Insert" : {
                        "class" : "btn-primary",
                        "click" : function() {
                            try {
                                IPython.keyboard_manager.actions.call(entry_box.val())
                            } catch (e){
                                entry_box.css('background-color','#EDD')
                                console.error(e)
                                return false;
                            }
                        }
                    }
                }
            });
    }
    
    
    var toolbar_buttons = function () {
        // Add toolbar buttons to insert citations and bibliographies
        if (!IPython.toolbar) {
            $([IPython.events]).on("app_initialized.NotebookApp", citn_button);
            return;
        }
        var action = {
                help : 'Clear all cell and restart kernel without confirmations',
                icon : 'fa-mortar-board',
                help_index : '',
                handler: quick_action,
                }

        var aname = IPython.keyboard_manager.actions.register(action, 'quick-dialog' , 'quickdialog')
        IPython.keyboard_manager.actions.register({
            help: 'Spin all the cells',
            icon: 'fa-recycle',
            handler: function(){$('.cell')
                .css('-webkit-transition', 'all 2s ease-in-out')
                .css('-webkit-transform', 'rotateY(-180deg)')
            }
        }, 'spin' , 'quickdialog')

        IPython.keyboard_manager.actions.register({
            help: 'Restore Spin all the cells',
            icon: 'fa-trash',
            handler: function(){$('.cell')
                .css('-webkit-transition', 'all 2s ease-in-out')
                .css('-webkit-transform', 'rotateY(0deg)')
            }
        }, 'restore' , 'quickdialog')
        
        IPython.keyboard_manager.actions.register({
            help:'',
            icon:'',
            handler: function(env){
                env.notebook.get_selected_cell().element
                    .css('-webkit-transition', 'all ease 2.3s')
                    .css('-webkit-transform', 'translateX(150%)')
            }
        }, 'shipit' , 'quickdialog')


        IPython.keyboard_manager.command_shortcuts.add_shortcut('Cmd-Shift-P', aname)
        IPython.keyboard_manager.edit_shortcuts.add_shortcut('Cmd-Shift-P', aname)

        IPython.toolbar.add_buttons_group([aname]);
    };

    function load_ipython_extension() {
        toolbar_buttons();

        $('head').append('<link rel="stylesheet" href="/nbextensions/quickaction/styles.css" type="text/css" />');
    }

    return {load_ipython_extension: load_ipython_extension};
});
