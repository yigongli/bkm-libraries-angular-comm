﻿
(function () {
    'use strict';

    angular.module('bkm.library.angular.comm', ['abp'])
      .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', bkmCommGetDict])

    /** @ngInject */
    function bkmCommGetDict(abpDict, dictConst) {
        var self = this;
        self.dictionary = {

        };

        for (var i in dictConst) {
            createGetFn(i);
        }

        function createGetFn(keyName) {
            self['get' + dictConst[keyName]] = function () {

                if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                    self.dictionary[dictConst[keyName]] = [];
                }
                if (!!self.dictionary[dictConst[keyName]].length) {
                    return self.dictionary[dictConst[keyName]];
                } else {
                    abpDict.getAll(dictConst[keyName]).then(function (result) {
                        self.dictionary[dictConst[keyName]].push(result[dictConst[keyName]]);
                    }, null);
                }

                return self.dictionary[dictConst[keyName]];
            };

            self['set' + dictConst[keyName]] = function (items) {

                if (!angular.isArray(self.dictionary[dictConst[keyName]])) {
                    self.dictionary[dictConst[keyName]] = items;          
                } else {
                    self.dictionary[dictConst[keyName]].splice(0,
                        self.dictionary[dictConst[keyName]].length, items);
                }

            };
        }
        
    }

})();

(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .constant("dictionaryConst", {
            GoodsCategory: 'GoodsCategory',
            GoodsStatus: 'GoodsStatus',
            OrderStatus: 'OrderStatus'
        });
})();