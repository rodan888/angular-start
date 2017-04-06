(function(){
	angular.module('nameApp')
		.controller('mainCtrl', ['$interval','$rootScope','$scope', '$window', '$routeParams', '$interval', '$timeout', '$localStorage', 'apiUrl', 'baseFunc', 'dataService', function($interval, $rootScope, $scope, $window, $routeParams, $interval, $timeout, $localStorage, apiUrl, baseFunc, dataService){
		
		$scope.test = "Hello from main controller!";
		// throw true;

		$scope.loadItems = function(){
			dataService.getData(apiUrl.itemsUrl)
				.then(function (response) {
					$scope.itemList = response.data;
				}, function (error) {
					throw dataService.catchError(error,'Ajax call error massege!');								
			});
		};

	}]);
}());