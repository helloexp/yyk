import api from '../index'
import urls from './urls'

export default {
  imgUrlParams() {
    return api.get(urls.imgParams)
  }
};
