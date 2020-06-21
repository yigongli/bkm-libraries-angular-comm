(function () {
    'use strict';

    angular.module('bkm.library.angular.comm', ['abp'])
        .provider('dictionary', ['$provide', '$filterProvider', function ($provide, $filterProvider) {
            this.initial = function (constantVal) {
                //创建常量
                init(constantVal, $provide, $filterProvider);
            };
            this.$get = function () {
                return '';
            };
        }])
        .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', '$q', bkmCommGetDict]);

    /** @ngInject */
    function bkmCommGetDict(sysDictionaryApi, dictConst, $q) {
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
                        deferred.resolve(self.dictionary[dictConst[keyName]]);
                    } else {
                        sysDictionaryApi.getAll({
                            'type': dictConst[keyName],
                            maxResultCount: '500',
                            sorting: 'index ASC'
                        }).then(function (result) {
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
        return function (obj1, obj2) {
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
        };
    }

    function init(constantVal, $provide, $filterProvider) {

        //创建常量
        $provide.constant("dictionaryConst", constantVal);

        //根据常量创建 filter
        angular.forEach(constantVal, function declareFilterFn(i, key) {
            $filterProvider.register(key, ['bkmCommGetDict', function (dictSvc) {
                /**
                 * @description
                 *
                 * 根据 dictionary 中的配置，替换 input 的值
                 *
                 * @param input {string} 接收的值
                 *   error from returned function, for cases when a particular type of error is useful.
                 * @returns {string} 返回替换后的值
                 */
                return function (input, isObj, fieldName) {
                    fieldName = fieldName || 'key';
                    if (angular.isUndefined(input)) return input;
                    //从 'bkmCommGetDict' 服务中获取 dictionary 配置
                    var dicts = dictSvc.dictionary[key];
                    if (angular.isArray(dicts) && !!dicts.length) {
                        var filtered = dicts.filter((item) => item[fieldName] == input);
                        return !!isObj ? (filtered.length == 0 ? '未知' : filtered[0]) :
                            (filtered.length == 0 ? '未知' : filtered[0].name);
                    }
                    return input;
                };
            }]);
        });
    }

})();