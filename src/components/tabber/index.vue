
<template>
  <div class="font" v-if="isshow">底部导航栏</div>
</template>

<script>
export default {
  data() {
    return {
      isshow: false
    };
  },
  components: {}
};
</script>

<style lang="less" scoped>
.font {
  color: red;
  z-index: 999;
  position: fixed;
  bottom: 0;
  text-align: center;
}
</style>