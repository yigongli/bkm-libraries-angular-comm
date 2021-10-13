/**
 * Created by Cundong Zhang on 2018/02/26.
 */

var bkm = bkm || {};

(function () {
    'use strict';

    bkm.settle = bkm.settle || {};

    return bkm;
})();


(function () {
    'use strict';
    
    bkm.settle.downstreamSettlementComputing = function (settleParams) {
        if (typeof settleParams !== "object") {
            return null;
        }
        var v = Object.assign({}, settleParams);
        v.loadUnloadAmount = (v.loadingPrice || 0) + (v.unloadingPrice || 0);
        v.downAmountAdjust = v.downAmountAdjust || 0;
        v.downLossWay = (v.downLossWay == null) ? v.lossWay : v.downLossWay;
        //下游免责途损数量: 按比例时，转换为每车的免责数量
        v.downLossRangeQuant = v.downLossWay === bkm.CST.LossWay_Rate ? v.downLossRange * v.loaded : v.downLossRange;
        v.downLossRangeQuant = bkm.util.round(v.downLossRangeQuant);
        //下游亏吨扣款: (亏吨数量-免责途损数量) * 货品单价, 如果未设置途损，则不扣款
        v.losses = bkm.util.round(v.losses);
        v.downstreamLossAmount = (v.losses - (v.downLossWay === bkm.CST.LossWay_NotSet ? v.losses : v.downLossRangeQuant)) * (v.goodsUnitPrice || 0);
        v.downstreamLossAmount = v.downstreamLossAmount > 0 ? v.downstreamLossAmount : 0;
        v.downstreamLossAmount = bkm.util.round(v.downstreamLossAmount) || 0;
        //下游结算数量: 判断下游结算数量策略
        v.downstreamFinalWeight = v.downFinalWeightPolicy === bkm.CST.FinalWeightPolicy_Loaded ? v.loaded : (v.downFinalWeightPolicy === bkm.CST.FinalWeightPolicy_Reception ? v.receipt : Math.min(v.loaded, v.receipt));
        //下游结算数量增减
        v.downstreamFinalWeight = v.downstreamFinalWeight + (v.downFinalWeightAdjust || 0);
        v.downstreamFinalWeight = bkm.util.round(v.downstreamFinalWeight, 3);
        //下游运输服务费(元/车)(Ture表示收取服务费，false 表示不收取服务费)
        v.downServiceAmount = v.downIsIncludeServiceCharge ? v.downServiceCharge : 0;
        v.downServiceAmount = bkm.util.round(v.downServiceAmount || 0);
        //下游含税运价
        v.downTaxedFreightPrice = v.freightPrice;
        v.downTaxedFreightPrice = bkm.util.round(v.downTaxedFreightPrice || 0);
        //用于含税运价分组汇总
        v.downTaxedFreightPriceGrp = v.downTaxedFreightPrice;
        //下游含税运费金额：结算数量 * 含税运费单价
        v.taxedFreightAmount = bkm.util.round(v.downstreamFinalWeight * v.downTaxedFreightPrice);
        // 油气费金额
        v.oilChargeAmount = v.oilChargeAmount ? v.oilChargeAmount : (v.oilChargeType === bkm.CST.FuelChargeType_FixedAmount ? v.oilCharge : (v.oilCharge * v.taxedFreightAmount));
        v.oilChargeAmount = v.hasOilGas && (v.oilChargeType !== bkm.CST.FuelChargeType_None) ? bkm.util.round(v.oilChargeAmount || 0) : 0;
        v.gasChargeAmount = v.gasChargeAmount ? v.gasChargeAmount : (v.gasChargeType === bkm.CST.FuelChargeType_FixedAmount ? v.gasCharge : (v.gasCharge * v.taxedFreightAmount));
        v.gasChargeAmount = v.hasOilGas && (v.gasChargeType !== bkm.CST.FuelChargeType_None) ? bkm.util.round(v.gasChargeAmount || 0) : 0;
        // 现金结算金额:  含税运费金额 - 亏吨扣款 + 运费增减  - 运输服务费 - 装卸费 - 油费 - 气费 (该公式用于运费付款)
        v.downstreamFinalAmount = v.taxedFreightAmount - v.downstreamLossAmount + v.downAmountAdjust - v.downServiceAmount - v.loadUnloadAmount - v.oilChargeAmount - v.gasChargeAmount;
        v.downstreamFinalAmount = v.downstreamFinalAmount > 0 ? v.downstreamFinalAmount : 0;
        // 结算金额抹0
        if (v.isIgnoreSmall) {
            let ignoreSmallPos = v.ignoreSmallPos == null ? bkm.CST.IgnoreSmallPos_IgnoreYuan : v.ignoreSmallPos;
            let withCarry = (ignoreSmallPos === bkm.CST.IgnoreSmallPos_IgnoreJiaoCarry || ignoreSmallPos === bkm.CST.IgnoreSmallPos_IgnoreFenCarry);
            v.downstreamFinalAmount = ignoreSmallPos > 9 ? (parseInt(v.downstreamFinalAmount / ignoreSmallPos) * ignoreSmallPos) : bkm.util.decimal(v.downstreamFinalAmount, ignoreSmallPos, withCarry);
        }
        v.downstreamFinalAmount = bkm.util.round(v.downstreamFinalAmount);
        //下游对账金额: 对账金额把扣减掉的单车服务费还原回来，用于外部客户对账显示(华信客户)
        v.downExternalFinalAmount = v.downstreamFinalAmount + v.downServiceAmount + v.oilChargeAmount + v.gasChargeAmount;
        return v;
    };
}());
