(function () {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm', ['abp'])
        .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', bkmCommGetDict])
        .config(myConfig);

    /** @ngInject */
    function bkmCommGetDict(abpDict, dictConst) {
        var self = this;
        self.dictionary = {};
        for (var i in dictConst) {
            (function declareServiceFn(keyName) {
                self[keyName] = function () {

                    if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                        self.dictionary[dictConst[keyName]] = [];
                    }
                    if (!!self.dictionary[dictConst[keyName]].length) {
                        return self.dictionary[dictConst[keyName]];
                    } else {
                        abpDict.getAll({ 'type': dictConst[keyName] }).then(function (result) {
                            self.dictionary[dictConst[keyName]].splice(0, self.dictionary[dictConst[keyName]].length);
                            Array.prototype.push.apply(self.dictionary[dictConst[keyName]], result.data.items);
                        }, null);
                    }

                    return dictConst[keyName];
                };

                self['set' + dictConst[keyName]] = function (items) {

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

    function myConfig(dictionaryConst) {
        declareFilter(dictionaryConst);
    };

    //根据常量定义 filter
    function declareFilter(dc) {
        for (var i in dc) {
            (function declareFilterFn(key) {
                myModule.filter(key, function (bkmCommGetDict, $filter) {
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
                        //从 'bkmCommGetDict' 服务中获取 dictionary 配置
                        var dicts = bkmCommGetDict.dictionary[bkmCommGetDict['get' + key]()];
                        var filtered = $filter('filter')(dicts, {key: input});
                        return filtered[0].name;
                    }
                });
            })(i);
        }
    }

    myModule.constant("dictionaryConst", {
        GoodsCategory: 'GoodsCategory',
        GoodsStatus: 'GoodsStatus',
        OrderStatus: 'OrderStatus',
        CompanyStatus: 'CompanyStatus',
        VehicleStatus: 'VehicleStatus',
        OperaType: 'OperaType',
        expiredType: 'expiredType'
    });

})();