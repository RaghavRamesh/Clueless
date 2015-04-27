var cluelessApp = angular.module('app', ['ui.bootstrap', 'ngRoute']);

cluelessApp.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(false).hashPrefix('!');
	$routeProvider.when('/applicant', {
		templateUrl: 'static/angular_templates/applicantHomePage.html',
		controller: 'applicantHomePageCtrl'
	}).when('/company', {
		templateUrl: 'static/angular_templates/companyHomePage.html',
		controller: 'companyHomePageCtrl'
	}).otherwise({redirectTo: '/applicant'});
});

cluelessApp.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
}]);

cluelessApp.factory('userSession', function() {
  var name ="";
  var role = "";
  var id = 1;
  var newSession = function(n, r){
   	name = n;
   	role = r;
   }
  return {
      "name" : name,
      "role" : role,
      "id": id,
      newSession : newSession
  };
});

cluelessApp.controller('indexCtrl', function($scope, $modal, $window) {
	$scope.launchLogin = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/choosePersonLoginModal.html',
		      controller: 'loginModalCtrl',
              size: 'sm'
    	});
	};

	$scope.launchRegister = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/choosePersonRegisterModal.html',
		      controller: 'registerModalCtrl',
              size: 'sm'
    	});
	};
	$scope.current = null;
	if($window.location.pathname === "/company")
	{
		$scope.current = "Company";
	}
	else
	{
		$scope.current = "Applicant";
	}
});


cluelessApp.controller('registerModalCtrl', function($scope, $modal) {
	$scope.launchCompanyRegisterModal = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/companyRegisterModal.html',
		      controller: 'companyRegisterModalCtrl'
    	});
	}

	$scope.launchApplicantRegisterModal = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/applicantRegisterModal.html',
		      controller: 'applicantRegisterModalCtrl'
    	});
	}
});


cluelessApp.controller('loginModalCtrl', function($scope, $modal) {
	$scope.launchCompanyLoginModal = function() {
		
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/loginModal.html',
		      controller: 'companyLoginModalCtrl'
    	});
	}

	$scope.launchApplicantLoginModal = function() {
		
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/loginModal.html',
		      controller: 'applicantLoginModalCtrl'
    	});
	}
});

cluelessApp.controller('companyLoginModalCtrl', function($scope, $window, $modalInstance){
	$scope.email = "";
	$scope.role = "Company";
	$scope.pw = "";
	$scope.fail = false;
	$scope.isDisabled = false;
	$scope.login = function(){
		$scope.isDisabled = true;
		$scope.fail = false;
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {email: $scope.email, pw: $scope.pw, role: 'company'}
		}).done($scope.callSuccess)
		.fail($scope.callFail);

	}

	$scope.callSuccess = function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.fail = false;
				//userSession.newSession(data['name'], 'Company');
				$window.location.pathname = '/company/home'
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
			$scope.isDisabled = false;
		}

	$scope.callFail = function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later"
			$scope.isDisabled = false;
		}

    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }
});

cluelessApp.controller('applicantLoginModalCtrl', function($scope, $window, $modalInstance){
	$scope.email = "";
	$scope.role = "Applicant";
	$scope.pw = "";
	$scope.fail = false;
	$scope.isDisabled = false;
	$scope.login = function(){
		$scope.fail = false;
		$scope.isDisabled = true;
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {email: $scope.email, pw: $scope.pw, role: 'applicant'}
		}).done($scope.callSuccess)
		.fail($scope.callFail);
	}

	$scope.callSuccess = function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.fail = false;
				//userSession.newSession(data['name'], 'Applicant');
				$window.location.pathname = '/applicant/home';
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
			$scope.isDisabled = false;
		}

	$scope.callFail = function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later"
			$scope.isDisabled = false;
		}
    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }
});

cluelessApp.controller('applicantRegisterModalCtrl', function($scope, $modalInstance) {
	$scope.name = ""; $scope.password = ""; $scope.date = new Date(); $scope.confirmPassword = ""; $scope.email="";
	$scope.maxDate = new Date();
	$scope.success = false;
	$scope.fail = false;
	$scope.failMessage= "";
	$scope.opened = false;
	$scope.isDisabled = false;
	$scope.open = function(){
		$scope.opened = true;
	}
    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }
	$scope.registerApplicant = function(){
		$scope.success = false;
		$scope.fail = false;
		if(!$scope.date){
			$scope.fail = true;
			$scope.failMessage = "Please enter a valid date"
		}
		else{
			var date = $scope.date.getFullYear()+ '-' + ($scope.date.getMonth() + 1) + '-' + $scope.date.getDate();
			$scope.isDisabled = true;
		$.ajax({
			type: 'POST',
			url:'/register/applicant',
			data: {name:$scope.name, dob:date, email:$scope.email, pw:$scope.password, cpw:$scope.confirmPassword}
		}).done(function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.success= true;
				$scope.$apply();
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
			$scope.isDisabled = false;
		})
		.fail(function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later"
			$scope.isDisabled = false;
		});
	  }
	}

});

cluelessApp.controller('companyRegisterModalCtrl', function($scope, $modalInstance) {

	$scope.name = ""; $scope.password = ""; $scope.confirmPassword = ""; $scope.email="";
	$scope.success = false;
	$scope.fail = false;
	$scope.failMessage= "";
	$scope.isDisabled = false;
    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }
	$scope.registerCompany = function(){
		$scope.success = false;
		$scope.fail = false;
		$scope.isDisabled = true;
		$.ajax({
			type: 'POST',
			url:'/register/company',
			data: {name:$scope.name, email:$scope.email, pw:$scope.password, cpw:$scope.confirmPassword}
		}).done(function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.success= true;
				$scope.$apply();
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
			$scope.isDisabled = false;
		})
		.fail(function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later";
			$scope.isDisabled = false;
		});
	}

});

cluelessApp.controller('applicantHomeCtrl', function($scope, $http, $window){
	$scope.openJobs=[];
	$http.get('/applicant/listing').success(function(data){
		$scope.openJobs = data['jobListings'];
	}).
	error(function(){
		console.error("HTTP get request to /applicant/listing failed");
	});

	$scope.classDictionary={
		'Accepted': 'job-status-accepted',
		'Rejected':'job-status-rejected',
		'Review':'job-status-review',
		'Processing':'job-status-processing',
		'Offered':'job-status-offered'
	}

	$scope.logout = function(){
		$http.post('/logout').success(function(){
			$window.location.pathname = '/';
		})
		.error(function(){
			console.error("HTTP get request to /logout failed");
	});
	}
});

cluelessApp.controller('companyHomeCtrl', function($scope, $http, $window){
	$scope.postedJobs = [];
	
	$http.get('/company/listing').success(function(data){
		$scope.postedJobs = data['jobListings'];
	}).
	error(function(){
		console.error("HTTP get request to /company/listing failed");
	});

	$scope.addPostingPage = function(){
		$window.location.pathname = '/company/listing/add';
	}

	$scope.logout = function(){
		$http.post('/logout').success(function(){
			$window.location.pathname = '/';
		})
		.error(function(){
			console.error("HTTP get request to /logout failed");
	});
	}
});

cluelessApp.controller('addPostingCtrl', function($scope, $http, $window){

	$scope.questions = [];
	$http.get('/company/application_questions').success(function(data){
		$scope.questions = data['questions'];
		$scope.$apply();
		$("#available-questions, #selected-questions").sortable({
			revert: "invalid",
			connectWith: '.question-container'
		}).disableSelection();
	}).
	error(function(){
		console.error("HTTP get request to /company/questions failed");
	});

	$scope.title = "";
	$scope.category = "";
	$scope.type = "Internship";
	$scope.requirements = "";
	$scope.resp = "";
	$scope.comments = "";

	$scope.fail = false;
	$scope.isDisabled = false;

	$scope.addNewPosting = function(){
		$scope.isDisabled = true;
		$scope.fail = false;
		var questions = [];
		$("#selected-questions > li").each(function(index){
			questions.push($(this).data("id"));

		});
		$http.post('/company/insert_listing', {title: $scope.title, type:$scope.type, category:$scope.category,
			req: $scope.requirements, res:$scope.resp, comments: $scope.comments, qns: questions})
		.success(function(data){
			$scope.isDisabled = false;
			if(data['status'] == "ok")
				$window.location.pathname = '/company/home';
			else{
				$scope.fail = true;
				$scope.failMessage = data['msg'];
			}
		})
		.error(function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later";
			$scope.isDisabled = false;
		});
	}

});