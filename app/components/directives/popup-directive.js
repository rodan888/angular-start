angular.module('nameApp')
	.directive('popupBtn', ['$document','$window', '$compile', popupBtn])
	.directive('popupClose', ['$document','$window', '$compile', popupClose])

	function popupBtn($document,$window,$compile){
		return {
			restrict: 'A',
			scope: true,
			link: function(scope,element,attrs){
				element.bind('click', function(e){
					var popupId = attrs.popupBlock,
							popupEl = document.getElementById(popupId);
					angular.element(popupEl).addClass('active');
				});
			}
		}
	};
	function popupClose($document,$window,$compile){
		return {
			restrict: 'A',
			scope: true,
			link: function(scope,element,attrs,ngModel){
				element.bind('click', function(e){
					var popups = document.getElementsByClassName('popup');
					for(var i = 0; i < popups.length; i++){
						angular.element(popups[i]).removeClass('active');
					};
				});
			}
		}
	};