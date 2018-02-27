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

            //下游免责途损数量: 按比例时，转换为每车的免责数量
            v.downLossRangeQuant = v.lossWay == 1 ? v.downLossRange * v.loaded : v.downLossRange;
            //下游亏吨扣款: (亏吨数量-免责途损数量) * 货品单价, 如果未设置途损，则不扣款
            v.downstreamLossAmount = (v.losses - (v.lossWay == 0 ? v.losses : v.downLossRangeQuant)) * (v.goodsUnitPrice || 0);
            v.downstreamLossAmount = v.downstreamLossAmount > 0 ? v.downstreamLossAmount : 0;
            //下游结算数量: 判断下游结算数量策略
            v.downstreamFinalWeight = !v.downFinalWeightPolicy ? v.loaded : (v.downFinalWeightPolicy == 1 ? v.receipt : Math.min(v.loaded, v.receipt));
            //下游运费金额：结算数量 * 运费单价
            v.freightAmount = v.downstreamFinalWeight * v.freightPrice;
            //下游结算金额:  抹零取整（运费金额 - 亏吨扣款 + + 运费增减 ），去掉个位（包含）数后的零头
            var finalAmount = v.freightAmount - v.downstreamLossAmount + (v.downAmountAdjust || 0);
            v.downstreamFinalAmount = v.isIgnoreSmall ? parseInt(finalAmount / 10) * 10 : finalAmount;

            return angular.copy(v);

        };

    }
})();