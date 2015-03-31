import flask, flask.views

class IndexApplicant(flask.views.MethodView):
    def get(self):
        return flask.render_template('index_applicant.html')

class IndexCompany(flask.views.MethodView):
    def get(self):
        return flask.render_template('index_company.html')

class ListingApplicant(flask.views.MethodView):
	def get(self):
		return flask.render_template('jobs_applicant.html')

class ListingCompany(flask.views.MethodView):
	def get(self):
		return flask.render_template('jobs_company.html')