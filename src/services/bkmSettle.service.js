/**
 * Created by Cundong Zhang on 2018/02/26.
 */
(function() {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .service('bkmSettleService', [bkmSettleService]);

    /** @ngInject */
    function bkmSettleService() {

        var self = this;

        //下游结算金额计算
        self.downstreamSettlementComputing = function(settleParams) {
            if (!angular.isObject(settleParams)) {
                return null;
            }
            var v = angular.extend({}, settleParams);
            v.downLossWay = (v.downLossWay == null) ? v.lossWay : v.downLossWay;
            //下游免责途损数量: 按比例时，转换为每车的免责数量
            v.downLossRangeQuant = v.downLossWay == 1 ? v.downLossRange * v.loaded : v.downLossRange;
            v.downLossRangeQuant = bkm.util.round (v.downLossRangeQuant);
            //下游亏吨扣款: (亏吨数量-免责途损数量) * 货品单价, 如果未设置途损，则不扣款
            v.downstreamLossAmount = (v.losses - (v.downLossWay == 0 ? v.losses : v.downLossRangeQuant)) * (v.goodsUnitPrice || 0);
            v.downstreamLossAmount = v.downstreamLossAmount > 0 ? v.downstreamLossAmount : 0;
            v.downstreamLossAmount = bkm.util.round(v.downstreamLossAmount);
            //下游结算数量: 判断下游结算数量策略
            v.downstreamFinalWeight = !v.downFinalWeightPolicy ? v.loaded : (v.downFinalWeightPolicy == 1 ? v.receipt : Math.min(v.loaded, v.receipt));
            //下游结算数量增减
            v.downstreamFinalWeight = v.downstreamFinalWeight + (v.downFinalWeightAdjust || 0);
            v.downstreamFinalWeight = bkm.util.round(v.downstreamFinalWeight);
            //下游含税运价
            v.downTaxRate = v.downTaxRate || 0;
            v.downTaxedFreightPrice = v.isDownIncludeTax ? v.freightPrice : (v.freightPrice / (1 - v.downTaxRate));
            v.downTaxedFreightPrice = bkm.util.round(v.downTaxedFreightPrice);
            //下游裸运价
            v.noDownTaxedFreightPrice = v.isDownIncludeTax ? v.freightPrice * (1 - v.downTaxRate) : v.freightPrice;
            v.noDownTaxedFreightPrice = bkm.util.round(v.noDownTaxedFreightPrice);
            //下游原始运费金额：结算数量 * 运费单价
            v.freightAmount = bkm.util.round(v.downstreamFinalWeight * v.freightPrice);
            //下游含税运费金额：结算数量 * 含税运费单价
            v.taxedFreightAmount = bkm.util.round(v.downstreamFinalWeight * v.downTaxedFreightPrice);
            //下游裸运费金额：结算数量 * 裸运费单价
            v.noTaxedFreightAmount = bkm.util.round(v.downstreamFinalWeight * v.noDownTaxedFreightPrice);
            //未含税结算金额:  抹零取整（裸运费金额 - 亏吨扣款 + + 运费增减 ），去掉个位（包含）数后的零头
            var finalAmount = v.noTaxedFreightAmount - v.downstreamLossAmount + (v.downAmountAdjust || 0);
            v.downNoTaxedFinalAmount = (v.isIgnoreSmall ? parseInt(finalAmount / 10) * 10 : finalAmount);
            //下游含税结算金额
            v.downstreamFinalAmount = v.downNoTaxedFinalAmount / (1 - v.downTaxRate);
            v.downstreamFinalAmount = bkm.util.round(v.downstreamFinalAmount);
            //下游税费
            v.downTaxedAmount = v.downstreamFinalAmount - v.downNoTaxedFinalAmount;

            return angular.copy(v);

        };

    }
})();