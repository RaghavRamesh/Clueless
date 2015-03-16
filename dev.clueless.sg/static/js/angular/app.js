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

cluelessApp.controller('indexCtrl', function($scope, $modal, $window) {
	$scope.launchLogin = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/choosePersonLoginModal.html',
		      controller: 'loginModalCtrl'
    	});
	};

	$scope.launchRegister = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/choosePersonRegisterModal.html',
		      controller: 'registerModalCtrl'
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

cluelessApp.controller('companyLoginModalCtrl', function($scope){
	$scope.email = "";
	$scope.role = "Company";
	$scope.pw = "";
	$scope.fail = false;
	$scope.login = function(){
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {email: $scope.email, pw: $scope.pw, role: 'companies'}
		}).done(function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.fail = false;
				console.log("Success!")
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
		})
		.fail(function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later"
		});

	}
});

cluelessApp.controller('applicantLoginModalCtrl', function($scope){
	$scope.email = "";
	$scope.role = "Applicant";
	$scope.pw = "";
	$scope.fail = false;
	$scope.login = function(){
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {email: $scope.email, pw: $scope.pw, role: 'applicants'}
		}).done(function(data){
			data = JSON.parse(data);
			if(data['status'] =="ok"){
				$scope.fai = false;
				console.log("Success!")
			}
			else if(data['status'] =="fail"){
				$scope.fail = true;
				$scope.failMessage = data['msg'];
				$scope.$apply();
			}
		})
		.fail(function(data){
			$scope.fail = true;
			$scope.failMessage = "An unexpected error occurred. Please try again later"
		});

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
