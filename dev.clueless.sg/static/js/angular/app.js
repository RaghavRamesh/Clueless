var cluelessApp = angular.module('app', ['ui.bootstrap']);

cluelessApp.controller('indexCtrl', function($scope, $modal) {
	$scope.launchLogin = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/loginModal.html',
		      controller: 'loginModalCtrl'
    	});
	};

	$scope.launchRegister = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/registerModal.html',
		      controller: 'registerModalCtrl'
    	});
	}
});

cluelessApp.controller('loginModalCtrl', function($scope) {

});

cluelessApp.controller('registerModalCtrl', function($scope) {

});
