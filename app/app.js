(function(){
	angular.module('nameApp', ['ngRoute', 'ngStorage', 'ngWebsocket'])
		.constant('apiUrl',{
			"baseUrl":  'http://localhost:3000/',
			"itemsUrl":	"testJson.json"
		})
		.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
			$httpProvider.defaults.headers.common['X-Requested-With'];
			$httpProvider.defaults.headers.post   = {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8; Access-Control-Expose-Headers=*'};
			$httpProvider.defaults.headers.delete = {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'};
			$httpProvider.defaults.useXDomain     = true;

			$routeProvider
			.when('/', {
				templateUrl: 'components/main-controller/main-ctrl.html',
				controller: 'mainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			})
		}])
		.run(['$window', '$rootScope', '$http', '$location', '$localStorage', '$route', '$timeout', function($window, $rootScope, $http, $location, $localStorage, $route, $timeout) {
			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				
			});

			$rootScope.appConfig = {
				preloader: false,
				appError: {
					status: false,
					message: ''
				}
			};

			window.onerror = function(msg, file, line, col, error) {
				var report = {					
					agent: navigator.userAgent,
					url: window.location.href,
					errorTime: new Date().toISOString(),
					file: file,
					line: line
				};
				if (col) report.column = col;
				if (error) {
					report.errorType = error instanceof EvalError ? 'EvalError' :
					error instanceof RangeError ? 'RangeError':
					error instanceof ReferenceError ? 'ReferenceError':
					error instanceof SyntaxError ? 'SyntaxError':
					error instanceof TypeError ? 'TypeError':
					error instanceof URIError ? 'URIError': 'Unknown error';
					report.stack = error.stack;
					report.originalMessage = error.message;
				};
				report.message = msg;

				$rootScope.appConfig.appError.status = true;
				$rootScope.appConfig.appError.message = report;
				$http.post('http://someApiLogUrl/', report)
				.then(function (response) {
						console.log('Log on update server!');
					}, function (error) {
						console.log(error)
				});
			};
		}])
		.config(['$provide', function($provide) {
			$provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector) {  
				return function(exception, cause) {
					var $http         = $injector.get('$http'),
							$rootScope    = $injector.get('$rootScope'),
							$localStorage = $injector.get('$localStorage');

					$delegate(exception, cause);
					var report = {
						agent: navigator.userAgent,
						url: window.location.href,
						errorTime: new Date().toISOString(),
						massage: exception
					};

					$rootScope.appConfig.appError.status = true;
					$rootScope.appConfig.appError.message = report;
					$http.post('http://someApiLogUrl/', report)
						.then(function (response) {
							console.log('Log on update server!');
						}, function (error) {
							console.log(error)
					});
				};
			}]);
		}])
}());