/**
 * Created by Cundong Zhang on 2018/02/26.
 */

var bkm = bkm || {};
bkm.settle = bkm.settle || {};
bkm.settle.downstreamSettlementComputing = function (settleParams) {
    if (!angular.isObject(settleParams)) {
        return null;
    }
    var v = angular.extend({}, settleParams);
    v.loadUnloadAmount = (v.loadingPrice || 0) + (v.unloadingPrice || 0);
    v.downLossWay = (v.downLossWay == null) ? v.lossWay : v.downLossWay;
    //下游免责途损数量: 按比例时，转换为每车的免责数量
    v.downLossRangeQuant = v.downLossWay === bkm.CST.LossWay_Rate ? v.downLossRange * v.loaded : v.downLossRange;
    v.downLossRangeQuant = bkm.util.round(v.downLossRangeQuant);
    //下游亏吨扣款: (亏吨数量-免责途损数量) * 货品单价, 如果未设置途损，则不扣款
    v.losses = bkm.util.round(v.losses);
    v.downstreamLossAmount = (v.losses - (v.downLossWay === bkm.CST.LossWay_NotSet  ? v.losses : v.downLossRangeQuant)) * (v.goodsUnitPrice || 0);
    v.downstreamLossAmount = v.downstreamLossAmount > 0 ? v.downstreamLossAmount : 0;
    v.downstreamLossAmount = bkm.util.round(v.downstreamLossAmount) || 0;
    //下游结算数量: 判断下游结算数量策略
    v.downstreamFinalWeight = v.downFinalWeightPolicy === bkm.CST.FinalWeightPolicy_Loaded ? v.loaded : (v.downFinalWeightPolicy === bkm.CST.FinalWeightPolicy_Reception ? v.receipt : Math.min(v.loaded, v.receipt));
    //下游结算数量增减
    v.downstreamFinalWeight = v.downstreamFinalWeight + (v.downFinalWeightAdjust || 0);
    v.downstreamFinalWeight = bkm.util.round(v.downstreamFinalWeight);
    //下游运输服务费(元/车)(Ture表示收取服务费，false 表示不收取服务费)
    v.downServiceAmount = v.downIsIncludeServiceCharge ? v.downServiceCharge : 0;
    //下游含税运价
    v.downTaxRate = v.downTaxRate || 0;
    v.downTaxedFreightPrice = v.isDownIncludeTax ? v.freightPrice : (v.finalAmountSettlePolicy == bkm.CST.FinalAmountSettlePolicy_ByDivision ? (v.freightPrice / (1 - v.downTaxRate)) : (v.freightPrice * (1 + v.downTaxRate)));
    v.downTaxedFreightPrice = bkm.util.round(v.downTaxedFreightPrice);
    //用于含税运价分组汇总
    v.downTaxedFreightPriceGrp = v.downTaxedFreightPrice;
    //下游含税运费金额：结算数量 * 含税运费单价
    v.taxedFreightAmount = bkm.util.round(v.downstreamFinalWeight * v.downTaxedFreightPrice);
    //含税结算金额:  含税运费金额 - 亏吨扣款 + 运费增减  - 服务费 - 装卸费
    v.downstreamFinalAmount = v.taxedFreightAmount - v.downstreamLossAmount + (v.downAmountAdjust || 0) - v.downServiceAmount - v.loadUnloadAmount;
    v.downstreamFinalAmount = v.downstreamFinalAmount > 0 ? v.downstreamFinalAmount : 0;
    // 结算金额抹0
    v.downstreamFinalAmount = (v.isIgnoreSmall ? parseInt(v.downstreamFinalAmount / 10) * 10 : v.downstreamFinalAmount);
    v.downstreamFinalAmount = bkm.util.round(v.downstreamFinalAmount);
    //下游对账金额: 对账金额把扣减掉的单车服务费还原回来，用于外部客户对账显示(华信客户)
    v.downExternalFinalAmount = v.downstreamFinalAmount + v.downServiceAmount;
    return v;
};


(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .service('bkmSettleService', [bkmSettleService]);

    /** @ngInject */
    function bkmSettleService() {
        var self = this;
        //下游结算金额计算
        self.downstreamSettlementComputing = bkm.settle.downstreamSettlementComputing;
    }
})();