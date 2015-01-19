var cluelessApp = angular.module('app', ['ui.bootstrap', 'ngRoute']);

cluelessApp.config(function($locationProvider, $routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'static/angular_templates/applicantLandingPage.html',
		controller: 'applicantLandingPageCtrl'
	}).when('/company', {
		templateUrl: 'static/angular_templates/companyLandingPage.html',
		controller: 'companyLandingPageCtrl'
	}).otherwise({redirectTo: '/'});
});

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

cluelessApp.controller('loginModalCtrl', function($scope) {

});

cluelessApp.controller('applicantLandingPageCtrl', function($scope) {

});

cluelessApp.controller('companyLandingPageCtrl', function($scope) {

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