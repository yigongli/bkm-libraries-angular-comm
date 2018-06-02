(function () {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm', ['abp'])
        .provider('dictionary', ['$provide', '$filterProvider', function ($provide, $filterProvider) {
            this.initial = function (constantVal) {
                //创建常量
                init(constantVal, $provide, $filterProvider);
            };
            this.$get = function () {
                return '';
            };
        }])
        .factory('bkm.library.angular.comm.httpInterceptor', ['$q', '$injector', '$filter', httpInterceptor])
        .service('bkmCommGetDict', ['abp.services.app.sysDictionary', 'dictionaryConst', '$q', bkmCommGetDict])
        .service('bkm.comm.map', bkmFrontendDictDef);

    //前端字典数据的本地定义
    var maps = {
        'HasDataError': [{
            key: false,
            name: '数据无误'
        }, {
            key: true,
            name: '数据有误'
        }],
        'DriverType': [{
            key: false,
            name: '司机'
        }, {
            key: true,
            name: '车主'
        }],
        'TrueFalse': [{
            key: false,
            name: "否"
        }, {
            key: true,
            name: "是"
        }],
        'ActiveStatus': [{
            key: false,
            name: "已禁用"
        }, {
            key: true,
            name: "已启用"
        }],
        'LoginStatus': [{
            key: false,
            name: "失败"
        }, {
            key: true,
            name: "成功"
        }],
        'AddressType': [{
            key: 0,
            name: '装货地',
            value: 'LOADED'
        }, {
            key: 1,
            name: '卸货地',
            value: 'UNLOADED'
        }],
        'AuthStatus': [{
            key: 0,
            name: '未认证',
            value: 'UNCHECKED'
        }, {
            key: 1,
            name: '认证中',
            value: 'CHECKING'
        }, {
            key: 2,
            name: '认证通过',
            value: 'PASSED'
        }, {
            key: 3,
            name: '认证失败',
            value: 'REJECTED'
        }],
        'AuthStatusPart': [{
            key: 2,
            name: '认证通过'
        }, {
            key: 3,
            name: '认证失败'
        }],
        'ApproveStatus': [{
            key: 0,
            name: '待审核',
            value: 'UNCHECK'
        }, {
            key: 1,
            name: '审核中',
            value: 'CHECKING'
        }, {
            key: 2,
            name: '审核通过',
            value: 'PASSED'
        }, {
            key: 3,
            name: '已拒绝',
            value: 'REJECTED'
        }],
        'ValidStatus': [{
            key: 0,
            name: "已失效"
        }, {
            key: 1,
            name: "已生效"
        }, {
            key: 2,
            name: "待生效"
        }],
        'TimeType': [{
            key: "creation",
            name: "创建"
        }, {
            key: "receipt",
            name: "签收"
        }, {
            key: "loaded",
            name: "矿发"
        }, {
            key: "dispatchNo",
            name: "派单"
        }, {
            key: "finish",
            name: "完成"
        }],
        'LoanTimeType': [{
            key: "value",
            name: "起息日期"
        }, {
            key: "expire",
            name: "到期日期"
        }],
        'ExchangesTimeType': [{
            key: 0,
            name: "上传时间"
        }, {
            key: 1,
            name: "创建时间"
        }],
        'TenantScope': [{
            key: 1,
            name: "自有货源"
        }, {
            key: 2,
            name: "第三方货源"
        }],
        'ServiceChargeUnit': [{
            key: 0,
            name: "元/吨"
        }, {
            key: 1,
            name: "元/车"
        }],
        'SettleType': [{
            key: 0,
            name: '按结算批次'
        }, {
            key: 1,
            name: '按单车'
        }],
        'FinalWeightPolicy': [{
            key: 0,
            name: '按矿发'
        }, {
            key: 1,
            name: '按签收'
        }, {
            key: 2,
            name: '取最小'
        }],
        'SettledStatus': [{
            key: 1,
            name: "上游已结算"
        }, {
            key: 2,
            name: "上游未结算"
        }, {
            key: 3,
            name: "下游已结算"
        }, {
            key: 4,
            name: "下游未结算"
        }],
        'PaymentBillType': [{
            key: 0,
            name: "下游资金流水"
        }, {
            key: 1,
            name: "上游资金流水"
        }],
        'TransDocConfirmStatus': [{
            key: 1,
            name: "发货已确认"
        }, {
            key: 2,
            name: "签收已确认"
        }, {
            key: 3,
            name: "发货签收已确认"
        }, {
            key: 4,
            name: "发货签收未确认"
        }, {
            key: 5,
            name: "发货已确认签收未确认"
        }, {
            key: 6,
            name: "发货未确认签收已确认"
        }],
        'SettleReportType': [{
            key: 0,
            name: '上游结算单'
        }, {
            key: 1,
            name: '下游结算单'
        }],
        'ReceivableStatus': [{
            key: 0,
            name: '待收款'
        }, {
            key: 1,
            name: '已收款'
        }],
        'PayableStatus': [{
            key: 0,
            name: '待付款'
        }, {
            key: 1,
            name: '已付款'
        }],
        'SeqType': [{
            key: 0,
            name: '收款'
        }, {
            key: 1,
            name: '付款'
        }],
        'AgentMode': [{
            key: 0,
            name: '企业'
        }, {
            key: 1,
            name: '个人'
        }],
        'MatchStatus': [{
            key: 0,
            name: '匹配失败'
        }, {
            key: 1,
            name: '匹配成功'
        }],
        'HasOrNot': [{
            key: 0,
            name: '无'
        }, {
            key: 1,
            name: '有'
        }],
        'LoanProductType': [{
            key: 0,
            name: '晋金贷7天期'
        }, {
            key: 1,
            name: '晋金贷30天期'
        }],
        'LoanContractStatus': [{
            key: 1,
            name: '正常'
        }, {
            key: 2,
            name: '逾期'
        }, {
            key: 3,
            name: '结清'
        }, {
            key: 4,
            name: '作废'
        }, {
            key: 5,
            name: '延期'
        }],
        'RepaymentStatus': [{
            key: 0,
            name: '未申请'
        }, {
            key: 1,
            name: '申请中'
        }, {
            key: 2,
            name: '还贷成功'
        }, {
            key: 3,
            name: '还贷失败'
        }],
        'AccountStatus': [{
            key: 0,
            name: '正常'
        }, {
            key: 1,
            name: '冻结'
        }, {
            key: 2,
            name: '作废'
        }, {
            key: 3,
            name: '认证中'
        }, {
            key: 4,
            name: '认证失败'
        }],
        'AccountCategory': [{
            key: 0,
            value: 'BA',
            name: '银行卡账户'
        }, {
            key: 1,
            value: 'LS',
            name: '运费账户'
        }, {
            key: 2,
            value: 'CA',
            name: '现金账户'
        }, {
            key: 3,
            value: 'LO',
            name: '贷款账户'
        }],
        'LoanAccountType': [{
            key: 0,
            name: '贷款总户'
        }, {
            key: '1',
            name: '晋金贷户'
        }],
        'RoleType': [{
            key: 'driver',
            name: '司机车主'
        }, {
            key: 'agent',
            name: '经纪人'
        }, {
            key: 'trader',
            name: '货主'
        }],
        'HaveOrNot': [{
            key: false,
            name: "无"
        }, {
            key: true,
            name: "有"
        }],
        'StarLevel': [{
            key: 0,
            name: "一星"
        }, {
            key: 1,
            name: "二星"
        }, {
            key: 2,
            name: "三星"
        }, {
            key: 3,
            name: "四星"
        }],
        'UploadStatus': [{
            key: 1,
            name: "上传成功"
        }, {
            key: 2,
            name: "上传失败"
        }, {
            key: 0,
            name: "未上传"
        }],
        'InterfaceType': [{
            key: 0,
            name: '部委接口',
            value: 'EXCHANGES_LOGINK'
        }, {
            key: 1,
            name: '物润接口',
            value: 'EXCHANGES_SHIP56'
        }],
        'AppPlatforms': [{
            key: 0,
            appId: 'wx321b67d70c162e92',
            pkgName: 'com.yigonglitech.logis.agentTest',
            isSpecialTenant: false,
            value: 'DEVTEST',
            name: '亿公里互联网承运测试平台'
        }, {
            key: 1,
            appId: 'wx6f8a21d50e88e173',
            isSpecialTenant: false,
            pkgName: 'com.yigonglitech.logis.agent',
            value: 'YGL',
            name: '亿公里互联网承运'
        }, {
            key: 2,
            appId: 'wxe38c2290668d07fc',
            pkgName: 'com.yunqi.clientandroid',
            isSpecialTenant: true,
            value: 'SXYQ',
            name: '公路物流服务平台'
        }]
    };

    function bkmFrontendDictDef() {
        var self = this;

        var mapsProxy = new Proxy(maps, {
            get: function (obj, prop) {
                if (prop in obj) {
                    return obj[prop].slice();
                } else {
                    console.log(bkm.util.format('The property {0}  is not existed!!', prop));
                }
            },
            set: function (obj, prop, value) {
                console.log(bkm.util.format('You can not set the readonly object property {0} value!', prop));
            }
        });

        Object.defineProperty(self, 'DICT', {
            enumerable: true,
            configurable: false,
            get: function () {
                return mapsProxy;
            },
            set: function (newValue) {
                console.log(bkm.util.format('You can not set the readonly object property DICT value to : {0}!', newValue));
            }
        });
        //循环定义只读的常量对象和字典对象
        Object.defineProperty(self, 'CST', {
            enumerable: true,
            configurable: false,
            writable: false,
            value: {}
        });
        for (var x in maps) {
            maps[x].forEach(function (item) {
                if (item.value != null) {
                    var cstKey = x + '_' + item.value;
                    Object.defineProperty(self.CST, cstKey, {
                        enumerable: true,
                        configurable: false,
                        writable: false,
                        value: item.key
                    });
                    var cstCN = x + '_' + item.value + '_CN';
                    Object.defineProperty(self.CST, cstCN, {
                        enumerable: true,
                        configurable: false,
                        writable: false,
                        value: item.name
                    });
                }
            });
        }
    }

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
                        dctionaryService['set' + key]($filter('filter')(response.data.dictionaries, {
                            type: key
                        }, true));
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
                        deferred.resolve(self.dictionary[dictConst[keyName]]);
                    } else {
                        abpDict.getAll({
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
            $filterProvider.register(key, ['bkmCommGetDict', '$filter', function (s, f) {
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
                    var dicts = s.dictionary[key];
                    if (angular.isArray(dicts) && !!dicts.length) {
                        var filtered = dicts.filter(function (item) {
                            return item[fieldName] == input;
                        });
                        return !!isObj ? (filtered.length == 0 ? '未知' : filtered[0]) :
                            (filtered.length == 0 ? '未知' : filtered[0].name);
                    }
                    return input;
                };
            }]);
        });
    }

})();