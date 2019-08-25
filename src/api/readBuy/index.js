import api from '../index'
import urls from './urls'
import md5Util from '../../assets/js/md5.js'
// 生成签名
function buildSign(platform, macAddress, time) {
    var pjStr = "platform=" + platform + "&macAddress=" + macAddress + "&time=" + time + "&appsecret=ZePD4yB5";
    var signStr = pjStr.toLowerCase();
    var sign = md5Util.mhex_md5(signStr);
    return sign;
}
var timestamp = Date.parse(new Date()) / 1000;
// 请求头数据
const header = {
    "Content-Type": "application/json",
    "platform": 'wechat',
    "macAddress": '',
    "time": timestamp,
    "sign": buildSign('wechat','',timestamp),
    "appKey": "uniqloApp",
    "sid": '',
}

export default {
    readBuyList(params) {
        // return出去了一个promise
        return api.post(urls.readBuyList, params, header)
    },
    readBuyDetail(params) {
        return api.post(urls.readBuyDetail, params, header)
    },
    readBuyBanner(params) {
        return api.post(urls.readBuyBanner, params, header)
    },
    readBuyLike(params) {
        return api.post(urls.readBuyLike, params, header)
    },
}
