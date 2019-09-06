import axios from 'axios'
// 创建 axios 实例
let service = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
})


// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    if (config.method === 'post' || config.method === 'put') {
      console.warn(sessionStorage.getItem('sid'), '点赞id');
      console.warn(config.url.indexOf("likeH5") > -1, "sssssss")
      if (config.url == "/api/api/watch/videoDetailH5" || config.url.indexOf("likeH5") > -1) {
        config.headers['sid'] = sessionStorage.getItem('sid');
      }
      // post、put 提交时，将对象转换为string, 为处理Java后台解析问题
      // console.log(config)
      // config.data = qs.stringify(config.data);
    }
    // 请求发送前进行处理
    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    let {
      data
    } = response
    return data
  },
  (error) => {
    let info = {},
      {
        status,
        statusText,
        data
      } = error.response

    if (!error.response) {
      info = {
        code: 5000,
        msg: 'Network Error'
      }
    } else {
      // 此处整理错误信息格式
      info = {
        code: status,
        data: data,
        msg: statusText
      }
    }
  }
)

/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default function () {
  return service;
}
