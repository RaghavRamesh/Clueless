from flask import Flask
from flask import request
from index import IndexCompany,IndexApplicant
from passlib.apps import custom_app_context as pwd_context
import json
import MySQLdb
import sendgrid
import re
import hashlib
import urlparse

app = Flask(__name__)
app.secret_key = "fals;dkfjaodsfu09wq8ur34ijrkldsjv98awuer9iq34r"

app.add_url_rule('/',
    view_func=IndexApplicant.as_view('index_applicant'),
    methods=['GET'])

app.add_url_rule('/company',
    view_func=IndexCompany.as_view('index_company'),
    methods=['GET'])

def get_db_connection():
	if 'db' in globals():
		return db
	else:
		db = MySQLdb.connect(host="50.62.209.38", 
                     user="", 
                      passwd="", 
                      db="driffleskii_") 
		return db

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
		db = get_db_connection()
		cur = db.cursor() 
		cur.execute("select email from applicants where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			return json.dumps({'status': 'fail','msg': 'There is an existing user with the same email.'}, sort_keys=True)
		else:
			hp = pwd_context.encrypt(request.form['pw'])
			verificationLink = send_verification_email('a', request.form['email'])
			cur.execute("insert into applicants(name, email, dob, password, verification_link) values(%s, %s,%s, %s, %s)", [request.form['name'], request.form['email'],request.form['dob'], hp, verificationLink])
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
		db = get_db_connection()
		cur = db.cursor() 
		cur.execute("select email from companies where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			return json.dumps({'status': 'fail','msg': 'There is an existing company with the same email.'}, sort_keys=True)
		else:
			hp = pwd_context.encrypt(request.form['pw'])
			verificationLink = send_verification_email('c' , request.form['email'])
			cur.execute("insert into companies(name, email, password, verification_link) values(%s, %s,%s, %s)", [request.form['name'], request.form['email'], hp, verificationLink])
			return json.dumps({'status': 'ok'})

@app.route('/login', methods=['POST'])
def login():
	failMsg = 'Invalid email or password'
	if request.form['email'] == "" or request.form['pw'] == "" :
		return json.dumps({'status': 'fail', 'msg': 'Please fill in the credentials'}, sort_keys=True)
	elif len(request.form['pw']) < 8:
		return json.dumps({'status': 'fail','msg': failMsg }, sort_keys=True)
	elif not re.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", request.form['email']):
		return json.dumps({'status': 'fail','msg': failMsg}, sort_keys=True)
	else:
		db = get_db_connection()
		cur = db.cursor()
		if request.form['role'] == "companies":
			cur.execute("select password from companies where email = %s", [request.form['email']])
		else:
			cur.execute("select password from applicants where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			row = cur.fetchone()
			if pwd_context.verify(request.form['pw'], row[0]):
				return json.dumps({'status': 'ok'})

		return json.dumps({'status': 'fail','msg': failMsg}, sort_keys=True)

def send_verification_email(role, toAddress):
	api_user = "bharath.param"
	api_key = ""
	sg = sendgrid.SendGridClient(api_user, api_key)
	message = sendgrid.Mail()
	message.add_to(toAddress)
	message.set_from("bharathparam.clueless@gmail.com")
	message.set_subject("Clueless account verification")
	randomLink = generate_random_url_link(toAddress)
	if role=='c':
		message.set_html("<p><b>Welcome to Clueless!</b> Please verify your account by visiting the <a href = 'http://localhost:5000/verify/company?id=" + randomLink+ "'> verification link </a>" + " and complete the last step of your registration.</p></br><p style='margin:1em 0'>Should you ever encounter problems with your account or forget your password we will contact you at this address.</p></br><p style='margin:1em 0'>Enjoy!</p><p style='margin:1em 0'>The Clueless Team</p><br>")
	else:
		message.set_html("<p><b>Welcome to Clueless!</b> Please verify your account by visiting the <a href = 'http://localhost:5000/verify/applicant?id=" + randomLink+ "'> verification link </a>" + " and complete the last step of your registration.</p></br><p style='margin:1em 0'>Should you ever encounter problems with your account or forget your password we will contact you at this address.</p></br><p style='margin:1em 0'>Enjoy!</p><p style='margin:1em 0'>The Clueless Team</p><br>")
	
	sg.send(message)
	return randomLink

def generate_random_url_link(email):
	"""Returns a random string by hashing the email"""
	hash = hashlib.sha1()
	hash.update(email)
	return hash.hexdigest()

@app.route('/verify/company')
def email_verification_company():	
	identifier = urlparse.parse_qs(urlparse.urlparse(request.url).query)['id'][0]
	db = get_db_connection()
	cur = db.cursor()
	cur.execute("update companies set is_verified = 1 where verification_link = %s and is_verified = 0", [identifier])
	if cur.rowcount > 0:
		return 'Verified'
	else:
		return 'Invalid or expired URL'

@app.route('/verify/applicant')
def email_verification_applicant():	
	identifier = urlparse.parse_qs(urlparse.urlparse(request.url).query)['id'][0]
	db = get_db_connection()
	cur = db.cursor()
	cur.execute("update applicants set is_verified = 1 where verification_link = %s and is_verified = 0", [identifier])
	if cur.rowcount > 0:
		return 'Verified'
	else:
		return 'Invalid or expired URL'

app.run(debug=True)