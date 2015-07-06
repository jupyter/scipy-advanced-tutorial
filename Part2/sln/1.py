slider = widgets.FloatSlider()
text = widgets.FloatText()
widgetlink = link((slider, 'value'), (text, 'value'))
display(slider, text)
