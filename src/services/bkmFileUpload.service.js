/**
 * Created by gurihui on 2017/3/9.
 */
(function () {
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

        /**
         * 将 data:image;base64 转 Blob 对象
         */
        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab], { "type": mimeString });
            return { blob: bb, u8Arr: ia, type: mimeString };
        }

        self.imgCompress = function (uploadFile, option, target) {
            var deferred = $q.defer();
            var opt = {
                before: function (file) {
                    //开始压缩
                    if (!file.type.match(/^image/)) {
                        return false;
                    }
                },
                done: function (file, base64) {
                    //压缩成功
                    deferred.resolve({ file: file, base64: base64, success: true, isSupport: true, target: target });
                },
                fail: function (file) {
                    //压缩失败
                    deferred.reject({ file: file, success: false, isSupport: true, target: target });
                },
                complete: function (file) {
                    //console.log('单张: 压缩完成...');
                },
                notSupport: function (file) {
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

        self.upload = function (files, imgInfo, isWeixin) {
            var _files = [],
                _imgInfo,
                deferreds = [],
                promises = [],
                fd = new FormData(),
                deferred = $q.defer();

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

            angular.forEach(_files, function (v, i) {
                if (v.constructor.name.toLowerCase() == "file") {
                    var f = v;
                    if (f.type.match(/^image/) && !!_imgInfo) {
                        deferreds.push($q.defer());
                        //图片压缩处理
                        self.imgCompress(
                            f,
                            imgInfo,
                            deferreds.length - 1
                        ).then(function (result) {
                            fd.append(f.name, dataURItoBlob(result.base64).blob, result.file.name);
                            deferreds[result.target].resolve();
                        }, function (result) {
                            fd.append(f.name, f);
                            deferreds[result.target].resolve();
                        });
                    } else {
                        fd.append(f.name, f);
                        deferreds.push($q.resolve());
                    }
                } else if (angular.isElement(v)) {
                    angular.forEach(v.files, function (f, fi) {
                        var name = angular.element(v).attr("id") || "file";
                        if (f.type.match(/^image/) && !!_imgInfo) {
                            deferreds.push($q.defer());
                            //图片压缩处理
                            self.imgCompress(
                                f,
                                imgInfo,
                                deferreds.length - 1
                            ).then(function (result) {
                                fd.append(f.name, dataURItoBlob(result.base64).blob, result.file.name);
                                deferreds[result.target].resolve();
                            }, function (result) {
                                fd.append(f.name, f);
                                deferreds[result.target].resolve();
                            });
                        } else {
                            fd.append(f.name, f);
                            deferreds.push($q.resolve());
                        }
                    });
                } else if (v.base64url.match(/^data:image\/(jpg|jpeg|png);base64,/)) {
                    var t = dataURItoBlob(v.base64url);
                    appendBase64ToFormData(deferreds, v, t, !!_imgInfo);
                } else if (isIos() && isWeixin) {
                    var localData = "data:image/jpeg;base64," + v.base64url;
                    var t = dataURItoBlob(localData);
                    appendBase64ToFormData(deferreds, v, t, !!_imgInfo);
                } else if (isWeixin && !!window.wx && !!wx.getLocalImgData) {
                    var defer = $q.defer();
                    deferreds.push(defer);
                    wx.getLocalImgData({
                        // 图片的localID
                        localId: v.base64url,
                        success: function (res) {
                            // localData是图片的base64数据，可以用img标签显示
                            var localData = "data:image/jpeg;base64," + res.localData;
                            var t = dataURItoBlob(localData);
                            appendBase64ToFormData(deferreds, v, t, !!_imgInfo)
                                .then(function () {
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
                    deferredArr.push($q.defer());
                    self.imgCompress(
                        new File([blob.u8Arr], file.filePath, { "type": blob.type }),
                        imgInfo,
                        deferredArr.length - 1
                    ).then(function (result) {
                        fd.append(file.name, dataURItoBlob(result.base64).blob, result.file.name);
                        deferredArr[result.target].resolve();
                    }, function (result) {
                        fd.append(file.name, blob.blob, file.filePath);
                        deferredArr[result.target].resolve();
                    });
                } else {
                    fd.append(file.name, blob.blob, file.filePath);
                    deferredArr.push({ promise: $q.resolve() });
                }
                return deferredArr[deferredArr.length - 1].promise;
            }

            angular.forEach(deferreds, function (v) {
                if (!!v.promise) {
                    promises.push(v.promise);
                } else {
                    promises.push(v);
                }
            });

            $q.all(promises).then(function () {
                $http({
                    method: 'POST',
                    url: apiUrl,
                    data: fd,
                    headers: { 'Content-Type': undefined }
                }).then(function (result) {
                    deferred.resolve(result);
                }, function (result) {
                    deferred.reject(result);
                });
            });

            return deferred.promise;
        };
    }

})();