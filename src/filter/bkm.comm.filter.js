(function () {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm')
        .filter('dateDiff', ['$filter', dateDiffFilter])
        .filter('pathUrl', pathUrl)
        .filter('kbSize', kbSize)
        .filter('EnumType', [EnumType])
        .filter('BankName', [BankName])
        .filter('TransType', [TransType])
        .filter('Ratings', [Ratings])
        .filter('splitCardNo', splitCardNo);

    function pathUrl() {
        return function (input, isSaveAs) {
            return abp.appPath + 'api/file/download?id=' + input + '&isSaveAs=' + (!!isSaveAs ? 'true' : 'false');
        };
    }

    function kbSize() {
        return function (input) {
            return !isNaN(input) ? parseInt(input / 1024) : input;
        };
    }

    //获取银行的名称
    function BankName() {
        return function (input) {
            if (input == null) { return input; }
            return bkm.bank.getBankNameByCode(input);
        };
    }
    //卡号隐藏和分组
    function splitCardNo() {
        return function (content, isReplaceStar) {
            if (content == null) { return content; }
            if (isReplaceStar) {
                var replacement = '$1';
                for (var i = 0; i < content.length - 7; i++) {
                    replacement = replacement + '*';
                }
                replacement = replacement + '$2';
                content = content.replace(/^(\d{4})\d+(\d{3})$/g, replacement);
            }
            return content ? content.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ") : content;
        };
    }

    //字典数据的过滤器
    function EnumType() {
        return function (input, typeName, isRtnObj, isRtnUnknow) {
            if (!angular.isString(typeName) || input == null) return isRtnUnknow === true ? "未知" : input;
            var rtnObj = bkm.DICT[typeName].filter(item => (item.key === input || item.value === input));
            if (rtnObj.length == 0) return input;
            return isRtnObj ? rtnObj[0] : rtnObj[0].name;
        };
    }

    //判断是装运还是签收的记录
    function TransType() {
        return function (input, type, field) {
            if (type == null || !field || !input || input.length == 0) return input;
            for (var i = 0; i < input.length; i++) {
                if (input[i].type == type) {
                    return input[i][field];
                }
            }
        };
    }

    // 判断评价类型
    function Ratings() {
        return function (input, type, field) {
            if (type == null || !field || !input || input.length == 0) return null;
            for (var i = 0; i < input.length; i++) {
                if (input[i].ratingType == type) {
                    return input[i][field];
                }
            }
        };
    }

    /**
     * 时间比较过滤器
     */
    function dateDiffFilter($filter) {
        return function (input) {
            if (angular.isUndefined(input)) return input;
            var result = "";
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var dateTimeStamp = angular.isDate(input) ? input : new Date(Date.parse(input));
            var diffValue = now - dateTimeStamp.getTime();
            if (diffValue < 0) {
                return input;
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC > 12) {
                result = $filter('date')(input, 'yyyy-MM-dd');
            }
            if (monthC >= 1) {
                result = "" + parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                result = "" + parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                result = "" + parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                result = "" + parseInt(hourC) + "小时前";
            } else if (minC >= 1) {
                result = "" + parseInt(minC) + "分钟前";
            } else
                result = "刚刚";
            return result;
        };
    }

})();