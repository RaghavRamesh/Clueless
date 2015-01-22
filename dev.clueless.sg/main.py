from flask import Flask
from index import IndexCompany,IndexApplicant

app = Flask(__name__)
app.secret_key = "fals;dkfjaodsfu09wq8ur34ijrkldsjv98awuer9iq34r"

app.add_url_rule('/',
    view_func=IndexApplicant.as_view('index_applicant'),
    methods=['GET'])

app.add_url_rule('/company',
    view_func=IndexCompany.as_view('index_company'),
    methods=['GET'])

app.run(debug=True)