import urls from '../baseUrl'
console.log(urls)
export default {
  readBuyList: urls.baseUrl + '/api/watch/videoList',
  readBuyDetail: urls.baseUrl + '/api/watch/videoDetail',
  readBuyBanner: urls.baseUrl + '/api/watch/banner',
  readBuyLike: urls.baseUrl + '/api/watch/like'
}
