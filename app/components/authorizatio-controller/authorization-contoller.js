(function(){
	angular.module('nameApp')
		.controller('loginCtrl', ['$scope', '$location', '$localStorage', '$rootScope', 'AuthenticationService', function($scope, $location, $localStorage, $rootScope,AuthenticationService){			
			$rootScope.appConfig.user = false;
			var initController = function(){
				AuthenticationService.Logout();
			}();
			$scope.login = function(user){			
				AuthenticationService.Login(user, function (result){
					if(result === true) {
						$location.path('/page-one');
						$rootScope.appConfig.user = user;						
					}else if(typeof result === 'object'){
						$scope.error = result.data;			
					}else{
						$scope.error = 'Авторизационные данные указаны не верно!';						
					}
				});
			}

		}]);
}());