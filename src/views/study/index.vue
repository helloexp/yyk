<template>
  <div class="mianContent">
    <button v-copy="copyText">复制</button>
  </div>
</template>

<script>
export default {
  name: "study",
  data: function() {
    return {
      copyText: "复制的内容"
    };
  },
  components: {},
  methods: {},
  watch: {},
  mounted() {},
  filters: {}
};
</script>

<style lang="less">
</style>
