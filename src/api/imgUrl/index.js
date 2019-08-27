import api from '../index'
import urls from './urls'

export default {
  imgUrlParams() {
    return api.get(urls.imgParams)
  },
  samevideo(spu) {
    let urlstr = urls.samevideo + spu + ".json";
    return api.get(urlstr);
  }
};
