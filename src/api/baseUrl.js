let baseUrl = "/api"; // 本地代理
console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  //TODO 现将地址改成这个
  case "dev":
    baseUrl = "https://test-event.uniqlo.cn/uniqlo_new_cms"; // 测试环境url
    break;
  case "pre":
    baseUrl = "https://test-event.uniqlo.cn/uniqlo_uat_cms"; // 预上线环境url
    break;
  case "production":
    baseUrl = "https://event.uniqlo.cn/uniqlo_new_cms"; // 生产环境url
    break;
}

export default baseUrl;
