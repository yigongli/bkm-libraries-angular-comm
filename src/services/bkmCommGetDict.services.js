(function() {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm', ['abp'])
        .provider('dictionary', ['$provide', '$filterProvider', function($provide, $filterProvider) {
            this.initial = function(constantVal) {
                //创建常量
                init(constantVal, $provide, $filterProvider);
            };
            this.$get = function() {
                return '';
            };
        }])
        .factory('bkm.library.angular.comm.httpInterceptor', ['$q', '$injector', '$filter', httpInterceptor])
        .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', '$q', bkmCommGetDict])
        .filter('dateDiff', ['$filter', dateDiffFilter]);

    //http 请求拦截器
    function httpInterceptor($q, $injector, $filter) {
        return {
            request: function(config) {
                sendDictionaryMD5Request(config);
                return config;
            },
            requestError: function(config) {
                return $q.reject(config);
            },
            response: function(response) {
                setDictionary(response);
                return response || $q.when(response);
            },
            responseError: function(response) {
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
                var dctionaryService = $injector.get('bkmCommGetDict'),
                    key = '',
                    arr, tArr = [];
                //, tStr = '';
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
                //tStr = angular.toJson(tArr);
                //param.dictionaryHash = md5(tStr.split('').sort().join(''));
                param.dictionaryHash = md5(angular.toJson(tArr).split('').sort().join(''));
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
            if (!!response.data && !!response.data.dictionaries && !!response.data.dictionaries.length) {
                var dctionaryService = $injector.get('bkmCommGetDict');
                var param = angular.fromJson(response.config.data || response.config.params);
                for (var i in param.dictionaryTypes) {
                    var key = param.dictionaryTypes[i];
                    if (angular.isFunction(dctionaryService['set' + key])) {
                        dctionaryService['set' + key]($filter('filter')(response.data.dictionaries, { type: key }, true));
                    }
                }
            }
        }
    }

    /**
     * 时间比较过滤器
     */
    function dateDiffFilter($filter) {
        return function(input) {
            if (angular.isUndefined(input)) return input;
            //从 'bkmCommGetDict' 服务中获取 dictionary 配置
            var result = "";
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var dateTimeStamp = angular.isDate(input) ? input : new Date(Date.parse(input));
            var diffValue = now - dateTimeStamp.getTime();
            if (diffValue < 0) {
                return input;
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC > 12) {
                result = $filter('date')(input, 'yyyy-MM-dd');
            }
            if (monthC >= 1) {
                result = "" + parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                result = "" + parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                result = "" + parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                result = "" + parseInt(hourC) + "小时前";
            } else if (minC >= 1) {
                result = "" + parseInt(minC) + "分钟前";
            } else
                result = "刚刚";
            return result;
        }
    }

    /** @ngInject */
    function bkmCommGetDict(abpDict, dictConst, $q) {
        var self = this;
        self.dictionary = {};
        for (var i in dictConst) {
            (function declareServiceFn(keyName) {
                self[keyName] = function() {

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

                self[keyName + 'Defer'] = function() {
                    var deferred = $q.defer();

                    if (self.dictionary[dictConst[keyName]] && !!self.dictionary[dictConst[keyName]].length) {
                        deferred.resolve(self.dictionary[dictConst[keyName]]);
                    } else {
                        abpDict.getAll({ 'type': dictConst[keyName], maxResultCount: '500', sorting: 'index ASC' }).then(function(result) {
                            if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                                self.dictionary[dictConst[keyName]] = [];
                            }
                            self.dictionary[dictConst[keyName]].splice(0, self.dictionary[dictConst[keyName]].length);
                            Array.prototype.push.apply(self.dictionary[dictConst[keyName]], result.data.items);
                            deferred.resolve(self.dictionary[dictConst[keyName]]);
                        }, function(result) {
                            deferred.reject(result.data);
                        });
                    }
                    return deferred.promise;
                };

                self['set' + keyName] = function(items) {
                    items.sort(compare('index'));
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

    function compare(prop) {
        return function(obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function init(constantVal, $provide, $filterProvider) {

        //创建常量
        $provide.constant("dictionaryConst", constantVal);

        //根据常量创建 filter
        angular.forEach(constantVal, function declareFilterFn(i, key) {
            $filterProvider.register(key, ['bkmCommGetDict', '$filter', function(s, f) {
                /**
                 * @description
                 *
                 * 根据 dictionary 中的配置，替换 input 的值
                 *
                 * @param input {string} 接收的值
                 *   error from returned function, for cases when a particular type of error is useful.
                 * @returns {string} 返回替换后的值
                 */
                return function(input, isObj, fieldName) {
                    fieldName = fieldName || 'key';
                    if (angular.isUndefined(input)) return input;
                    //从 'bkmCommGetDict' 服务中获取 dictionary 配置
                    var dicts = s.dictionary[key];
                    if (angular.isArray(dicts) && !!dicts.length) {
                        var filtered = dicts.filter(function(item) {
                            return item[fieldName] == input;
                        });
                        return !!isObj ? (filtered.length == 0 ? '未知' : filtered[0]) :
                            (filtered.length == 0 ? '未知' : filtered[0].name);
                    }
                    return input;
                }
            }]);
        });
    }

})();