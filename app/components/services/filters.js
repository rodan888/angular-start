angular.module('nameApp')
	.filter('toplus', function(){
		return function(value, sort) {
			var num = value < 0 ? -value : value;
			return num;
		}
	})
	.filter('isEmpty', [function() {
		return function(object) {
			return angular.equals({}, object);
		}
	}])