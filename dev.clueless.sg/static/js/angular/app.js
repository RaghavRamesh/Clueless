var cluelessApp = angular.module('app', ['ui.bootstrap']);

cluelessApp.controller('indexCtrl', function($scope, $modal) {
	$scope.launchLogin = function() {
		var modalInstance = $modal.open({
		      templateUrl: 'static/angular_templates/loginModal.html',
		      controller: 'loginModalCtrl'
    	});
	}
});

cluelessApp.controller('loginModalCtrl', function($scope) {

});