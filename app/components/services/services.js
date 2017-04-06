(function(){
	angular
		.module('nameApp')
		.service('baseFunc', function(){
			this.lineLength = function(coords){
				var xPow 		= Math.pow(coords[2] - coords[0],2),
						yPow    = Math.pow(coords[3] - coords[1],2),
						lineLen = Math.sqrt(xPow+yPow);
				return lineLen;
			},
			this.checkObject = function(obj){
				for (var i in obj) {
					if (obj.hasOwnProperty(i)){
						return true;
					};
				};
				return false;
			},
			this.dateDifference = function(startTime,endTime){
				var delta;
				endTime.setHours(0);
				endTime.setMinutes(0);
				endTime.setSeconds(0);
				endTime.setMilliseconds(0);
				delta = endTime - startTime;

				return Math.round(delta / 1000 / 60 / 60/ 24);
			},
			this.randomInt = function(min, max){
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		})
		.service('dataService', ['$http','$rootScope', function ($http,$rootScope) {
			this.getData = function (urlBase) {
				return $http.get(urlBase);
			};
			this.getDataItem = function (urlBase, id) {
				return $http.get(urlBase + '/' + id);
			};
			this.insertData = function (urlBase, cust) {
				return $http.post(urlBase, cust);
			};
			this.updateData = function (urlBase, cust) {
				return $http.put(urlBase + '/' + cust.id, cust)
			};
			this.deleteData = function (urlBase) {
				return $http.delete(urlBase);
			};
			this.catchError = function(error,massage){				
				return '---'+error.statusText+'---'+massage+'---';				
			};
		}])
}());