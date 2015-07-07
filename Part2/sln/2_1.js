%%javascript
delete requirejs.s.contexts._.defined.CustomViewModule;
define('CustomViewModule', ['jquery', 'widgets/js/widget'], function($, widget) {
    var CustomView = widget.DOMWidgetView.extend({
        render: function() {
            this.$el.text('Hello SciPy!');
        }
    });
    return {CustomView: CustomView};
});
