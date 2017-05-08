/**
 * Created by gurihui on 2017/4/27.
 */
(function () {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .constant('bkm.input.pattern.valid', {
            identityCode: "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$",
            plateNumber:"^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$",
            phoneNumber:"^1{\\d}{10}$"
        });
})();
