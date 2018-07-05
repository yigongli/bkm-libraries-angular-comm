/**
 * Created by Cundong Zhang, 6.1.2018
 */

var bkm = bkm || {};

(function() {
    'use strict';

    //对象常量定义，建议只能定义最多一层子对象，访问时按照bkm.CST.parent_child_property访问，如bkm.CST.VAL_ID_CODE
    var commConstants = {
        VAL: { //for validation
            ID_CODE: "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$",
            VEHICLE_NO: "^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$",
            PHONE_NO: "^1\\d{10}$",
            BANKCARD_NO: "^([1-9]{1})(\\d{14}|\\d{15}|\\d{16}|\\d{17}|\\d{18})$"
        },
        MSG: {
            NetErr: "对不起，网络请求错误，请稍后重试！"
        }
    };

    //前端字典数据的本地定义
    var dictionaries = {
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
        }, {
            key: "receiptUpload",
            name: "签收上传"
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
            value: 'Company',
            name: '企业'
        }, {
            key: 1,
            value: 'Personal',
            name: '个人'
        }],
        'AgentType': [{
            key: 0,
            value: 'Own',
            name: '自有运力'
        }, {
            key: 1,
            value: 'Delegate',
            name: '委托运力'
        }, {
            key: 2,
            value: 'Customer',
            name: '客户运力'
        }],
        'MatchStatus': [{
            key: 0,
            name: '匹配失败'
        }, {
            key: 1,
            name: '匹配成功'
        }],
        'HaveOrNot': [{
            key: false,
            value: 'False',
            name: "无"
        }, {
            key: true,
            value: 'True',
            name: "有"
        }],
        'LoanAccountType': [{
            key: 0,
            value: 'JJD',
            name: '晋金小贷'
        }],
        'LoanProductType': [{
            key: 0,
            value: 'JJD_7',
            name: '提现宝(晋金贷7天期)'
        }, {
            key: 1,
            value: 'JJD_30',
            name: '云易贷(晋金贷30天期)'
        }],
        'CapitalStatus': [{
            key: 0,
            value: 'Unprocessed',
            name: '未处理'
        },{
            key: 1,
            value: 'Processed',
            name: '已放款'
        }],
        'LoanContractStatus': [{
            key: 0,
            value: 'Applying',
            name: '申请中'
        }, {
            key: 1,
            value: 'Normal',
            name: '正常'
        }, {
            key: 2,
            value: 'Overdue',
            name: '逾期'
        }, {
            key: 3,
            value: 'Settle',
            name: '结清'
        }, {
            key: 4,
            value: 'Cancel',
            name: '作废'
        }, {
            key: 5,
            value: 'Delay',
            name: '延期'
        }, {
            key: 6,
            value: 'Failed',
            name: '申请失败'
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
            value: 'BANK',
            name: '银行卡账户'
        }, {
            key: 1,
            value: 'REV_LOGIS',
            name: '应收运费账户'
        }, {
            key: 2,
            value: 'PAY_LOGIS',
            name: '应付运费账户'
        }, {
            key: 3,
            value: 'CASH',
            name: '现金账户'
        }, {
            key: 4,
            value: 'LOAN',
            name: '贷款账户'
        }, {
            key: 5,
            value: 'LEND',
            name: '放贷账户'
        }],
        'AssetSettleStatus': [{
            key: 0,
            value: 'Normal',
            name: '正常'
        }, {
            key: 1,
            value: 'Frozen',
            name: '冻结'
        }],
        'AssetSettleFrozenType': [{
            key: 0,
            value: 'Cash',
            name: '提现中'
        }, {
            key: 1,
            value: 'Loan',
            name: '贷款冻结'
        }, {
            key: 2,
            value: 'Force',
            name: '强制冻结'
        }],
        'AssetValidStatus': [{
            key: 0,
            value: 'Valid',
            name: '有效资产'
        }, {
            key: 1,
            value: 'Cancel',
            name: '已取消'
        }, {
            key: 2,
            value: 'Cash',
            name: '已提现'
        }],
        'BankCardType': [{
            key: 0,
            value: 'DC',
            name: '储蓄卡'
        }, {
            key: 1,
            value: 'CC',
            name: '信用卡'
        }, {
            key: 2,
            value: 'SCC',
            name: '准贷记卡'
        }, {
            key: 3,
            value: 'PC',
            name: '预付费卡'
        }],
        'RoleType': [{
            key: 0,
            value: 'Agent',
            name: '经纪人'
        }, {
            key: 1,
            value: 'Driver',
            name: '司机车主'
        }, {
            key: 2,
            value: 'Trader',
            name: '货主'
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
            key: 0,
            name: "未上传"
        }, {
            key: 1,
            name: "上传成功"
        }, {
            key: 2,
            name: "上传失败"
        }, {
            key: 3,
            name: "验证失败"
        }],
        'SendToAgentStatus': [{
            key: 0,
            value: 'NotSend',
            name: "未生成"
        }, {
            key: 1,
            value: 'Sent',
            name: "已生成"
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
        'CompanyType':[{
            key: 0,
            value: 'LOGIS',
            name: '物流公司'
        }, {
            key: 1,
            value: 'TRADER',
            name: '货主'
        }, {
            key: 2,
            value: 'PURCHASER',
            name: '收货方'
        }, {
            key: 3,
            value: 'FINANCE',
            name: '金融公司'
        }],
        'AppPlatforms': [{
            key: 0,
            appId: 'wx321b67d70c162e92',
            pkgName: 'com.yigonglitech.logis.agentTest',
            isSpecialTenant: true,
            value: 'DEVTEST',
            tenantId: 1,
            logisProtocolVer: 'SXYQ_LOGIS_PROTOCOL_100.html',
            name: '亿公里互联网承运测试平台'
        }, {
            key: 1,
            appId: 'wx6f8a21d50e88e173',
            isSpecialTenant: false,
            pkgName: 'com.yigonglitech.logis.agent',
            value: 'YGL',
            tenantId: 1,
            name: '亿公里互联网承运'
        }, {
            key: 2,
            appId: 'wx8e2718e146a283e7',
            pkgName: 'com.yunqi.clientandroid',
            isSpecialTenant: true,
            value: 'SXYQ',
            tenantId: 5,
            logisProtocolVer: 'SXYQ_LOGIS_PROTOCOL_100.html',
            name: '公路物流服务平台'
        }, {
            key: 3,
            appId: 'wx479e484ad5fdb097',
            pkgName: 'com.yunqi.clientandroid',
            isSpecialTenant: true,
            value: 'XYYQ',
            tenantId: 20,
            logisProtocolVer: 'SXYQ_LOGIS_PROTOCOL_100.html',
            name: '大宗物流服务平台'
        }],
        'VehicleCertType': [{
            key: 0,
            value: 'DrivingLicense',
            name: '司机驾驶证' 
        },{
            key: 1,
            value: 'VehicleLicense',
            name: '行驶证' 
        },{
            key: 2,
            value: 'OperationLicense',
            name: '道路运输证' 
        },{
            key: 3,
            value: 'IdentityLicense',
            name: '司机身份证' 
        },{
            key: 4,
            value: 'Qualification',
            name: '从业资格证' 
        }],
        'EffectNode': [{
            key: 0,
            value: 'Dispatch',
            name: '派车时间'
        },{
            key: 1,
            value: 'Load',
            name: '发货时间'
        },{
            key: 2,
            value: 'Arrive',
            name: '签收时间'
        }]
    };

    var dictionariesProxy = new Proxy(dictionaries, {
        get: function(obj, prop) {
            if (prop in obj) {
                return obj[prop].slice();
            } else {
                console.log(bkm.util.format('The property {0}  is not existed!!', prop));
            }
        },
        set: function(obj, prop, value) {
            console.log(bkm.util.format('You can not set the readonly object property {0} value!', prop));
        }
    });


    //Define bkm.DICT and bkm.CST readonly property
    Object.defineProperty(bkm, 'DICT', {
        enumerable: true,
        configurable: false,
        get: function() {
            return dictionariesProxy;
        },
        set: function(newValue) {
            console.log(bkm.util.format('You can not set the readonly object property map value to : {0}!', newValue));
        }
    });
    Object.defineProperty(bkm, 'CST', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: {}
    });

    //循环字典数据定义只读的常量对象   
    for (var x in dictionaries) {
        dictionaries[x].forEach(function(item) {
            if (item.value != null) {
                var cstKey = x + '_' + item.value;
                Object.defineProperty(bkm.CST, cstKey, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: item.key
                });
                var cstCN = x + '_' + item.value + '_CN';
                Object.defineProperty(bkm.CST, cstCN, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: item.name
                });
                var cstEN = x + '_' + item.value + '_EN';
                Object.defineProperty(bkm.CST, cstEN, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: item.value
                });
            }
        });
    }

    //迭代常量对象数据，定义只读的常量对象
    (function iterObjKeys(obj, props) {
        if (typeof obj != 'object') return null;
        props = props || [];
        for (var i in obj) {
            if (typeof(obj[i]) == 'object') {
                props.push(i);
                iterObjKeys(obj[i], props);
                props.pop(i);
            } else {
                var cstKey = props.length > 0 ? (props.join('_') + '_' + i) : i;
                Object.defineProperty(bkm.CST, cstKey, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: obj[i]
                });
            }
        }
    })(commConstants);


})();