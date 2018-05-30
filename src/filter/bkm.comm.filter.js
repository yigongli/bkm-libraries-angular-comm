(function () {
    'use strict';

    var myModule = angular.module('bkm.library.angular.comm')
        .filter('dateDiff', ['$filter', dateDiffFilter])
        .filter('pathUrl', pathUrl)
        .filter('kbSize', kbSize)
        .filter('EnumType', ['bkm.comm.map', EnumType])
        .filter('TransType', [TransType]);

    function pathUrl() {
        return function(input, isSaveAs) {
            return abp.appPath + 'api/file/download?id=' + input + '&isSaveAs=' + (!!isSaveAs ? 'true' : 'false');
        };
    }

    function kbSize() {
        return function(input) {
            return !isNaN(input) ? parseInt(input / 1024) : input;
        };
    }

    //字典数据的过滤器
    function EnumType(map) {
        return function(input, typeName, isRtnObj) {
            if (!typeName || input == null) return input;
            var rtnObj = map.DICT[typeName].filter(function(item) {
                return (item.key === input || item.code === input);
            });
            if (rtnObj.length == 0) return input;
            return isRtnObj ? rtnObj[0] : rtnObj[0].name;
        };
    }

    //判断是装运还是签收的记录
    function TransType() {
        return function(input, type, field) {
            if (type == null || !field || !input || input.length == 0) return input;
            for (var i = 0; i < input.length; i++) {
                if (input[i].type == type) {
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