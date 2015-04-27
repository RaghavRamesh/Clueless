from flask import Flask, session,redirect, url_for
from flask import request
from flask import render_template
from index import IndexCompany,IndexApplicant,ListingApplicant,ListingCompany
from passlib.apps import custom_app_context as pwd_context
import json
import MySQLdb
import sendgrid
import re
import hashlib
import urlparse

app = Flask(__name__)
app.secret_key = "fals;dkfjaodsfu09wq8ur34ijrkldsjv98awuer9iq34r"

def company_interceptor():
	if session.get('logged_in') and session.get('obj')['role'] == 'company':
		return True

def applicant_interceptor():
	if session.get('logged_in') and session.get('obj')['role'] == 'applicant':
		return True

def get_db_connection():
	if 'db' in globals():
		return db
	else:
		db = MySQLdb.connect(host="50.62.209.38", 
                     user="Bharath", 
                      passwd="Bharath.cl", 
                      db="driffleskii_") 
		db.autocommit(True)
		return db


@app.route('/', methods=['GET'])
def index_applicant():
	if applicant_interceptor():
		return redirect(url_for('jobs_applicant'))
	elif company_interceptor():
		return redirect(url_for('jobs_company'))	
	return render_template('index_applicant.html')
	
@app.route('/company', methods=['GET'])
def index_company():
	if applicant_interceptor():
		return redirect(url_for('jobs_applicant'))
	elif company_interceptor():
		return redirect(url_for('jobs_company'))	
	return render_template('index_company.html')	

@app.route('/applicant/home', methods=['GET'])
def jobs_applicant():
	if applicant_interceptor():
		return render_template('jobs_applicant.html')
	else:
		return redirect(url_for('index_applicant'))

@app.route('/company/home', methods=['GET'])
def jobs_company():
	if company_interceptor():
		return render_template('jobs_company.html')
	else:
		return redirect(url_for('index_company'))

@app.route('/applicant/listing', methods=['GET'])
def get_all_job_listings():
	if applicant_interceptor():
		applicantId = session.get('obj')['id']
		db = get_db_connection()
		cur = db.cursor() 
		cur.execute("SELECT l.*, c.name, a.status FROM listings l INNER JOIN companies c ON c.id = l.companyId LEFT JOIN applications a ON a.listingId = l.id AND a.applicantId = %s", [applicantId])
		rows=cur.fetchall()
		data={}
		data['jobListings'] = []
		for row in rows:
			job={}
			job['id']=row[0]
			job['position']=row[2]
			job['type']=row[3]
			job['category']=row[4]
			job['requirements']=row[5]
			job['responsibilities']=row[6]
			job['imageUrl']=row[7]
			job['comments']=row[8]
			job['company']=row[9]
			job['status']=row[10]
			data['jobListings'].append(job)
		return json.dumps(data)
	else:
		return "User not authenticated"


@app.route('/company/listing', methods=['GET'])
def get_job_listings_company():
	if company_interceptor():
		companyId = session.get('obj')['id']
		db = get_db_connection()
		cur = db.cursor() 
		cur.execute("SELECT l.*, COUNT(a.id) FROM listings  l LEFT JOIN applications a  ON l.id=a.listingId WHERE companyId = %s GROUP BY a.listingId;", [companyId])
		rows=cur.fetchall()
		data={}
		data['jobListings'] = []
		for row in rows:
			job={}
			job['company']=session.get('obj')['name']
			job['id']=row[0]
			job['position']=row[2]
			job['type']=row[3]
			job['category']=row[4]
			job['requirements']=row[5]
			job['responsibilities']=row[6]		
			job['imageUrl']=row[7]
			job['comments']=row[8]
			job['applicants']=row[9]
			data['jobListings'].append(job)
		return json.dumps(data)
	else:
		return "User not authenticated"

@app.route('/company/listing/add', methods=['GET'])
def add_new_posting():
	if company_interceptor():
		return render_template('add_new_posting.html')
	else:
		return redirect(url_for('index_company'))

@app.route('/company/application_questions', methods=['GET'])
def get_application_questions_company():
	if company_interceptor():
		companyId = session.get('obj')['id']
		db = get_db_connection()
		cur = db.cursor()
		cur.execute("SELECT id, question FROM questions WHERE company_id = %s", [companyId])
		rows=cur.fetchall()
		data = {}
		data['questions'] = []
		for row in rows:
			question={}
			question['id']=row[0]
			question['text']=row[1]
			data['questions'].append(question)
		return json.dumps(data)
	else:
		return "User not authenticated"

@app.route('/company/insert_listing', methods=['POST'])
def insert_new_listing():
	if company_interceptor():
		request_json=request.get_json()
		print request_json
		title=request_json.get('title')
		jobtype=request_json.get('type')
		
		category=request_json.get('category')
		if title == "" or jobtype == "" or category == "":
			return json.dumps({'status': 'fail', 'msg': 'Please fill in all the required fields'}, sort_keys=True)
		companyId = session.get('obj')['id']
		db = get_db_connection()
		cur = db.cursor()
		questions = request_json.get('qns')
		cur.execute("INSERT INTO listings (companyId, position, type,category, requirements, responsibilities, comments) VALUES (%s, %s, %s, %s, %s, %s, %s)", [companyId,title, jobtype, category, request_json.get('req'), request_json.get('res'), request_json.get('comments')])
		cur.execute("SELECT MAX(ID) FROM listings")
		row=cur.fetchone()
		listingId=row[0]
		for n in questions:
			cur.execute("INSERT INTO listing_questions VALUES(%s, %s)", [listingId, n])
		return json.dumps({'status': 'ok', 'msg': 'Successfully posted'})
	else:
		return redirect(url_for('index_company'))


@app.route('/logout', methods=['GET'])
def logout():
	session['logged_in']=False
	return json.dumps({'status': 'ok'})

@app.route('/register/applicant', methods=['GET'])
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

@app.route('/register/company', methods=['GET'])
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

@app.route('/login', methods=['GET'])
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
		if request.form['role'] == "company":
			cur.execute("select password, is_verified, name, id, email from companies where email = %s", [request.form['email']])
		else:
			cur.execute("select password, is_verified, name, id, email from applicants where email = %s", [request.form['email']])
		if(cur.rowcount >0):
			row = cur.fetchone()
			print row[1]
			if(row[1] ==0):
				return json.dumps({'status': 'fail','msg': 'Account verification not completed. Please visit the verification link sent to the registered email.'}, sort_keys=True)
			elif pwd_context.verify(request.form['pw'], row[0]):
				session['logged_in']=True
				session['obj']={'role':request.form['role'], 'id': row[3], 'name': row[2]}
				return json.dumps({'status': 'ok', 'name': row[2]})

		return json.dumps({'status': 'fail','msg': failMsg}, sort_keys=True)

def send_verification_email(role, toAddress):
	api_user = "bharath.param"
	api_key = "bharath.cl"
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
