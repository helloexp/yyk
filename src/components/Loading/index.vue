
<template>
  <transition name="fade">
    <!--loding s-->
    <div v-if="isShow"
         ontouchmove="return false;"
         class="loadingbg">
      <div class="loading">
        <div class="loading_icon"></div>
        <div class="loading_text">努力加载中</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isShow: false
    }
  }
}
</script>

<style lang="less" scoped>
.loadingbg {
  background-color: #f2f4f7;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
.loadingbg .loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 71px;
  height: 71px;
  margin: -33px 0 0 -33px;
}
.loadingbg .loading .loading_icon {
  display: block;
  width: 36px;
  height: 36px;
  background: url(//appnew.ly.com/hc/1/img/icon_tg_loading1.gif) no-repeat;
  background-size: 36px 36px;
  margin: 0 auto;
}
.loadingbg .loading .loading_text {
  font-size: 14px;
  margin-top: 12px;
  text-align: center;
  color: #999;
  font-family: "Microsoft YaHei", "微软雅黑", Arial, SimSun, sans-serif;
}
</style>