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
            
            this.colorpicker.on('change', this._set_value.bind(this));
        },
        _update_value: function() {
            this.colorpicker.val(this.model.get('value'));
        },
        _set_value: function() {
            this.model.set('value', this.colorpicker.val());
            this.touch();
        }
    });
    
    return {ColorView: ColorView};
});
