
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