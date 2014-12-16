from flask import Flask
from home import Home

app = Flask(__name__)
app.secret_key = "fals;dkfjaodsfu09wq8ur34ijrkldsjv98awuer9iq34r"

app.add_url_rule('/',
    view_func=Home.as_view('home'),
    methods=['GET'])

app.run(debug=True)