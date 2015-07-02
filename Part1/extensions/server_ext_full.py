from IPython.html.utils import url_path_join as ujoin
from tornado.web import RequestHandler


class MyLogHandler(RequestHandler):
    def initialize(self, log=None):
        self.log = log

    def put(self):
        data = self.request.body.decode('utf-8')
        self.log.info(data)
        self.finish()


def load_jupyter_server_extension(nbapp):
    nbapp.log.info('SciPy Ext loaded')

    webapp = nbapp.web_app
    base_url = webapp.settings['base_url']
    webapp.add_handlers(".*$", [
        (ujoin(base_url, r"/scipy/log"), MyLogHandler,
            {'log': nbapp.log}),
    ])
