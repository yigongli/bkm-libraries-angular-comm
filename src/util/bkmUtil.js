﻿var bkm = bkm || {};

(function () {
    'use strict';

    bkm.util = bkm.util || {};
    bkm.date = bkm.date || {};

    return bkm;
})();

(function () {
    'use strict';

    /** 
     *  Define a readonly object from normal input
     * @param {Object} input - input object
     * @returns {Object} a new readonly object
     * 
    */
    bkm.util.readonlyObject = function (input) {
        if (!angular.isObject(input)) {
            return null;
        }
        var objectProxy = new Proxy(input, {
            get: (obj, prop) => {
                if (prop in obj) {
                    return obj[prop];
                } else {
                    console.log(bkm.util.format('The property {0}  is not existed!!', prop));
                }
            },
            set: function (obj, prop, value) {
                console.log(bkm.util.format('You can not set the readonly object property {0} value!', prop));
            }
        });
        return objectProxy;
    }

    /** 
     * Define a object property as readonly with input
     * @param {Object} obj - Input object
     * @param {string} prop - The object property name
     * 
    */
    bkm.util.readonlyProp = function (obj, prop) {
        if (!angular.isObject(obj) || obj[prop] === undefined) {
            return;
        }
        var propValue = obj[prop];
        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: false,
            get: () => propValue,
            set: newValue => console.log(bkm.util.format('You can not set the object readonly property {0} value to {1}!', prop, newValue))
        });
    }



    /*
     * 两个对象判等
     */
    bkm.util.isObjectsEqual = function (a, b) {
        if (typeof a != 'object' || typeof b != 'object') {
            return false;
        }
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
    };


    /*
     * 删除对象集合中具有指定特征的对象集
     */
    bkm.util.removeByObjectsWithKeys = function (_array, targetArray) {
        for (var i = targetArray.length - 1; i >= 0; i--) {
            bkm.util.removeByObjectWithKeys(_array, targetArray[i]);
        }
    };


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

    // 比例和整数字段之间的转换显示
    bkm.util.objectPercentPropertyDef = function (inputModel, dispProp, dataProp, factor) {
        var base = factor || 100;
        if ((typeof inputModel != 'object') || (typeof dispProp != 'string') || (typeof dataProp != 'string')) return;
        Object.defineProperty(inputModel, dispProp, {
            get: function () {
                if (inputModel && inputModel[dataProp] != null) {
                    return bkm.util.round(Math.round(inputModel[dataProp] * base * base) / base, 5);
                } else {
                    return null;
                }
            },
            set: function (newValue) {
                if (inputModel[dataProp] == (newValue == null ? null : newValue / base)) return;
                if (newValue == null) {
                    inputModel[dispProp] = inputModel[dataProp] = null;
                } else {
                    inputModel[dataProp] = bkm.util.round(newValue / base, 5);
                    inputModel[dispProp] = Math.round(inputModel[dataProp] * base * base) / base;
                }

            },
            enumerable: true,
            configurable: true
        });
    };

    /**
         * 比例和重量的数据模型转换
         *
         * @param {*} inputModel -- 输入对象
         * @param {*} percentModel -- 比例模型属性名称
         * @param {*} weightModel -- 数量模型属性名称
         * @param {*} categoryModel -- 类型模型属性名称
         * @param {*} percentEnumValue -- 类型等于比例时的常量值
         * @param {*} percentBase -- 比例的基底
         */
    bkm.util.percentTransferObjectPropertyDef = function (inputModel, percentModel, weightModel, categoryModel, percentEnumValue, percentBase) {
        percentBase = percentBase || 100;
        Object.defineProperty(inputModel, percentModel, {
            get: function () {
                if (inputModel[weightModel] != null) {
                    if (inputModel[categoryModel] === percentEnumValue) { //按比例
                        return inputModel[weightModel] * percentBase;
                    } else {
                        return inputModel[weightModel];
                    }
                }
                return null;
            },
            set: function (newValue) {
                if (inputModel[categoryModel] == percentEnumValue && newValue != null) {
                    inputModel[weightModel] = newValue / percentBase;
                } else {
                    inputModel[weightModel] = newValue;
                }
            },
            enumerable: true,
            configurable: true
        });
    }

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
    bkm.util.limit = function (input, limitType) {
        var type = limitType || "number";
        if (typeof input == "string") {
            switch (type) {
                case 'number':
                    return input.replace(/\D/g, '');
                default:
                    return input;
            }
        } else {
            return input;
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
     * 判断对象数组中是否存在指定属性的重复对象, 返回所有发现的重复数据二维结果集
     */
    bkm.util.findDuplicatedElements = function (data, prop) {
        if (typeof data != 'object' || !data.length || !prop) {
            return [];
        }
        //判断是否存在该属性
        if (!(prop in data[0])) {
            return [];
        }
        var duplicatedObjects = [];
        var props = data.map(item => item[prop]);
        props.forEach((item, index) => {
            var foundIndex = props.indexOf(item, index + 1);
            if (foundIndex > 0) {
                try {
                    var isFound = false;
                    duplicatedObjects.forEach(elem => {
                        if (elem[0].data[prop] == data[index][prop]) {
                            elem.push({
                                data: data[foundIndex],
                                pos: foundIndex
                            });
                            isFound = true;
                            throw new Error("End");
                        }
                    });
                    if (!isFound) {
                        duplicatedObjects.push([{
                            data: data[index],
                            pos: index
                        }, {
                            data: data[foundIndex],
                            pos: foundIndex
                        }]);
                    }
                } catch (e) {
                    if (e.message != 'End') throw e;
                }
            }
        });
        return duplicatedObjects;
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
     * 对象扩展
     */
    bkm.util.extend = function (target, source) {
        if (!bkm.util.isObject(target) || !bkm.util.isObject(source)) {
            return null;
        }
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };

    /*
     * 从对象数组中查找某属性值对应的索引
     */
    bkm.util.indexOf = function (data, key, value) {
        if (!data || !data.length) return -1;
        for (var index in data) {
            if (!data[index][key]) return -1;
            if (data[index][key] == value) {
                return parseInt(index);
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
        var searchReg = RegExp(/\?.*/g);
        var search = window.location.href.match(searchReg);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        if (!search || search.length == 0) return null;
        var r = search[0].substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    /*
     *  格式化字符串首字母大写
     */
    bkm.util.firstCap = function (str, isLowerCase) {
        if (!str) return str;
        str = isLowerCase ? str.toString().toLowerCase() : str;
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
                bkm.util.extend(result, bkm.util.address_out(input[x], type, x));
            } else if (index) {
                if (type) {
                    result[type + bkm.util.firstCap(index) + bkm.util.firstCap(x)] = input[x];
                } else {
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
        } else {
            strReg = "(\\b)(province|city|district|address)(id|name$)";
        }
        var reg = new RegExp(strReg, "i");
        for (var x in input) {
            if (x.match(reg)) {
                var x1 = x.toString().toLowerCase();
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

        for (var i = 0; i < rtnArr.length - 1; i++) {
            if (!inObj[rtnArr[i]]) return;
            inObj = inObj[rtnArr[i]];
            outObj = outObj[rtnArr[i]] || {};
        }
        if (!!inObj[rtnArr[i]]) {
            outObj[rtnArr[i]] = new Date(inObj[rtnArr[i]]);
        }

    };

    /* 
     * 将输入的数字类型的值做四舍五入处理
     */
    bkm.util.round = function (numValue, n) {
        if (isNaN(numValue)) {
            return numValue;
        }
        var power = n != null && !isNaN(n) ? n : 2;
        var result = Number(Math.round(numValue + 'e' + power) + 'e-' + power);
        return result;
    };

    /* 
     * 将输入的数字类型的值保留小数位数
     * withCarry -- 是否四舍五入
     */
    bkm.util.decimal = function (numValue, n, withCarry) {
        if (isNaN(numValue)) {
            return numValue;
        }
        let result = null;
        let power = n != null && !isNaN(n) ? n : 2;
        if (withCarry) {
            if (power <= 0) return Math.round(numValue);
            result = Math.round(numValue * Math.pow(10, n)) / Math.pow(10, n);
        } else {
            result = Number(Math.floor(numValue + 'e' + power) + 'e-' + power);
        }
        return result;
    };

    /**
     * 去除字符串空格
     */
    bkm.util.trim = function (str, option) {
        var opt = option || 'both',
            result = angular.isNumber(str) ? str.toString() : str || '';
        switch (opt) {
            case 'all':
                return result.replace(/\s*/g, "");
            case 'left':
                return result.replace(/^\s*/, "");
            case 'right':
                return result.replace(/(\s*$)/g, "");
            case 'both':
                return result.replace(/^\s*|\s*$/g, "");
            default:
                return str;
        }
    };
    return bkm.util;
})();

(function () {
    /** * 获取本周、本季度、本月、上月的开端日期、停止日期 */

    //上月日期
    var lastMonthDate = new Date();
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastMonth = lastMonthDate.getMonth();

    // 获取当前年
    function getNowYear() {
        //当前日期 
        var now = new Date();
        //当前年
        var nowYear = now.getYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;
        return nowYear;
    }

    //格局化日期：yyyy-MM-dd 
    bkm.date.format = function (date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    };
    //比较两个时间的大小
    bkm.date.compare = function (beginTime, endTime) {
        //将字符串转换为日期
        var begin = new Date(beginTime);
        var end = new Date(endTime);
        return begin <= end;
    };
    //获得某月的天数 
    bkm.date.getMonthDays = function (month) {
        var monthStartDate = new Date(getNowYear(), month, 1);
        var monthEndDate = new Date(getNowYear(), month + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    };
    //获得本季度的开端月份 
    bkm.date.getQuarterStartMonth = function () {
        var quarterStartMonth = 0;
        //当前日期 
        var now = new Date();
        //当前月
        var nowMonth = now.getMonth();
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    };
    // 获取今天
    bkm.date.today = function (input, isBegin, isCurrent) {
        var offset = input || 0;
        //当前日期 
        var now = new Date();
        //当前日 
        var nowDay = now.getDate();
        //当前月
        var nowMonth = now.getMonth();
        var todayDate = new Date(
            getNowYear(),
            nowMonth,
            nowDay + offset,
            isBegin ? 0 : 23,
            isBegin ? 0 : 59,
            isBegin ? 0 : 59,
            isBegin ? 0 : 999
        );
        return isCurrent ? now : todayDate;
    };
    //获得本周的开始日期 
    bkm.date.getWeekStartDate = function () {
        //当前日期 
        var now = new Date();
        //今天本周的第几天 
        var nowDayOfWeek = now.getDay();
        //当前日 
        var nowDay = now.getDate();
        //当前月
        var nowMonth = now.getMonth();
        var weekStartDate = new Date(getNowYear(), nowMonth, nowDay - nowDayOfWeek);
        return weekStartDate;
    };
    //获得本周的停止日期 
    bkm.date.getWeekEndDate = function () {
        //当前日期 
        var now = new Date();
        //今天本周的第几天 
        var nowDayOfWeek = now.getDay();
        //当前日 
        var nowDay = now.getDate();
        //当前月
        var nowMonth = now.getMonth();
        var weekEndDate = new Date(getNowYear(), nowMonth, nowDay + (6 - nowDayOfWeek));
        return weekEndDate;
    };
    //获得本月的开始日期 
    bkm.date.getMonthStartDate = function () {
        //当前日期 
        var now = new Date();
        //当前月
        var nowMonth = now.getMonth();
        var monthStartDate = new Date(getNowYear(), nowMonth, 1);
        return monthStartDate;
    };
    //获得本月的停止日期 
    bkm.date.getMonthEndDate = function () {
        //当前日期 
        var now = new Date();
        //当前月
        var nowMonth = now.getMonth();
        var monthEndDate = new Date(getNowYear(), nowMonth, bkm.date.getMonthDays(nowMonth));
        return monthEndDate;
    };
    //获得上月开始日期 
    bkm.date.getLastMonthStartDate = function () {
        var lastMonthStartDate = new Date(getNowYear(), lastMonth, 1);
        return lastMonthStartDate;
    };
    //获得上月停止日期 
    bkm.date.getLastMonthEndDate = function () {
        var lastMonthEndDate = new Date(getNowYear(), lastMonth, bkm.date.getMonthDays(lastMonth));
        return lastMonthEndDate;
    };
    //获得本季度的开始日期 
    bkm.date.getQuarterStartDate = function () {
        var quarterStartDate = new Date(getNowYear(), getQuarterStartMonth(), 1);
        return quarterStartDate;
    };
    //获得本季度的停止日期 
    bkm.date.getQuarterEndDate = function () {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(getNowYear(), quarterEndMonth, bkm.date.getMonthDays(quarterEndMonth));
        return quarterStartDate;
    };
    // 比较时间相差天数
    bkm.date.diffDays = function (beginDay, endDay) {
        if (beginDay instanceof Date && endDay instanceof Date) {
            return (endDay.getTime() - beginDay.getTime()) / (1000 * 60 * 60 * 24);
        } else {
            return null;
        }
    };
    // 比较时间相差小时
    bkm.date.diffHours = function (beginDay, endDay) {
        if (beginDay instanceof Date && endDay instanceof Date) {
            return (endDay.getTime() - beginDay.getTime()) / (1000 * 60 * 60);
        } else {
            return null;
        }
    };

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
        var mimeObj = navigator.mimeTypes['application/x-shockwave-flash'];
        if (mimeObj) {
            var desp = mimeObj.description || '';
            _browser.chrome360 = desp.toLowerCase().indexOf('adobe') > -1;
            _browser.chrome = !_browser.chrome360;
        } else if (sUserAgent.indexOf("Edge") > -1) {
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
    var isKHTML = (sUserAgent.indexOf("KHTML") > -1 ||
        sUserAgent.indexOf("Konqueror") > -1 || sUserAgent
            .indexOf("AppleWebKit") > -1) &&
        !isChrome;

    if (isKHTML) { //判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
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
    var isIE = sUserAgent.indexOf("compatible") > -1 &&
        sUserAgent.indexOf("MSIE") > -1 && !isOpera;
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

// 判断操作系统
bkm.os = (function () {
    var UserAgent = navigator.userAgent.toLowerCase();
    return {
        isIpad: /ipad/.test(UserAgent),
        isIphone: /iphone os/.test(UserAgent),
        isAndroid: /android/.test(UserAgent),
        isWindowsCe: /windows ce/.test(UserAgent),
        isWindowsMobile: /windows mobile/.test(UserAgent),
        isWin2K: /windows nt 5.0/.test(UserAgent),
        isXP: /windows nt 5.1/.test(UserAgent),
        isVista: /windows nt 6.0/.test(UserAgent),
        isWin7: /windows nt 6.1/.test(UserAgent),
        isWin8: /windows nt 6.2/.test(UserAgent),
        isWin81: /windows nt 6.3/.test(UserAgent),
        isMac: /mac os/.test(UserAgent)
    };
}());