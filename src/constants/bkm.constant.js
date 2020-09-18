/**
 * Created by Cundong Zhang, 6.1.2018
 */

var bkm = bkm || {};

//For angular dynamically define enum types
if (typeof module == 'object') {
    module.exports = bkm;
}

(function () {
    'use strict';

    //对象常量定义，建议只能定义最多一层子对象，访问时按照bkm.CST.parent_child_property访问，如bkm.CST.VAL_ID_CODE
    bkm.commConstants = {
        VAL: { //for validation
            ID_CODE: "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X|x)$",
            VEHICLE_NO: "^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$",
            VEHICLE_FARM_NO: "^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]\\d{7}$",
            PHONE_NO: "^1\\d{10}$",
            BANKCARD_NO: "^([1-9]{1})(\\d{14}|\\d{15}|\\d{16}|\\d{17}|\\d{18})$",
            PASSWORD: "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$"
        },
        MSG: {
            NetErr: "对不起，网络请求错误，请稍后重试！"
        },
        FEATURE: {
            DispatchImport: "DispatchImport",
            Location: "Location",
            Payment: "Payment",
            Finance: "Finance",
            InvoiceOnline: "InvoiceOnline"
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
        }, {
            key: 6,
            value: "payment",
            name: "付款"
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
            name: "货主已结算"
        }, {
            key: 2,
            value: 'UpUnSettled',
            name: "货主未结算"
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
            name: '人工匹配'
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
        }, {
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
            name: '充值账户'
        }, {
            key: 4,
            value: 'LOAN',
            name: '贷款账户'
        }, {
            key: 5,
            value: 'LEND',
            name: '放贷账户'
        }, {
            key: 6,
            value: 'NEW_PAY',
            name: '新生支付账户'
        }, {
            key: 7,
            value: 'CITIC_PAY',
            name: '中信支付账户'
        }, {
            key: 8,
            value: 'ADVANCE',
            name: '运费预付款账户'
        }, {
            key: 9,
            value: 'TENANT_REV_LOGIS',
            name: '平台运费收入账户'
        }, {
            key: 11,
            value: 'BORROW',
            name: '往来户'
        }, {
            key: 15,
            value: 'GrossProfit',
            name: '利润户'
        } ,{
            key: 16,
            value: 'InvoicePayCredit',
            name: '欠款账户'
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
        'WalletCustomerRole': [{
            key: 0,
            value: 'Agent',
            name: '经纪人'
        }, {
            key: 1,
            value: 'Driver',
            name: '司机'
        }, {
            key: 2,
            value: 'Trader',
            name: '货主'
        }, {
            key: 3,
            value: 'Tenant',
            name: '租户'
        }, {
            key: 4,
            value: 'Host',
            name: '平台'
        }],
        'UploadStatus': [{
            key: 0,
            value: 'NotUpload',
            name: "上传中"
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
        }, {
            key: 99,
            value: 'NotGenerated',
            name: "未生成"
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
        'CompanyType': [{
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
            value: 'TaxSubstitute',
            name: '税务代开公司'
        }, {
            key: 6,
            value: 'TraderLogis',
            name: '货主物流公司'
        }, {
            key: 7,
            value: 'Branch',
            name: '分支机构'
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
        }, {
            key: 1,
            value: 'VehicleLicense',
            name: '行驶证'
        }, {
            key: 2,
            value: 'OperationLicense',
            name: '道路运输证'
        }, {
            key: 3,
            value: 'IdentityLicense',
            name: '司机身份证'
        }, {
            key: 4,
            value: 'Qualification',
            name: '从业资格证'
        }],
        'EffectNode': [{
            key: 0,
            value: 'Dispatch',
            name: '派车时间'
        }, {
            key: 1,
            value: 'Load',
            name: '发货时间'
        }, {
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
            key: 5,
            value: 'Substitute',
            name: '税务代开机构'
        }, {
            key: 7,
            value: 'Branch',
            name: '分支机构'
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
        }, {
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
        }, {
            key: 3,
            value: 'Unpay',
            name: '未付款'
        }],
        'CashStatus': [{
            key: 0,
            value: 'Ongoing',
            name: '提现中'
        }, {
            key: 1,
            value: 'Success',
            name: '提现成功'
        }, {
            key: 2,
            value: 'Failure',
            name: '提现失败'
        }, {
            key: 3,
            value: 'Unpay',
            name: '未提现'
        }],
        'PaidTo': [{
            key: 0,
            value: 'PaidTo',
            name: '银行卡'
        }, {
            key: 1,
            value: 'DriverWallet',
            name: '司机钱包'
        }],
        'DispatchCreatedBy': [{
            key: 0,
            value: 'ByAgent',
            name: '车队派车'
        }, {
            key: 1,
            value: 'ByDriver',
            name: '司机抢单'
        }],
        'InvoiceStatus': [{
            key: 0,
            value: 'Normal',
            name: '正常'
        }, {
            key: 1,
            value: 'Cancel',
            name: '作废'
        }, {
            key: 2,
            value: 'Redl',
            name: '红冲'
        }, {
            key: 3,
            value: 'Opening',
            name: '开票中'
        }, {
            key: 4,
            value: 'Failed',
            name: '失败'
        }, {
            key: 5,
            value: 'NotOpen',
            name: '未开票'
        }],
        'InvoicePrintStatus': [{
            key: 0,
            value: 'UnPrint',
            name: '未打印'
        }, {
            key: 1,
            value: 'Printed',
            name: '已打印'
        }],
        'InvoicePrintType': [{
            key: 0,
            value: 'Invoice',
            name: '发票'
        }, {
            key: 1,
            value: 'Detail',
            name: '清单'
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
            value: 'AgencyPay',
            name: '单车批量付款-1'
        }, {
            key: 2,
            value: 'Recharge',
            name: '用户充值'
        }, {
            key: 3,
            value: 'Loan',
            name: '贷款'
        }, {
            key: 4,
            value: 'Repayment',
            name: '还款'
        }, {
            key: 5,
            value: 'Cash',
            name: '提现'
        }, {
            key: 7,
            value: 'InvoicePay',
            name: '运费补差'
        }, {
            key: 8,
            value: 'ServiceFee',
            name: '预付款'
        }, {
            key: 9,
            value: 'SettlementAssist',
            name: '物流辅助'
        }, {
            key: 10,
            value: 'FundCollection',
            name: '资金归集'
        }, {
            key: 11,
            value: 'Refund',
            name: '退款'
        }, {
            key: 18,
            value: 'InnerAgencyPay',
            name: '单车批量付款-0'
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
        }, {
            key: 5,
            name: '已生成',
            value: 'Created'
        }, {
            key: 6,
            name: '撤回中',
            value: 'Canceling'
        }],
        'DispatchStatus': [{
            key: 0,
            value: 'Uncheck',
            name: '待审核'
        }, {
            key: 1,
            value: 'Checking',
            name: '审核中'
        }, {
            key: 2,
            value: 'Dispatched',
            name: '已派单'
        }, {
            key: 3,
            value: 'Rejected',
            name: '已拒绝'
        }, {
            key: 4,
            value: 'Accepted',
            name: '已接单'
        }, {
            key: 5,
            value: 'Printed',
            name: '已打印'
        }, {
            key: 6,
            value: 'Loaded',
            name: '已装运'
        }, {
            key: 7,
            value: 'OnWay',
            name: '在途'
        }, {
            key: 8,
            value: 'Arrived',
            name: '已签收'
        }, {
            key: 9,
            value: 'Finished',
            name: '已完成'
        }, {
            key: 10,
            value: 'Canceled',
            name: '已作废'
        }, {
            key: 11,
            value: 'Unpaid',
            name: '待支付'
        }],
        'DispatchLocationStatus': [{
            key: 0,
            value: 'Unknow',
            name: '未定位'
        }, {
            key: 1,
            value: 'Normal',
            name: '定位匹配'
        }, {
            key: 2,
            value: 'LocationNotExist',
            name: '无数据'
        }, {
            key: 3,
            value: 'LoadLocationError',
            name: '卸货地匹配'
        }, {
            key: 4,
            value: 'UnloadLocationError',
            name: '装货地匹配'
        }, {
            key: 5,
            value: 'LoadAndUnloadLocationError',
            name: '轨迹存在'
        }],
        'GoodsStatus': [{
            key: 0,
            value: 'Uncheck',
            name: '待审核'
        }, {
            key: 1,
            value: 'Checking',
            name: '审核中'
        }, {
            key: 2,
            value: 'Published',
            name: '已发布'
        }, {
            key: 3,
            value: 'Rejected',
            name: '已拒绝'
        }, {
            key: 4,
            value: 'Failed',
            name: '已流标'
        }, {
            key: 5,
            value: 'Finished',
            name: '已完成'
        }, {
            key: 6,
            value: 'Recycled',
            name: '已回收'
        }, {
            key: 7,
            value: 'Canceled',
            name: '已作废'
        }],
        "ExpenseType": [{
            key: 0,
            value: 'DispatchPay',
            name: '运费付款'
        }, {
            key: 1,
            value: 'InvoicePay',
            name: '开票扣款'
        }, {
            key: 2,
            value: 'Recharge',
            name: '充值'
        }],
        "VehicleLevel": [{
            key: 0,
            value: 'L1',
            name: '一星 *'
        }, {
            key: 1,
            value: 'L2',
            name: '二星 **'
        }, {
            key: 2,
            value: 'L3',
            name: '三星 ***'
        }, {
            key: 3,
            value: 'L4',
            name: '四星 ****'
        }, {
            key: 99,
            value: 'Ln',
            name: '无星'
        }],
        "TimeSpan": [{
            key: 0,
            value: 'All',
            name: '全部'
        }, {
            key: 1,
            value: 'Today',
            name: '今天'
        }, {
            key: 2,
            value: 'Tomorrow',
            name: '明天'
        }, {
            key: 3,
            value: 'Week',
            name: '本周'
        }, {
            key: 4,
            value: 'Month',
            name: '本月'
        }],
        "InvoiceSplitType": [{
            key: 0,
            value: 'Default',
            name: '系统默认'
        }, {
            key: 1,
            value: 'Province',
            name: '按省'
        }, {
            key: 2,
            value: 'ProvinceCity',
            name: '按省市'
        }, {
            key: 3,
            value: 'Route',
            name: '按线路'
        }],
        "JointTrans": [{
            key: 0,
            value: 'None',
            name: '无'
        }, {
            key: 1,
            value: 'H2RByContainer',
            name: '公铁集装箱联运'
        }],
        "LossWay": [{
            key: 0,
            value: 'NotSet',
            name: '未设置'
        }, {
            key: 1,
            value: 'Rate',
            name: '按比例'
        }, {
            key: 2,
            value: 'Weight',
            name: '按重量'
        }],
        "SettleBillType": [{
            key: 0,
            value: "Settlement",
            name: "结算单"
        }, {
            key: 1,
            value: "Payment",
            name: "付款单"
        }, {
            key: 2,
            value: "LogisAssistant",
            name: "物流辅助单"
        }],
        "TradingOrderStatus": [{
            key: 0,
            value: "Processing",
            name: "处理中"
        }, {
            key: 1,
            value: "Success",
            name: "成功"
        }, {
            key: 2,
            value: "Failed",
            name: "失败"
        }, {
            key: 3,
            value: "Unprocessed",
            name: "未处理"
        }],
        "DQKpiType": [{
            key: 0,
            value: 'DriverVehicleStar',
            name: '车辆星级'
        }, {
            key: 2,
            value: 'SelfService',
            name: '自助货主'
        }],
        "FinalAmountSettlePolicy": [{
            key: 0,
            value: 'ByDivision',
            name: '除法计算'
        }, {
            key: 1,
            value: 'ByMulitiplication',
            name: '乘法计算'
        }],
        "SettleRateType": [{
            key: 0,
            value: 'TaxRate',
            name: '销项费率'
        }, {
            key: 1,
            value: 'SettleAmountRate',
            name: '结算金额费率'
        }],
        "SettleAttachesType": [{
            key: 0,
            value: 'LogisContract',
            name: '运输合同'
        }, {
            key: 1,
            value: 'Other',
            name: '其他'
        }],
        "Unit": [{
            key: 0,
            value: 'Ton',
            name: '吨'
        }, {
            key: 1,
            value: 'Kg',
            name: '千克'
        }, {
            key: 2,
            value: 'Stere',
            name: '立方米'
        }, {
            key: 3,
            value: 'Car',
            name: '车'
        }, {
            key: 4,
            value: 'Piece',
            name: '件'
        }],
        "ComplaintStatus": [{
            key: 0,
            value: 'ToBeAssign',
            name: '待分配'
        }, {
            key: 1,
            value: 'InProcess',
            name: '处理中'
        }, {
            key: 2,
            value: 'Confirming',
            name: '反馈中'
        }, {
            key: 3,
            value: 'Closed',
            name: '已关闭'
        }],
        "ComplaintCategory": [{
            key: 0,
            value: 'Advises',
            name: '售前咨询'
        }, {
            key: 1,
            value: 'Transportation',
            name: '运输服务'
        }, {
            key: 2,
            value: 'Finances',
            name: '财务问题'
        }, {
            key: 3,
            value: 'System',
            name: '系统使用'
        }, {
            key: 4,
            value: 'Operation',
            name: '运营服务'
        }],
        "TicketPriority": [{
            key: 0,
            value: 'Urgent',
            name: '紧急'
        }, {
            key: 1,
            value: 'Important',
            name: '重要'
        }, {
            key: 2,
            value: 'Normal',
            name: '一般'
        }],
        "DriverJoinWay": [{
            key: 0,
            value: 'ByAgent',
            name: '车队添加'
        }, {
            key: 1,
            value: 'Register',
            name: '司机注册'
        }],
        "Gender": [{
            key: 0,
            value: 'Male',
            name: '男'
        }, {
            key: 1,
            value: 'Female',
            name: '女'
        }, {
            key: 2,
            value: 'Unknow',
            name: '未知'
        }],
        "CertificateType": [{
            key: 0,
            value: 'IDCard',
            name: '身份证'
        }, {
            key: 1,
            value: 'Passport',
            name: '护照'
        }, {
            key: 2,
            value: 'Company',
            name: '营业执照'
        }, {
            key: 3,
            value: 'Officer',
            name: '军官证'
        }],
        "DrivingLicenseType": [{
            key: 0,
            value: 'A1',
            name: 'A1'
        }, {
            key: 1,
            value: 'A2',
            name: 'A2'
        }, {
            key: 2,
            value: 'A3',
            name: 'A3'
        }, {
            key: 3,
            value: 'B1',
            name: 'B1'
        }, {
            key: 4,
            value: 'B2',
            name: 'B2'
        }, {
            key: 5,
            value: 'C1',
            name: 'C1'
        }, {
            key: 6,
            value: 'C2',
            name: 'C2'
        }, {
            key: 7,
            value: 'C3',
            name: 'C3'
        }],
        "RatingStar": [{
            key: 0,
            value: "Unknow",
            name: "未知"
        }, {
            key: 1,
            value: "One",
            name: "一星"
        }, {
            key: 2,
            value: "Two",
            name: "二星"
        }, {
            key: 3,
            value: "Three",
            name: "三星"
        }, {
            key: 4,
            value: "Four",
            name: "四星"
        }, {
            key: 5,
            value: "Five",
            name: "五星"
        }],
        "RatingType": [{
            key: 0,
            value: "ByTrader",
            name: "货主评价"
        }, {
            key: 1,
            value: "ByDriver",
            name: "司机评价"
        }],
        "RefundStatus": [{
            key: 0,
            value: "Processing",
            name: "处理中"
        }, {
            key: 1,
            value: "Success",
            name: "成功"
        }, {
            key: 2,
            value: "Failed",
            name: "失败"
        }, {
            key: 3,
            value: "Unprocessed",
            name: "未处理"
        }],
        "AntCreditAgreementType": [{
            key: 0,
            value: "CreditAuth",
            name: "授权协议"
        }, {
            key: 1,
            value: "CreditConfirm",
            name: "应收转让协议"
        }],
        "LocationType": [{
            key: 0,
            value: 'VehiclePosition',
            name: '当前位置'
        }, {
            key: 1,
            value: 'DispatchTrack',
            name: '运单轨迹'
        }, {
            key: 2,
            value: 'VehicleTrack',
            name: '车辆轨迹'
        }],
        "OrderStatus": [{
            key: 0,
            value: 'Checking',
            name: '待审核'
        }, {
            key: 1,
            value: 'Rejected',
            name: '已拒绝'
        }, {
            key: 2,
            value: 'Excuting',
            name: '执行中'
        }, {
            key: 3,
            value: 'CancelConfirm',
            name: '取消中'
        }, {
            key: 4,
            value: 'Cancelled',
            name: '已取消'
        }, {
            key: 5,
            value: 'Finished',
            name: '已完成'
        }, {
            key: 6,
            value: 'Recycled',
            name: '已回收'
        }],
        "TransInType": [{
            key: 0,
            value: 'PayBehalf',
            name: '代付'
        },{
            key: 1,
            value: 'AdvanceSb',
            name: '垫资'
        }],
        "DifferTransType": [{
            key: 0,
            value: 'Pending',
            name: '待处理'
        }, {
            key: 1,
            value: 'Refund',
            name: '退款'
        }, {
            key: 2,
            value: 'Distribute',
            name: '调拨中'
        }, {
            key: 3,
            value: 'AddWhiteList',
            name: '加入白名单'
        }],
        "SmsMobileType": [{
            key: 0,
            value: 'DifferTransIn',
            name: '异名来账'
        }]
    };

    var dictionariesProxy = new Proxy(dictionaries, {
        get: function (obj, prop) {
            if (prop in obj) {
                return obj[prop].slice();
            } else {
                console.log('The property   is not existed:');
            }
        },
        set: function (obj, prop, value) {
            console.log('You can not set the readonly object property value:');
        }
    });


    //Define bkm.DICT and bkm.CST readonly property
    Object.defineProperty(bkm, 'DICT', {
        enumerable: true,
        configurable: false,
        get: function () {
            return dictionariesProxy;
        },
        set: function (newValue) {
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
        dictionaries[x].forEach(function (item) {
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
            if (typeof (obj[i]) == 'object') {
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
    })(bkm.commConstants);


})();