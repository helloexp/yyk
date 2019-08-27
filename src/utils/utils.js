/*!
 * utils公共方法
 */

/*!
 * h5复制方法
 * text: 需要复制的文本
 * callback: 回调函数 返回布尔值 表明是否复制成功
 */
function execCommandCopy (text, callback) {
  var input = document.createElement("input");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);
  let bool = document.execCommand("Copy");
  document.body.removeChild(input);
  callback(bool);
}

/**
     * 是否支持webp
     */
function checkWebpSupport () {
  var canvas = document.createElement('canvas');
  if ((canvas.getContext && canvas.getContext("2d"))) {
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }
  return false;
}

/**
 * 图片尺寸重置
 */
function resizeImage (url, width, height) {
  if (checkWebpSupport()) {
    if (!/\.40017\.cn/gi.test(url)) {
      return url;
    } else if (/_(\d*)x(\d*)_(00|01|02)/gi.test(url)) {
      return url + ".webp";
    } else {
      return url.replace(/\.(jpg|png)$/i, "_" + width + "x" + height + "_00.$1.webp");
    }
  } else {
    if (!/\.40017\.cn/gi.test(url) || /_(\d*)x(\d*)_(00|01|02)/gi.test(url)) {
      return url;
    } else {
      return url.replace(/\.(jpg|png)$/i, "_" + width + "x" + height + "_00.$1");
    }
  }
}

/**
 * null => ''
 * @param {*} data 要处理的数据
 */
function null2str (data) {
  for (let x in data) {
    if (data[x] === null) { // 如果是null 把直接内容转为 ''
      data[x] = '';
    } else {
      if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
        data[x] = data[x].map(z => {
          return null2str(z);
        });
      }
      if (typeof (data[x]) === 'object') { // 是json 递归继续处理
        data[x] = null2str(data[x])
      }
    }
  }
  return data;
}

// 判断安卓
function isAndroid() {
  var u = navigator.userAgent;
  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
      if (window.ShowFitness !== undefined) return true;
  }
  return false;
}

// 判断设备为 ios
function isIos() {
  var u = navigator.userAgent;
  if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
      return true;
  }
  return false;
}

export default {
  execCommandCopy,
  resizeImage,
  null2str,
  isAndroid,
  isIos
};