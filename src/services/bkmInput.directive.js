/**
 * Created by gurihui on 2017/2/10.
 */
(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .directive('bkmInput', inputvalidator);
    //function inputvalidator($q, $parse, bkmWebApiService)
    function inputvalidator($q, $parse) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {

                ngModel.errorMsg = {};

                if (!!!ngModel)return;

                function rendAttr() {
                    setErrorMsg('required');
                    setErrorMsg('pattern');
                    setErrorMsg('max');
                    setErrorMsg('min');
                    setErrorMsg('step');
                    setErrorMsg('maxlength');
                    setErrorMsg('minlength');
                    setErrorMsg('remote');

                    if (attr['type'] === 'tel') {
                        setErrorMsg('tel');
                        ngModel.$validators.tel = function telValid(modelValue, viewValue) {
                            var value = modelValue || viewValue;
                            // 如果值为空则不验证
                            if (!!!value)return true;
                            return /^1[0-9]{10}$/.test(value);
                        };
                    } else if (attr['type'] === 'email') {
                        setErrorMsg('email');
                    } else if (attr['type'] === 'url') {
                        setErrorMsg('url');
                    }

                    if (!!attr['remote']) {
                        var remoteOpt = $parse(attr['remote'])(scope);
                        ngModel.$asyncValidators.remote = function remoteValidation(modelValue, viewValue) {
                            var value = modelValue || viewValue;
                            var deferred = $q.defer();
                            // 如果值为空则不验证
                            if (!!!value) {
                                deferred.resolve(true);
                                return deferred.promise;
                            }
                            deferred.resolve(true);
                            /*bkmWebApiService[remoteOpt.apiName](angular.extend({phone: (ngModel.$modelValue || ngModel.$viewValue)}, remoteOpt.sendData),
                             function (result) {
                             if (result.valid) {
                             deferred.resolve(true);
                             } else {
                             if (!!result.msg) {
                             ngModel.errorMsg['remoteError'] = result.msg;
                             }
                             deferred.reject(false);
                             }
                             }, function (result) {
                             ngModel.$setValidity('remoteRequest', false);
                             deferred.resolve(true);
                             });*/
                            return deferred.promise;
                        };
                    }

                    //对输入的内容比较
                    if (!!attr.compare) {
                        ngModel.$validators.compare = function (modelValue, viewValue) {
                            var value = modelValue || viewValue;
                            // 如果值为空则不验证
                            if (!!!value)return true;

                            var compareVal = $parse(attr.compare)(scope);
                            if (!!!compareVal) return true;

                            return value === compareVal;

                        };
                        setErrorMsg('compare');
                    }
                }

                function setErrorMsg(key) {
                    if (key === 'tel') {
                        ngModel.errorMsg[key + 'Error'] = attr[key + 'Error'] || '手机验证未通过';
                        return;
                    } else if (key === 'url') {
                        ngModel.errorMsg[key + 'Error'] = attr[key + 'Error'] || 'Url验证未通过';
                        return;
                    } else if (key === 'email') {
                        ngModel.errorMsg[key + 'Error'] = attr[key + 'Error'] || 'email验证未通过';
                        return;
                    }

                    if (!!attr[key]) {
                        if (key === 'remote') {
                            ngModel.errorMsg[key + 'Error'] = attr[key + 'Error'] || '服务端验证未通过';
                            ngModel.errorMsg[key + 'RequestError'] = attr[key + 'RequestError'] || '服务器请求错误';
                            return;
                        }
                        ngModel.errorMsg[key + 'Error'] = attr[key + 'Error'] || '验证未通过';
                    }
                }

                rendAttr();
            }
        };
    }
})();