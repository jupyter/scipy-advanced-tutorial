from IPython.html.widgets import DOMWidget
from IPython.display import display
from IPython.utils.traitlets import Unicode
class CustomWidget(DOMWidget):
    _view_module = Unicode('CustomViewModule', sync=True)
    _view_name = Unicode('CustomView', sync=True)
display(CustomWidget())
