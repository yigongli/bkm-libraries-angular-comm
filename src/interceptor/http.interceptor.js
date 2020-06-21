(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .factory('bkm.library.angular.comm.httpInterceptor', ['$q', '$injector', '$filter', httpInterceptor]);

    //http 请求拦截器
    function httpInterceptor($q, $injector, $filter) {
        return {
            request: function (config) {
                sendDictionaryMD5Request(config, $injector, $filter);
                return config;
            },
            requestError: function (config) {
                return $q.reject(config);
            },
            response: function (response) {
                setDictionary(response, $injector, $filter);
                return response || $q.when(response);
            },
            responseError: function (response) {
                return $q.reject(response);
            }
        };
    }

    //判断是否为WebApi请求
    function isApi(url) {
        var reg = /^\/api\/[\w]{1,}/ig;
        reg.lastIndex = 0;
        return reg.test(url);
    }

    //发送字典缓存MD5请求
    function sendDictionaryMD5Request(config, $injector) {
        if (!isApi(config.url)) {
            return;
        }
        var param = angular.fromJson(config.data || config.params);
        if (!!param && angular.isArray(param.dictionaryTypes) && !!param.dictionaryTypes.length) {
            var dctionaryService = $injector.get('bkmCommGetDict'),
                key = '',
                arr, tArr = [];
            for (var i in param.dictionaryTypes) {
                key = param.dictionaryTypes[i];
                arr = dctionaryService.dictionary[key];
                if (!!arr && !!arr.length) {
                    Array.prototype.push.apply(tArr, arr);
                }
            }
            if (!!!tArr.length) {
                return;
            }
            param.dictionaryHash = md5(angular.toJson(tArr).split('').sort().join(''));
            if (!!config.data) {
                config.data = angular.toJson(param);
            } else if (!!config.params) {
                config.params = angular.toJson(param);
            }
        }
    }

    //设置字典缓存
    function setDictionary(response, $injector, $filter) {
        if (!isApi(response.config.url)) {
            return;
        }
        if (!!response.data && !!response.data.dictionaries && !!response.data.dictionaries.length) {
            var dctionaryService = $injector.get('bkmCommGetDict');
            var param = angular.fromJson(response.config.data || response.config.params);
            for (var i in param.dictionaryTypes) {
                var key = param.dictionaryTypes[i];
                if (angular.isFunction(dctionaryService['set' + key])) {
                    dctionaryService['set' + key]($filter('filter')(response.data.dictionaries, {
                        type: key
                    }, true));
                }
            }
        }
    }

})();