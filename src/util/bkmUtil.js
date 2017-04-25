

var bkm = bkm || {};

(function () {
    'use strict';

    bkm.util = bkm.util || {};
    bkm.date = bkm.date || {};

    return bkm;
})();

(function () {
    'use strict';

    /*
     * 两个对象判等
     */
    bkm.util.isObjectsEqual = function (a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    };

    bkm.util.postMockForm = function (URL, PARAMS) {
        var temp_form = document.createElement("form");
        temp_form.action = URL;
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        var opt = document.createElement("textarea");
        opt.name = 'form';
        opt.value = JSON.stringify(PARAMS);
        temp_form.appendChild(opt);


        document.body.appendChild(temp_form);
        temp_form.submit();

        document.body.removeChild(temp_form);
    }

    /*
     * 删除数组中指定元素
     */
    bkm.util.removeByValue = function (_array, val) {
        for (var i = 0; i < _array.length; i++) {
            if (this[i] == val) {
                _array.splice(i, 1);
                break;
            }
        }
    };

    /*
     * 删除对象集合中具有指定特征的对象    
     */

    bkm.util.removeByObjectWithKeys = function (_array, obj) {
        var props = Object.getOwnPropertyNames(obj);
        var propsAmount = props.length;

        for (var i = _array.length - 1; i >= 0; i--) {
            var counter = 0;

            for (var j = 0; j < propsAmount; j++) {
                if (_array[i].hasOwnProperty(props[j]) && _array[i][props[j]] == obj[props[j]]) {
                    counter = counter + 1;
                }
            }

            if (counter == propsAmount) {
                _array.splice(i, 1);
            }

        }
    }


    /*
     * 删除对象集合中具有指定特征的对象集
     */
    bkm.util.removeByObjectsWithKeys = function (_array, targetArray) {
        for (var i = targetArray.length - 1; i >= 0; i--) {
            bkm.util.removeByObjectWithKeys(_array, targetArray[i]);
        }
    }


    /**
     * 从对象集合中删除指定对象
     *
     */
    bkm.util.removeByObject = function (_array, obj) {
        for (var i = 0; i < _array.length; i++) {
            if (bkm.util.isObjectsEqual(_array[i], obj)) {
                _array.splice(i, 1);
                break;
            }
        }
    };

    /*
     * JS 产生一个新的GUID随机数
     */
    bkm.util.newGuid = function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    };

    /*
     * 格式化字符串
     */
    bkm.util.format = function (str, args) {
        var result = str;
        if (arguments.length > 0) {
            if (arguments.length == 2 && typeof (args) == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                        var reg = new RegExp("({)" + (i - 1) + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    /*
     * 判断是否为字符串
     */
    bkm.util.isString = function (value) {
        return typeof value === 'string';
    };

    /*
     * 判断是否为数组
     */
    bkm.util.isArray = function (value) {
        return value instanceof Array && value.constructor == Array;
    };

    /*
     * 判断是否为对象
     */
    bkm.util.isObject = function (value) {
        return value instanceof Object && value.constructor == Object;
    };
    
    /*
     * 限制文本框只能输入整数
     */
    bkm.util.limit = function (input) {
        if (input instanceof jQuery) {
            input = input[0];
        }
        if (input.value.length == 1) {
            input.value = input.value.replace(/[^1-9]/g, '');
        } else {
            input.value = input.value.replace(/\D/g, '');
        }
    };

    /*
     * 检测只能输入小数
     */
    bkm.util.number = function (input) {
        if (input instanceof jQuery) {
            input = input[0];
        }

        if (input.value != '') {
            input.value = input.value.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
            input.value = input.value.replace(/^\./g, ''); //验证第一个字符是数字而不是.
            input.value = input.value.replace(/^0{2,}\./g, '0.'); //只保留小数点前第一个0. 清除多余的0
            input.value = input.value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的.
            input.value = input.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        }
    };

    /*
     * 从指定的数组集合中找到字符串或数组子集合中是否存在
     */
    bkm.util.contains = function (data, elems, separator) {
        if (!data || !elems) return false;
        var array = bkm.util.toArray(elems, separator);
        for (var i in array) {
            if (jQuery.inArray(array[i], data) > -1) {
                return true;
            }
        }

        return false;
    };

    /*
     * 判断对象数组中是否包含指定属性的对象
     */
    bkm.util.containsObject = function (data, elem, prop) {
        if (!data || !data.length || !elem || !elem[prop]) return false;
        for (var index in data) {
            if (data[index][prop] == elem[prop]) {
                return true;
            }
        }
        return false;
    };

    /*
     * 判断对象数组中是否包含指定属性的对象
     */
    bkm.util.containsElement = function (data, elem) {
        return bkm.util.toArray(data).indexOf(elem) > -1;
    };

    /*
     * 将指定元素转化为数组
     */
    bkm.util.toArray = function (data, separator) {
        var result = [];
        if (typeof data == 'string') {
            separator = separator || ',';
            var array = data.split(separator);
            if (array.length > 1) {
                result = array;
            } else {
                result.push(data);
            }
        }
        if (data instanceof Array) {
            result = data;
        }
        return result;
    };

    /*
     * 判断元素是否存在属性
     */
    bkm.util.hasAttr = function (elem, attrName) {
        return typeof elem.attr(attrName) != 'undefined';
    };

    /*
     * 判断元素是否存在属性
     */
    bkm.util.hasAttrs = function (elem, attrNames) {
        var attrs = bkm.util.toArray(attrNames);
        for (var index in attrs) {
            if (bkm.util.hasAttr(elem, attrs[index])) {
                return true;
            }
        }
        return false;
    };

    /*
     * 将字符串转化为bool类型, isIgnoreZero为解决单选框存在有0的选项
     */
    bkm.util.bool = function (str, isIgnoreZero) {
        isIgnoreZero = isIgnoreZero || false;
        if (typeof str === 'boolean') return str;
        str += '';
        if (isIgnoreZero && str == '0') return true;
        if (!str || !str.length) return false;
        str = str.toLowerCase();
        if (str === 'false' || str === '0' || str === 'undefined' || str === 'null') return false;
        return true;
    };

    /*
     * 对象复制
     */
    bkm.util.clone = function (obj) {
        if (typeof (obj) != 'object') return obj;
        if (obj == null) return obj;
        var newObject = new Object();
        for (var i in obj)
            newObject[i] = bkm.util.clone(obj[i]);
        return newObject;
    };

    /*
     * 从对象数组中查找某属性值对应的索引
     */
    bkm.util.indexOf = function (data, key, value) {
        if (!data || !data.length) return -1;
        for (var index in data) {
            if (!data[index][key]) return -1;
            if (data[index][key] == value) {
                return index;
            }
        }
        return -1;
    };

    /*
     * 从指定的数组集合中找到字符串或数组子集合中是否存在
     */
    bkm.util.contains = function (data, elems, separator) {
        if (!data || !elems) return false;
        var array = bkm.util.toArray(elems, separator);
        for (var j in array) {
            if (jQuery.inArray(array[j], data)) {
                return true;
            }
        }
        return false;
    };

    /*
     * 将指定元素转化为数组
     */
    bkm.util.toArray = function (data, separator) {
        var result = [];
        if (typeof data == 'string') {
            separator = separator || ',';
            var array = data.split(separator);
            if (array.length > 1) {
                result = array;
            } else {
                result.push(data);
            }
        }
        if (data instanceof Array) {
            result = data;
        }
        return result;
    };

    /*
     * 全部选中
     */
    bkm.util.selectAll = function (data) {
        var selectedResult = [];
        angular.forEach(data, function (item) {
            selectedResult.push(item.key);
        });
        return selectedResult;
    };

    /*
     * 全部不选中
     */
    bkm.util.unSelectAll = function () {
        return [];
    };

    /*
     * 反选
     */
    bkm.util.inverseSelect = function (data, selectedResult) {
        var temp = selectedResult;
        selectedResult = [];
        angular.forEach(data, function (item) {
            if (temp.indexOf(item.key) == -1) {
                selectedResult.push(item.key);
            }
        });
        return selectedResult;
    };

    /*
     * 构建级联数据源
     * data 原数据源{key,value,parentkey},
     * result 构建后的新数据源{key:{value,children:[]}}
     */
    bkm.util.buildCascadeDataSource = function (data, result) {
        for (var index in data) {
            var source = data[index];
            if (source.parentKey == 0) {
                var parent = result[source.key];
                if (!parent) {
                    result[source.key] = {
                        value: source.value,
                        children: []
                    };
                } else {
                    parent.value = source.value;
                }
            } else {
                var parent = result[source.parentKey];
                if (!parent) {
                    result[source.parentKey] = {
                        value: '',
                        children: [source]
                    };
                } else {
                    result[source.parentKey].children.push(source);
                }
            }
        }
    };

    /*
     * 设置当前的操作项(checkbox)
     */
    bkm.util.setSelectedItems = function (selected, item, event) {
        var index = selected.indexOf(item.key);
        if (event.target.checked) {
            if (index === -1) {
                selected.push(item.key);
            }
        } else {
            if (index !== -1) {
                selected.splice(index, 1);
            }
        }
    };

    /*
     * 设置默认选中
     */
    bkm.util.setDefaultSelected = function (items, key) {
        if (!items || !items.length) return;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            item.checked = item.key == key;
        }
    };

    /*
     * 获取字典项的值
     */
    bkm.util.getDictName = function (items, key) {
        if (key == undefined) return '';
        if (!items || !items.length) return key;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item.key == key) {
                return item.name;
            }
        }
        return key;
    };
    /*
     * 获取字典项的Key
     */
    bkm.util.getDictKey = function (items, name) {
        if (name == undefined) return '';
        if (!items || !items.length) return name;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item.name == name) {
                return item.key;
            }
        }
        return name;
    };

    bkm.util.loadDependencies = function (dependencies) {
        return {
            resolver: ['$q', '$rootScope', function ($q, $rootScope) {
                var defered = $q.defer();

                require(dependencies, function () {
                    $rootScope.$apply(function () {
                        defered.resolve();
                    });
                });

                return defered.promise;
            }]
        };
    };

    /*
     * 获取URL中的Querystring参数
     */
    bkm.util.params = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    /*
    *  格式化字符串首字母大写
    */
    bkm.util.firstCap = function (str) {
        if (!str) return str;
        str = str.toString().toLowerCase();
        str = str.replace(/\b\w+\b/g, function (word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        });
        return str;
    }

    /*
    *  省市区地址拆分
    */
    bkm.util.address_out = function (input, type, index) {

        var result = {};

        if (!input) return;

        for (var x in input) {
            if (typeof (input[x]) == 'object') {
                angular.extend(result, bkm.util.address_out(input[x], type, x));
            } else if (index) {
                if (type) {
                    result[type + bkm.util.firstCap(index) + bkm.util.firstCap(x)] = input[x];
                }
                else {
                    result[index + bkm.util.firstCap(x)] = input[x];
                }
            }
        }

        return result;
    };

    bkm.util.address_in = function (input, type) {

        var result = { province: {}, city: {}, district: {} };
        var strReg;

        if (!input) return;
        if (!!type) {
            strReg = "(\\b" + type + ")(province|city|district|address)(id|name$)";
        }
        else {
            strReg = "(\\b)(province|city|district|address)(id|name$)";
        }
        var reg = new RegExp(strReg, "i");
        for (var x in input) {
            if (x.match(reg)) {
                var x1=x.toString().toLowerCase();
                result[x1.match(reg)[2]][x1.match(/id|name$/i)] = input[x];
            }
        }

        return result;
    };

  

    /* 
     * 将输入对象的日期字符串处理为日期对象并返回到输出对象模型中
     */
    bkm.util.converStr2Date = function (outObj, inObj, cascadPropName) {

        if (!outObj || !inObj || (typeof cascadPropName != "string")) return;

        var rtnArr = cascadPropName.split(".");

        if (rtnArr.length == 0) {
            outObj[cascadPropName] = new Date(inObj[cascadPropName]);
            return;
        }

        for (var i = 0; i < rtnArr.length-1; i++) {
            if (!inObj[rtnArr[i]]) return;
            inObj = inObj[rtnArr[i]];
            outObj = outObj[rtnArr[i]] || {};
        }
        if (!!inObj[rtnArr[i]]) {
            outObj[rtnArr[i]] = new Date(inObj[rtnArr[i]]);
        }
        
    };



    return bkm.util;
})();

(function () {
    /** * 获取本周、本季度、本月、上月的开端日期、停止日期 */
    //当前日期 
    var now = new Date();
    //今天本周的第几天 
    var nowDayOfWeek = now.getDay();
    //当前日 
    var nowDay = now.getDate();
    //当前月
    var nowMonth = now.getMonth();
    //当前年
    var nowYear = now.getYear();
    nowYear += (nowYear < 2000) ? 1900 : 0;
    //上月日期
    var lastMonthDate = new Date();
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    //上年
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();
    //格局化日期：yyyy-MM-dd 
    bkm.date.format = function (date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        } if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    //比较两个时间的大小
    bkm.date.compare = function (beginTime, endTime) {
        //将字符串转换为日期
        var begin = new Date(beginTime.replace(/-/g, "/"));
        var end = new Date(endTime.replace(/-/g, "/"));
        return begin <= end;
    };
    //获得某月的天数 
    bkm.date.getMonthDays = function (month) {
        var monthStartDate = new Date(nowYear, month, 1);
        var monthEndDate = new Date(nowYear, month + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    //获得本季度的开端月份 
    bkm.date.getQuarterStartMonth = function () {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        } if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        } if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        } if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    // 获取今天
    bkm.date.today = function (input, isBegin,isCurrent) {
        var offset = input || 0;
        var todayDate = new Date(
            nowYear,
            nowMonth,
            nowDay + offset,
            isBegin ? 0 : 23,
            isBegin ? 0 : 59,
            isBegin ? 0 : 59,
            isBegin ? 0 : 999
            );
        return isCurrent?now:todayDate;
    };
    //获得本周的开始日期 
    bkm.date.getWeekStartDate = function () {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return bkm.date.format(weekStartDate);
    }
    //获得本周的停止日期 
    bkm.date.getWeekEndDate = function () {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        //return bkm.date.format(weekEndDate);
        return weekEndDate;
    }
    //获得本月的开始日期 
    bkm.date.getMonthStartDate = function () {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return bkm.date.format(monthStartDate);
    }
    //获得本月的停止日期 
    bkm.date.getMonthEndDate = function () {
        var monthEndDate = new Date(nowYear, nowMonth, bkm.date.getMonthDays(nowMonth));
        return bkm.date.format(monthEndDate);
    }
    //获得上月开始日期 
    bkm.date.getLastMonthStartDate = function () {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return bkm.date.format(lastMonthStartDate);
    }
    //获得上月停止日期 
    bkm.date.getLastMonthEndDate = function () {
        var lastMonthEndDate = new Date(nowYear, lastMonth, bkm.date.getMonthDays(lastMonth));
        return bkm.date.format(lastMonthEndDate);
    }
    //获得本季度的开始日期 
    bkm.date.getQuarterStartDate = function () {
        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
        return bkm.date.format(quarterStartDate);
    }
    //获得本季度的停止日期 
    bkm.date.getQuarterEndDate = function () {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(nowYear, quarterEndMonth, bkm.date.getMonthDays(quarterEndMonth));
        return bkm.date.format(quarterStartDate);
    }

    return bkm.date;
})();

bkm.browser = function () {
    var _browser = {};
    var sUserAgent = navigator.userAgent;

    var isOpera = sUserAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //首先检测Opera是否进行了伪装
        if (navigator.appName == 'Opera') {
            //如果没有进行伪装，则直接后去版本号
            _browser.version = parseFloat(navigator.appVersion);
        } else {
            var reOperaVersion = new RegExp("Opera (\\d+.\\d+)");
            //使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
            reOperaVersion.test(sUserAgent);
            _browser.version = parseFloat(RegExp['$1']);
        }
        _browser.opera = true;
    }

    var isChrome = sUserAgent.indexOf("Chrome") > -1;
    if (isChrome) {
        if (sUserAgent.indexOf("Edge") > -1) {
            var reEdge = new RegExp("Edge/(\\d+\\.\\d+)");
            reEdge.test(sUserAgent);
            _browser.version = parseFloat(RegExp['$1']);
            _browser.edge = true;
        } else {
            var reChorme = new RegExp("Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?");
            reChorme.test(sUserAgent);
            _browser.version = parseFloat(RegExp['$1']);
            _browser.chrome = true;
        }
    }

    //排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
    var isKHTML = (sUserAgent.indexOf("KHTML") > -1
            || sUserAgent.indexOf("Konqueror") > -1 || sUserAgent
            .indexOf("AppleWebKit") > -1)
            && !isChrome;

    if (isKHTML) {//判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
        var isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
        var isKonq = sUserAgent.indexOf("Konqueror") > -1;

        if (isSafari) {
            var reAppleWebKit = new RegExp("Version/(\\d+(?:\\.\\d*)?)");
            reAppleWebKit.test(sUserAgent);
            var fAppleWebKitVersion = parseFloat(RegExp["$1"]);
            _browser.version = parseFloat(RegExp['$1']);
            _browser.safari = true;
        } else if (isKonq) {
            var reKong = new RegExp(
                   "Konqueror/(\\d+(?:\\.\\d+(?\\.\\d)?)?)");
            reKong.test(sUserAgent);
            _browser.version = parseFloat(RegExp['$1']);
            _browser.konqueror = true;
        }
    }

    // !isOpera 避免是由Opera伪装成的IE  
    var isIE = sUserAgent.indexOf("compatible") > -1
           && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
    if (isIE || _browser.edge) { //将edge当做ie作为处理，但也可以单独判断为edge
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(sUserAgent);
        _browser.version = parseFloat(RegExp['$1']);
        _browser.msie = true;
    }

    // 排除Chrome 及 Konqueror/Safari 的伪装
    var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isChrome && !isKHTML;
    if (isMoz) {
        var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
        reMoz.test(sUserAgent);
        _browser.version = parseFloat(RegExp['$1']);
        if (_browser.version == 11) {
            _browser.msie = true; //fix the IE11
        }
        _browser.mozilla = true;
    }

    return {
        s: _browser
    };
}();