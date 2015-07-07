%%javascript
delete requirejs.s.contexts._.defined.ColorViewModule;
define('ColorViewModule', ['jquery', 'widgets/js/widget'], function($, widget) {
    
    var ColorView = widget.DOMWidgetView.extend({
        render: function() {
            this.colorpicker = $('<input/>');
            this.colorpicker.attr('type', 'color');
            this.$el.append(this.colorpicker);
            
            this.listenTo(this.model, 'change:value', this._update_value, this);
            this._update_value();
        },
        _update_value: function() {
            this.colorpicker.val(this.model.get('value'));
        },
    });
    
    return {ColorView: ColorView};
});
