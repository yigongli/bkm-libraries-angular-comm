/**
 * Created by gurihui on 2017/4/13.
 */
(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .directive('bkmFormValidIcon', dfn);

    /** @ngInject */
    function dfn() {
        return {
            restrict: 'A',
            require: "ngModel",
            transclude: true,
            template: '<span ng-transclude></span><i class="fa fa-close"></i>',
            replace: false,
            link: function (scope, elem, attr, ngModel) {
                console.log(scope);
            }
        };
    }
})();
