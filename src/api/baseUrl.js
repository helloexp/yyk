// 本地代理
let baseUrl = "/api";
let imgBaseUrl = '/imgapi'
console.warn(`环境${process.env.NODE_ENV}`);
switch (process.env.NODE_ENV) {
  //TODO 现将地址改成这个
  case "dev":
    baseUrl = "https://test-event.uniqlo.cn/uniqlo_new_cms"; // 测试环境sit
    imgBaseUrl = "https://pictest.uniqlo.cn/uniqlo";
    break;
  case "pre":
    baseUrl = "https://test-event.uniqlo.cn/uniqlo_uat_cms"; // 预上线环境uat
    imgBaseUrl = "https://uatpic.uniqlo.cn/uniqlo";
    break;
  case "production":
    baseUrl = "https://event.uniqlo.cn/uniqlo_new_cms"; // 生产环境obt
    imgBaseUrl = "https://www.uniqlo.cn";
    break;
}

export default {
  baseUrl,
  imgBaseUrl
};
