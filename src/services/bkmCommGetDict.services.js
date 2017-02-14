(function () {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm', ['abp'])
        .factory('bkm.library.angular.comm.httpInterceptor', httpInterceptor)
        .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', '$q', bkmCommGetDict]);

    //http 请求拦截器
    function httpInterceptor($q, $injector, $filter) {
        return {
            request: function (config) {
                sendDictionaryMD5Request(config);
                return config;
            },
            requestError: function (config) {
                return $q.reject(config);
            },
            response: function (response) {
                setDictionary(response);
                return response || $q.when(response);
            },
            responseError: function (response) {
                return $q.reject(response);
            }
        };

        //判断是否为WebApi请求
        function isApi(url) {
            var reg = /^\/web\/api\/[\w]{1,}/ig;
            reg.lastIndex = 0;
            return reg.test(url);
        }

        //发送字典缓存MD5请求
        function sendDictionaryMD5Request(config) {
            if (!isApi(config.url)) {
                return;
            }
            var param = angular.fromJson(config.data || config.params);
            if (!!param && angular.isArray(param.dictionaryTypes) && !!param.dictionaryTypes.length) {
                var dctionaryService = $injector.get('bkmCommGetDict'), key = '', arr, tArr = [], tStr = '';
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
                tStr = JSON.stringify(tArr);
                param.dictionaryHash = md5(tStr.split('').sort().join(''));
                if (!!config.data) {
                    config.data = angular.toJson(param);
                } else if (!!config.params) {
                    config.params = angular.toJson(param);
                }
            }
        }

        //设置字典缓存
        function setDictionary(response) {
            if (!isApi(response.config.url)) {
                return;
            }
            if (!!response.data.result && !!response.data.result.dictioanries && !!response.data.result.dictioanries.length) {
                var dctionaryService = $injector.get('bkmCommGetDict');
                var param = angular.fromJson(response.config.data || response.config.params);
                for (var i in param.dictionaryTypes) {
                    var key = param.dictionaryTypes[i];
                    if (angular.isFunction(dctionaryService['set' + key])) {
                        dctionaryService['set' + key]($filter('filter')(response.data.result.dictioanries, {type: key}));
                    }
                }
            }
        }
    }

    /** @ngInject */
    function bkmCommGetDict(abpDict, dictConst, $q) {
        var self = this;
        self.dictionary = {};
        for (var i in dictConst) {
            (function declareServiceFn(keyName) {
                self[keyName] = function () {

                    if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                        self.dictionary[dictConst[keyName]] = [];
                    }
                    if (!!self.dictionary[dictConst[keyName]].length) {
                        return dictConst[keyName];
                    } else {
                        self[keyName + 'Defer']();
                    }
                    return dictConst[keyName];
                };

                self[keyName + 'Defer'] = function () {
                    var deferred = $q.defer();

                    if (self.dictionary[dictConst[keyName]] && !!self.dictionary[dictConst[keyName]].length) {
                        deferred.reject(self.dictionary[dictConst[keyName]]);
                    } else {
                        abpDict.getAll({'type': dictConst[keyName]}).then(function (result) {
                            if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                                self.dictionary[dictConst[keyName]] = [];
                            }
                            self.dictionary[dictConst[keyName]].splice(0, self.dictionary[dictConst[keyName]].length);
                            Array.prototype.push.apply(self.dictionary[dictConst[keyName]], result.data.items);
                            deferred.resolve(self.dictionary[dictConst[keyName]]);
                        }, function (result) {
                            deferred.reject(result.data);
                        });
                    }
                    return deferred.promise;
                };

                self['set' + keyName] = function (items) {

                    if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                        self.dictionary[dictConst[keyName]] = items;
                    } else {
                        self.dictionary[dictConst[keyName]].splice(0, self.dictionary[dictConst[keyName]].length);
                        Array.prototype.push.apply(self.dictionary[dictConst[keyName]], items);
                    }
                };
            })(i);
        }
    }

    function init(constantVal) {

        //创建常量
        myModule.constant("dictionaryConst", constantVal);

        //根据常量创建 filter
        angular.forEach (constantVal, function declareFilterFn(i, key) {
            myModule.filter(key, ['bkmCommGetDict', '$filter', function (s, f) {
                /**
                 * @description
                 *
                 * 根据 dictionary 中的配置，替换 input 的值
                 *
                 * @param input {string} 接收的值
                 *   error from returned function, for cases when a particular type of error is useful.
                 * @returns {string} 返回替换后的值
                 */
                return function (input) {
                    if (angular.isUndefined(input))return input;
                    //从 'bkmCommGetDict' 服务中获取 dictionary 配置
                    var dicts = s.dictionary[key];
                    if (angular.isArray(dicts) && !!dicts.length) {
                        var filtered = f('filter')(dicts, {key: input});
                        return filtered[0].name;
                    }
                    return input;
                }
            }]);
        });
    }

    init({
        DrivingLicense: "DrivingLicense",
        Bank: "Bank",
        Unit: "Unit",
        GoodsCategory: "GoodsCategory",
        VehicleType: "VehicleType",
        OperationModel: "OperationModel",
        DispatchCancelReason: "DispatchCancelReason",
        OrderStatus: "OrderStatus",
        DrivingCertificate: "DrivingCertificate",
        ExpiredType: "ExpiredType",
        VehicleStatus: "VehicleStatus",
        DispatchStatus: "DispatchStatus",
        ShipType: "ShipType",
        VehicleDocument: "VehicleDocument",
        GoodsStatus: "GoodsStatus",
        SettlementWay: "SettlementWay",
        CompanyDocument: "CompanyDocument",
        AgentType: "AgentType"
    });

})();