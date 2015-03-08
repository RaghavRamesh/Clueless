from flask import Flask
from flask import request
from index import IndexCompany,IndexApplicant
from passlib.apps import custom_app_context as pwd_context
import json
import MySQLdb
import re
'''from register import RegisterCompany, RegisterApplicant'''

app = Flask(__name__)
app.secret_key = "fals;dkfjaodsfu09wq8ur34ijrkldsjv98awuer9iq34r"

app.add_url_rule('/',
    view_func=IndexApplicant.as_view('index_applicant'),
    methods=['GET'])

app.add_url_rule('/company',
    view_func=IndexCompany.as_view('index_company'),
    methods=['GET'])

@app.route('/register/applicant', methods=['POST'])
def register_applicant():
	if request.form['name'] == "" or request.form['email'] == "" or request.form['pw'] == "" or request.form['cpw']=="":
		return json.dumps({'status': 'fail', 'msg': 'Please fill out all the fields in the form'}, sort_keys=True)
	elif len(request.form['pw']) < 8:
		return json.dumps({'status': 'fail','msg': 'Passwords should have atleast 8 characters'}, sort_keys=True)
	elif request.form['pw'] != request.form['cpw']:
		return json.dumps({'status': 'fail','msg': 'The passwords do not match'}, sort_keys=True)
	if not re.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", request.form['email']):
		return json.dumps({'status': 'fail','msg': 'The email address is invalid'}, sort_keys=True)
	else:
		db = MySQLdb.connect(host="50.62.209.38", 
                     user="Bharath", 
                      passwd="myPass123", 
                      db="driffleskii_") 
		cur = db.cursor() 
		cur.execute("select email from applicants where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			return json.dumps({'status': 'fail','msg': 'There is an existing user with the same email.'}, sort_keys=True)
		else:
			hp = pwd_context.encrypt(request.form['pw'])
			cur.execute("insert into applicants(name, email, dob, password) values(%s, %s,%s, %s)", [request.form['name'], request.form['email'],request.form['dob'], hp])
			return json.dumps({'status': 'ok'})

@app.route('/register/company', methods=['POST'])
def register_company():
	if request.form['name'] == "" or request.form['email'] == "" or request.form['pw'] == "" or request.form['cpw']=="":
		return json.dumps({'status': 'fail', 'msg': 'Please fill out all the fields in the form'}, sort_keys=True)
	elif len(request.form['pw']) < 8:
		return json.dumps({'status': 'fail','msg': 'Passwords should have atleast 8 characters'}, sort_keys=True)
	elif request.form['pw'] != request.form['cpw']:
		return json.dumps({'status': 'fail','msg': 'The passwords do not match'}, sort_keys=True)
	if not re.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", request.form['email']):
		return json.dumps({'status': 'fail','msg': 'The email address is invalid'}, sort_keys=True)
	else:
		db = MySQLdb.connect(host="50.62.209.38", 
                     user="Bharath", 
                      passwd="myPass123", 
                      db="driffleskii_") 
		cur = db.cursor() 
		cur.execute("select email from companies where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			return json.dumps({'status': 'fail','msg': 'There is an existing company with the same email.'}, sort_keys=True)
		else:
			hp = pwd_context.encrypt(request.form['pw'])
			cur.execute("insert into companies(name, email, password) values(%s, %s,%s)", [request.form['name'], request.form['email'], hp])
			return json.dumps({'status': 'ok'})

app.run(debug=True)