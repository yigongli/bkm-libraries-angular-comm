/**
 * Created by gurihui on 2017/2/10.
 * 表单验证服务
 */
(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .service('bkmFmValSvc', ['$q', '$timeout', bkmFormValidatorService]);

    /** @ngInject */
    function bkmFormValidatorService($q, $timeout) {
        var self = this;
        self.isValid = function isValidFn(form) {
            var deferred = $q.defer();
            $timeout(function submitData() {
                deferred.resolve({
                    isSuccess: form.$valid,
                    error: getErrors(form)
                });
            }, 0);
            return deferred.promise;
        }

        function getErrors(form) {
            if (form.$valid)return [];
            var error = [];
            getErrorMsg(form.$error, error);
            return error;
        }

        // 递归获取错误消息
        function getErrorMsg(error, arr) {
            for (var k in error) {
                if (angular.isArray(error[k])) {
                    getErrorMsg(error[k], arr);
                } else {
                    for (var key in error[k].$error) {
                        arr.push((error[k].errorMsg[key + 'Error'] || ( error[k].$name + '验证未通过')));
                    }
                }
            }
        }
    }
})();