import flask, flask.views

class Home(flask.views.MethodView):
    def get(self):
        return flask.render_template('home.html')
