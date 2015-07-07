from IPython.html.widgets import DOMWidget
from IPython.display import display
from IPython.utils.traitlets import Unicode
class ColorWidget(DOMWidget):
    _view_module = Unicode('ColorViewModule', sync=True)
    _view_name = Unicode('ColorView', sync=True)
    value = Unicode('#990000', sync=True)
