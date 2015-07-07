%%javascript
delete requirejs.s.contexts._.defined.ColorViewModule;
define('ColorViewModule', ['jquery', 'widgets/js/widget'], function($, widget) {
    
    var ColorView = widget.DOMWidgetView.extend({
        render: function() {
            this.colorpicker = $('<input/>');
            this.colorpicker.attr('type', 'color');
            this.$el.append(this.colorpicker);
        },
    });
    
    return {ColorView: ColorView};
});
