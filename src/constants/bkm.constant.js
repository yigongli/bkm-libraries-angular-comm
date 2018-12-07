/**
 * Created by Cundong Zhang, 6.1.2018
 */

var bkm = bkm || {};

//For angular dynamically define enum types
if( typeof module == 'object'){
    module.exports = bkm;
}

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
            value: 'False',
            name: '数据无误'
        }, {
            key: true,
            value: 'True',
            name: '数据有误'
        }],
        'DriverType': [{
            key: false,
            value: 'False',
            name: '司机'
        }, {
            key: true,
            value: 'True',
            name: '车主'
        }],
        'TrueFalse': [{
            key: false,
            value: 'False',
            name: "否"
        }, {
            key: true,
            value: 'True',
            name: "是"
        }],
        'ActiveStatus': [{
            key: false,
            value: 'False',
            name: "已禁用"
        }, {
            key: true,
            value: 'True',
            name: "已启用"
        }],
        'SuccessStatus': [{
            key: false,
            value: 'False',
            name: "失败"
        }, {
            key: true,
            value: 'True',
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
            name: "已失效",
            value: 'Invalid'
        }, {
            key: 1,
            name: "已生效",
            value: 'Valid'
        }, {
            key: 2,
            name: "待生效",
            value: 'ToBeValid'
        }],
        'TimeType': [{
            key: 0,
            value: "loaded",
            name: "矿发"
        }, {
            key: 1,
            value: "receipt",
            name: "签收"
        }, {
            key: 2,
            value: "creation",
            name: "创建"
        }, {
            key: 3,
            value: "dispatchNo",
            name: "派单"
        }, {
            key: 4,
            value: "finish",
            name: "完成"
        }, {
            key: 5,
            value: "receiptUpload",
            name: "签收上传"
        }],
        'LoanTimeType': [{
            key: 0,
            value: "creation",
            name: "创建日期"
        }, {
            key: 1,
            value: "value",
            name: "起息日期"
        }, {
            key: 2,
            value: "expire",
            name: "到期日期"
        }, {
            key: 3,
            value: "repay",
            name: "还款日期"
        }],
        'ExchangesTimeType': [{
            key: 0,
            value: 'Upload',
            name: "上传时间"
        }, {
            key: 1,
            value: 'Creation',
            name: "创建时间"
        }],
        'TenantScope': [{
            key: 0,
            value: 'Unknow',
            name: "未知货源"
        }, {
            key: 1,
            value: 'Self',
            name: "自有货源"
        }, {
            key: 2,
            value: 'Other',
            name: "第三方货源"
        }],
        'ServiceChargeUnit': [{
            key: 0,
            value: 'Ton',
            name: "元/吨"
        }, {
            key: 1,
            value: 'Vehicle',
            name: "元/车"
        }],
        'SettleType': [{
            key: 0,
            value: 'Batch',
            name: '按批次'
        }, {
            key: 1,
            value: 'Single',
            name: '按单车'
        }],
        'FinalWeightPolicy': [{
            key: 0,
            value: 'Loaded',
            name: '按矿发'
        }, {
            key: 1,
            value: 'Reception',
            name: '按签收'
        }, {
            key: 2,
            value: 'Min',
            name: '取最小'
        }],
        'SettledStatus': [{
            key: 0,
            value: 'Unknow',
            name: "未知"
        }, {
            key: 1,
            value: 'UpSettled',
            name: "上游已结算"
        }, {
            key: 2,
            value: 'UpUnSettled',
            name: "上游未结算"
        }, {
            key: 3,
            value: 'DownSettled',
            name: "下游已结算"
        }, {
            key: 4,
            value: 'DownUnSettled',
            name: "下游未结算"
        }],
        'PaymentBillType': [{
            key: 0,
            value: 'Down',
            name: "下游资金流水"
        }, {
            key: 1,
            value: 'Up',
            name: "上游资金流水"
        }],
        'TransDocConfirmStatus': [{
            key: 0,
            value: 'Unknow',
            name: "未知"
        }, {
            key: 1,
            value: 'LoadConfirm',
            name: "发货已确认"
        }, {
            key: 2,
            value: 'ReceptConfirm',
            name: "签收已确认"
        }, {
            key: 3,
            value: 'LoadReceptConfirm',
            name: "发货签收已确认"
        }, {
            key: 4,
            value: 'LoadReceptUnConfirm',
            name: "发货签收未确认"
        }, {
            key: 5,
            value: 'LoadConfirmNoRecept',
            name: "发货已确认签收未确认"
        }, {
            key: 6,
            value: 'ReceptConfirmNoLoad',
            name: "发货未确认签收已确认"
        }],
        'SettleReportType': [{
            key: 0,
            value: 'Up',
            name: '上游结算单'
        }, {
            key: 1,
            value: 'Down',
            name: '下游结算单'
        }],
        'ReceivableStatus': [{
            key: 0,
            value: 'ToBeReceived',
            name: '待收款'
        }, {
            key: 1,
            value: 'Received',
            name: '已收款'
        }],
        'PayableStatus': [{
            key: 0,
            value: 'Unpaying',
            name: '待付款'
        }, {
            key: 1,
            value: 'Paid',
            name: '已付款'
        }],
        'SeqType': [{
            key: 0,
            value: 'Receivable',
            name: '收款'
        }, {
            key: 1,
            value: 'Payable',
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
            value: 'Original',
            name: '人工审核'
        }, {
            key: 1,
            value: 'Matched',
            name: '系统匹配'
        }, {
            key: 2,
            value: 'Empty',
            name: '未匹配'
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
            value: 'JJD_15',
            name: '提现快(晋金贷15天期)'
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
        }, {
            key: 7,
            value: 'Uncheck',
            name: '待审核'
        }, {
            key: 8,
            value: 'Rejected',
            name: '已拒绝'
        }],
        'RepaymentStatus': [{
            key: 0,
            value: 'NotApplied',
            name: '未申请'
        }, {
            key: 1,
            value: 'Applying',
            name: '申请中'
        }, {
            key: 2,
            value: 'Success',
            name: '还款成功'
        }, {
            key: 3,
            value: 'Failed',
            name: '还款失败'
        }],
        'AccountStatus': [{
            key: 0,
            value: 'Normal',
            name: '正常'
        }, {
            key: 1,
            value: 'Frozen',
            name: '冻结'
        }, {
            key: 2,
            value: 'Cancel',
            name: '作废'
        }, {
            key: 3,
            value: 'Applying',
            name: '认证中'
        }, {
            key: 4,
            value: 'Failure',
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
            value: 'Unknow',
            name: '未知'
        }, {
            key: 1,
            value: 'agent',
            name: '经纪人'
        }, {
            key: 2,
            value: 'trader',
            name: '货主'
        }, {
            key: 3,
            value: 'vehicleOwner',
            name: '车主'
        }, {
            key: 4,
            value: 'driver',
            name: '司机'
        }],
        'StarLevel': [{
            key: 0,
            value: 'One',
            name: "一星"
        }, {
            key: 1,
            value: 'Two',
            name: "二星"
        }, {
            key: 2,
            value: 'Three',
            name: "三星"
        }, {
            key: 3,
            value: 'Four',
            name: "四星"
        }],
        'UploadStatus': [{
            key: 0,
            value: 'NotUpload',
            name: "未上传"
        }, {
            key: 1,
            value: 'Success',
            name: "上传成功"
        }, {
            key: 2,
            value: 'UploadFailure',
            name: "上传失败"
        }, {
            key: 3,
            value: 'ValidFailure',
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
            value: 'Logistic',
            name: '物流公司'
        }, {
            key: 1,
            value: 'Trader',
            name: '货主'
        }, {
            key: 2,
            value: 'Purchaser',
            name: '收货方'
        }, {
            key: 3,
            value: 'Supplier',
            name: '供应商'
        }, {
            key: 4,
            value: 'Finance',
            name: '金融公司'
        }, {
            key: 5,
            value: 'Unknow',
            name: '未知'
        }],
        'PlatformType': [{
            key: 0,
            value: 'Private',
            name: "专用租户平台"
        }, {
            key: 1,
            value: 'Public',
            name: "亿公里公共平台"
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
        }],
        'DrawerType': [{
            key: 0,
            value: 'LogisCompany',
            name: '物流公司'
        }, {
            key: 1,
            value: 'Agent',
            name: '车队'
        }, {
            key: 2,
            value: 'Driver',
            name: '车主司机'
        }],
        'ServiceChargeType': [{
            key: 0,
            value: 'FixedAmount',
            name: '固定金额'  
        }, {
            key: 1,
            value: 'Rate',
            name: '按比例'  
        }],
        'BatchPayType': [{
            key: 0,
            value: 'BySettle',
            name: '结算单付款'
        },{
            key: 1,
            value: 'ByDetail',
            name: '明细付款'
        }],
        'PaymentStatus': [{
            key: 0,
            value: 'Ongoing',
            name: '付款中'
        }, {
            key: 1,
            value: 'Success',
            name: '付款成功'
        }, {
            key: 2,
            value: 'Failure',
            name: '付款失败'
        }],
        'InvoiceStatus': [{
            key: 0,
            value: 'Normal',
            name: '正常'
        }, {
            key: 1,
            value: 'Cancel',
            name: '作废'
        }],
        'BankCardVerifyType': [{
            key: 0,
            value: 'Unknow',
            name: '未知'
        }, {
            key: 2,
            value: 'TwoElement',
            name: '二要素验证'
        }, {
            key: 3,
            value: 'ThreeElement',
            name: '三要素验证'
        }, {
            key: 4,
            value: 'FourElement',
            name: '四要素验证'
        }],
        'TradingOrderType': [{
            key: 0,
            value: 'Settlement',
            name: '运费资产生成'
        }, {
            key: 1,
            value: 'BatchPay',
            name: '单车批量付款'
        },{
            key: 2,
            value: 'Recharge',
            name: '用户充值'
        },{
            key: 3,
            value: 'Loan',
            name: '贷款'
        },{
            key: 4,
            value: 'Repayment',
            name: '还款'
        },{
            key: 5,
            value: 'Cash',
            name: '提现'
        },{
            key: 6,
            value: 'Advance',
            name: '预付款'
        }],
        'TransDocType': [{
            key: 0,
            value: 'Loading',
            name: '装货'
        }, {
            key: 1,
            value: 'Receipt',
            name: '签收'
        }, {
            key: 2,
            value: 'Other',
            name: '其他'
        }],
        'PayWay': [{
            key: 0,
            value: 'Offline',
            name: '线下支付'
        }, {
            key: 1,
            value: 'NewPay',
            name: '新生支付'
        }, {
            key: 2,
            value: 'JJDPay',
            name: '晋金贷代付'
        }, {
            key: 3,
            value: 'CIBK',
            name: '中信银行'
        }],
        'UpOrDown': [{
            key: 0,
            value: 'Up',
            name: '上游'  
        }, {
            key: 1,
            value: 'Down',
            name: '下游'  
        }],
        'TransDocsType': [{
            key: 0,
            value: 'Load',
            name: '矿发'  
        }, {
            key: 1,
            value: 'Receipt',
            name: '签收'  
        }],
        'SettleInvoiceStatus': [{
            key: 0,
            value: 'NotApply',
            name: '未申请'
        }, {
            key: 1,
            value: 'Applying',
            name: '申请中'
        }, {
            key: 2,
            value: 'Approved',
            name: '开票中'
        }, {
            key: 3,
            value: 'Invoiced',
            name: '已开票'
        }, {
            key: 4,
            value: 'Rejected',
            name: '已拒绝'
        }],
        'InvoiceApplyStatus': [{
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
        }, {
            key: 4,
            name: '已开票',
            value: 'INVOICED'
        }]
    };

    var dictionariesProxy = new Proxy(dictionaries, {
        get: function(obj, prop) {
            if (prop in obj) {
                return obj[prop].slice();
            } else {
                console.log('The property   is not existed:');
            }
        },
        set: function(obj, prop, value) {
            console.log('You can not set the readonly object property value:');
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
            console.log('You can not set the readonly object property map value to : ');
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