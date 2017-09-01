/**
 * Created by gurihui on 2017/3/9.
 */
(function() {
    'use strict';

    angular.module('bkm.library.angular.comm')
        .service('bkmFileUpload', ['$http', '$q', bkmFileUpload]);

    /** @ngInject */
    function bkmFileUpload($http, $q) {
        var self = this,
            apiUrl = "/web/api/file/upload";

        /**
         * @Description 文件上传
         * @param
         * files
         *      数组对象，可以是 <input type="file" />数组
         *      也可以是 {name:'表单提交时的自定义名称',base64url:'',filePath:'文件在客户端的路径'}
         * @param
         * imgInfo:(可选，如果为true则按默认规则处理,如果没有或false则不处理)
         *      图片处理参数
         *      {
         *          maxSize:200(单位kb),
         *          maxWidth:800(单位px),
         *          maxHeigth:1000(单位px)
         *      }
         *      图片截剪为正比压缩
         */

        /**
         * 将 Image 对象转 base64 编码
         */
        function getBase64Image(img) {
            try {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var dataURL = canvas.toDataURL("image/png");
                return dataURL; // return dataURL.replace("data:image/png;base64,", "");
            } catch (e) {
                console.log(JSON.stringify(e));
                return null;
            }
        }

        // 图片压缩处理
        self.imgCompress = function(uploadFile, option, target) {
            var deferred = $q.defer();
            var opt = {
                before: function(file) {
                    //开始压缩
                    if (!file.type.match(/^image/)) {
                        return false;
                    }
                },
                done: function(file, base64) {
                    //压缩成功
                    deferred.resolve({ file: file, base64: base64, success: true, isSupport: true, target: target });
                },
                fail: function(file) {
                    //压缩失败
                    deferred.reject({ file: file, success: false, isSupport: true, target: target });
                },
                complete: function(file) {
                    //console.log('单张: 压缩完成...');
                },
                notSupport: function(file) {
                    //alert('浏览器不支持！');
                    deferred.reject({ file: file, success: false, isSupport: false, target: target });
                }
            };
            if (!!option) {
                angular.extend(opt, option);
            }
            new html5ImgCompress(uploadFile, opt);
            return deferred.promise;
        }

        // 图片上传
        self.upload = function(files, imgInfo, isWeixin) {
            var _files = [],
                _imgInfo,
                deferreds = [],
                promises = [],
                // android 4.4 兼容，不能用 FormData，自己实现了FormDataShim
                fd = needsFormDataShim ? new FormDataShim() : new FormData(),
                deferred = $q.defer(),
                // maxLength 最大上传值,单位 KB
                maxLength = 20480;

            if (angular.isArray(files)) {
                _files = files;
            } else {
                _files.push(files);
            }

            //imgInfo:如果为true则按默认规则处理,如果没有或false则不处理
            if (!!imgInfo) {
                _imgInfo = imgInfo;
            }

            if (_imgInfo === true) {
                _imgInfo = {
                    //maxSize: 200,
                    maxWidth: 800,
                    maxHeight: 1000,
                    quality: 70
                };
            }

            if (angular.isArray(_imgInfo.type)) {
                // 验证文件上传的类型,根据文件扩展名验证,如果没有配置该项设置,默认为上传图片
                var i = 0,
                    len = _files.length;
                for (i; i < len; i++) {
                    if (!validMaxLength(_files[i])) {
                        return $q.reject({ message: _files[i].name + ' 超过最大上传值 ' + maxLength });
                    }
                    if (_files[i].constructor.name.toLowerCase() == "file" &&
                        _imgInfo.type.indexOf(_files[i].name.split('.').pop().toLowerCase()) < 0) {
                        return $q.reject({ message: '只能上传 ' + _imgInfo.type.join(',') + ' 类型的文件' });
                    }
                }
            } else {
                var i = 0,
                    len = _files.length,
                    types = ['jpg', 'jpeg', 'png'];
                for (i; i < len; i++) {
                    // 因为上传的图片都会先进压缩再上传，因此这里不验证【超过最大上传值】
                    // if (!validMaxLength(_files[i])) {
                    //     return $q.reject({ message: _files[i].name + ' 超过最大上传值 ' + maxLength });
                    // }
                    if (_files[i].constructor.name.toLowerCase() == "file" &&
                        types.indexOf(_files[i].name.split('.').pop().toLowerCase()) < 0) {
                        return $q.reject({ message: '只能上传 ' + types.join(',') + ' 类型的文件' });
                    }
                }
            }

            /**
             * 验证文件是否超出最大上传值
             * @param file
             */
            function validMaxLength(file) {
                // 最大上传 20 MB
                if (angular.isNumber(_imgInfo.maxLengh)) {
                    maxLength = _imgInfo.maxLengh;
                }

                return (file.constructor.name.toLowerCase() == 'file' && (file.size / 1024) < maxLength);
            }

            angular.forEach(_files, function(v, i) {
                if (v.constructor.name.toLowerCase() == "file") {
                    var f = v;
                    if (f.type.match(/^image/) && !!_imgInfo) {
                        deferreds.push($q.defer());
                        //图片压缩处理
                        self.imgCompress(
                            f,
                            imgInfo,
                            deferreds.length - 1
                        ).then(function(result) {
                            fd.append(f.name, dataURLtoBlob(result.base64).blob, result.file.name);
                            deferreds[result.target].resolve();
                        }, function(result) {
                            fd.append(f.name, f);
                            deferreds[result.target].resolve();
                        });
                    } else {
                        fd.append(f.name, f);
                        deferreds.push($q.resolve());
                    }
                } else if (angular.isElement(v)) {
                    angular.forEach(v.files, function(f, fi) {
                        var name = angular.element(v).attr("id") || "file";
                        if (f.type.match(/^image/) && !!_imgInfo) {
                            deferreds.push($q.defer());
                            //图片压缩处理
                            self.imgCompress(
                                f,
                                imgInfo,
                                deferreds.length - 1
                            ).then(function(result) {
                                fd.append(f.name, dataURLtoBlob(result.base64).blob, result.file.name);
                                deferreds[result.target].resolve();
                            }, function(result) {
                                fd.append(f.name, f);
                                deferreds[result.target].resolve();
                            });
                        } else {
                            fd.append(f.name, f);
                            deferreds.push($q.resolve());
                        }
                    });
                } else if (v.base64url.match(/^data:image\/(jgp|jpg|jpeg|png);base64,/)) {
                    var t = dataURLtoBlob(v.base64url);
                    appendBase64ToFormData(deferreds, v, t, !!_imgInfo);
                } else if (isIos() && isWeixin) {
                    var localData = "data:image/jpeg;base64," + v.base64url;
                    var t = dataURLtoBlob(localData);
                    appendBase64ToFormData(deferreds, v, t, !!_imgInfo);
                } else if (isWeixin && !!window.wx && !!wx.getLocalImgData) {
                    var defer = $q.defer();
                    deferreds.push(defer);
                    wx.getLocalImgData({
                        // 图片的localID
                        localId: v.base64url,
                        success: function(res) {
                            // localData是图片的base64数据，可以用img标签显示
                            var localData = "data:image/jpeg;base64," + res.localData;
                            var t = dataURLtoBlob(localData);
                            appendBase64ToFormData(deferreds, v, t, !!_imgInfo)
                                .then(function() {
                                    deferreds.push(defer.resolve());
                                });
                        }
                    });
                }
            });

            function isIos() {
                var u = navigator.userAgent;
                //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            }

            function appendBase64ToFormData(deferredArr, file, blob, isCompress) {
                if (isCompress) {
                    var deferred = $q.defer();
                    deferredArr.push(deferred);
                    try {
                        self.imgCompress(
                            new File([blob.u8Arr], file.filePath, { "type": blob.type }),
                            imgInfo,
                            deferredArr.length - 1
                        ).then(function(result) {
                            fd.append(file.name, dataURLtoBlob(result.base64), result.file.name);
                            deferredArr[result.target].resolve();
                        }, function(result) {
                            fd.append(file.name, blob, file.filePath);
                            deferredArr[result.target].resolve();
                        });
                    } catch (e) {
                        fd.append(file.name, blob, file.filePath);
                        deferred.resolve();
                    }
                } else {
                    fd.append(file.name, blob, file.filePath);
                    deferredArr.push({ promise: $q.resolve() });
                }
                return deferredArr[deferredArr.length - 1].promise;
            }

            angular.forEach(deferreds, function(v) {
                if (!!v.promise) {
                    promises.push(v.promise);
                } else {
                    promises.push(v);
                }
            });

            $q.all(promises).then(function() {
                $http({
                    method: 'POST',
                    url: apiUrl,
                    data: fd,
                    headers: { 'Content-Type': undefined },
                    transformRequest: function(data, headers) {
                        return data;
                    }
                }).then(function(result) {
                    deferred.resolve(result);
                }, function(result) {
                    deferred.reject(result);
                });
            });
            return deferred.promise;
        };

        function newBlob(data, datatype) {
            var out;
            try {
                out = new Blob([data], { type: datatype });
            } catch (e) {
                window.BlobBuilder = window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;

                if (e.name == 'TypeError' && window.BlobBuilder) {
                    var bb = new BlobBuilder();
                    bb.append(data.buffer);
                    out = bb.getBlob(datatype);
                } else if (e.name == "InvalidStateError") {
                    out = new Blob([data], { type: datatype });
                } else {}
            }
            return out;
        }

        // 判断是否需要blobbuilder
        var needsFormDataShim =
            (function() {
                var bCheck = ~navigator.userAgent.indexOf('Android') &&
                    ~navigator.vendor.indexOf('Google') &&
                    !~navigator.userAgent.indexOf('Chrome');
                // android 4.4 兼容
                return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
            })(),
            blobConstruct = !!(function() {
                try {
                    return new Blob();
                } catch (e) {}
            })(),
            XBlob =
            blobConstruct ? window.Blob : function(parts, opts) {
                var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
                parts.forEach(function(p) {
                    bb.append(p);
                });

                return bb.getBlob(opts ? opts.type : undefined);
            };


        function FormDataShim() {
            // Store a reference to this
            var o = this,
                parts = [], // Data to be sent
                boundary = Array(5).join('-') + (+new Date() * (1e16 * Math.random())).toString(32),
                oldSend = XMLHttpRequest.prototype.send;

            this.append = function(name, value, filename) {
                parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');

                if (value instanceof Blob) {
                    parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                    parts.push(value);
                } else {
                    parts.push('\r\n\r\n' + value);
                }
                parts.push('\r\n');
            };

            // Override XHR send()
            XMLHttpRequest.prototype.send = function(val) {
                var fr,
                    data,
                    oXHR = this;

                if (val === o) {
                    //注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
                    parts.push('--' + boundary + '--\r\n');
                    data = new XBlob(parts);
                    fr = new FileReader();
                    fr.onload = function() {
                        oldSend.call(oXHR, fr.result);
                    };
                    fr.onerror = function(err) {
                        throw err;
                    };
                    fr.readAsArrayBuffer(data);

                    this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                    XMLHttpRequest.prototype.send = oldSend;
                } else {
                    oldSend.call(this, val);
                }
            };
        }

        //把图片转成formdata 可以使用的数据...
        //这里要把\s替换掉..要不然atob的时候会出错....
        function dataURLtoBlob(data) {
            var tmp = data.split(','),
                mimeString = data.split(',')[0].split(':')[1].split(';')[0];
            tmp[1] = tmp[1].replace(/\s/g, '');
            var binary = atob(tmp[1]),
                array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new newBlob(new Uint8Array(array), mimeString);
        }
    }
})();