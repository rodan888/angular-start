(function(){
	angular
		.module('nameApp')
			.factory('AuthenticationService', ['$rootScope', '$http', '$localStorage', 'apiUrl', function($rootScope, $http, $localStorage, apiUrl){
				this.Login = function(user, callback) {					
					$http.get(apiUrl.loginUrl)
						.then(function (response, stasus, headers, config){							
							if(response.data){								
								callback(true);
							}else{
								callback(false);
							};
						},function (error){
						callback(error);
					});
				};
				this.Logout = function(){					
					$rootScope.appConfig.user = false;
				};
				var service = {
					Login: this.Login,
					Logout: this.Logout
				};
				return service;
		}])
}());