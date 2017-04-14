/**
 * Created by gurihui on 2017/4/13.
 */
(function () {
    'use strict';

    var toolTipTemp =
        '<div class="bkm-tooltipt bottom">\
            <div class="arrow"></div>\
            <div class="popover-content"></div>\
        </div>';

    angular.module('bkm.library.angular.comm')
        .directive('bkmFormValidIcon', dfn);

    /** @ngInject */
    function dfn($compile) {
        return {
            restrict: 'A',
            require: "ngModel",
            scope: {
                hideIcon: '@bkmFormValidIcon'
            },
            compile: function (element, attributes) {
                return {
                    post: function postLink(scope, elem, attributes, ngModelCtrl) {
                        if (scope.hideIcon === true || scope.hideIcon === 'true')return;
                        var tooltip,
                            doc = angular.element(document);
                        scope.m = ngModelCtrl;
                        var icon = $compile('<div class="bkm-form-icon form-control"><i class="ion-alert-circled bkm-feedback" data-toggle="popover" ng-show="!m.$valid && (m.$dirt || m.$$parentForm.$submitted)" ng-click="showValidError($event);"></i></div>')(scope);
                        elem.after(icon);
                        elem.appendTo(icon);
                        //icon.popover();
                        scope.showValidError = function (e) {
                            e.stopPropagation();
                            if (!tooltip) {
                                tooltip = angular.element(toolTipTemp);
                            }
                            var msg = [];
                            angular.forEach(ngModelCtrl.errorMsg, function (v, i) {
                                msg.push(v + '<br/>')
                            });
                            tooltip.find('.popover-content').append(msg.join(''));
                            tooltip.css("display", "block");
                            tooltip.css("top", "11px");
                            tooltip.appendTo(icon);

                            doc.on('click', function () {
                                if (tooltip && tooltip.length) {
                                    tooltip.remove();
                                    tooltip = undefined;
                                }
                                doc.off('click');
                            });

                        }

                    }
                }
            }
        };
    }
})();
