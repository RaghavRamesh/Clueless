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

cluelessApp.controller('indexCtrl', function($scope, $modal) {
	$scope.launchLogin = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/loginModal.html',
		      controller: 'loginModalCtrl'
    	});
	};

	$scope.launchRegister = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/choosePersonRegisterModal.html',
		      controller: 'registerModalCtrl'
    	});
	}
});

cluelessApp.controller('headerCtrl', function($scope, $window) {
	$scope.current = null;
	$scope.alternate = null;
	$scope.alternateURL = null
	if($window.location.pathname === "/company")
	{
		$scope.current = "Company";
		$scope.alternate = "Applicant";
		$scope.alternateURL = "/";
	}
	else
	{
		$scope.current = "Applicant";
		$scope.alternate = "Company";
		$scope.alternateURL = "/company";
	}
});


cluelessApp.controller('loginModalCtrl', function($scope) {

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

cluelessApp.controller('applicantRegisterModalCtrl', function($scope, $modalInstance) {

});

cluelessApp.controller('companyRegisterModalCtrl', function($scope, $modalInstance) {

});