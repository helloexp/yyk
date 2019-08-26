<template>
  <div class="mianContent">
    <div class="wrapper">
      <swiper :options="swiperOption">
        <swiper-slide v-for="item of bannerList" :key="item.id">
          <img v-lazy="item.img_url" class="swiper-img" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="tuijianTitle">
      <div class="tjTitle">为你推荐</div>
      <div class="allReadCount">
        <img src="@@/images/allcount.png" class="countImg">
        <span class="countIntro">{{allReadCount | handleAllReadC}}人正在边看边买</span>
      </div>
    </div>
    <div class="moiveList">
      <div class="moiveTab" v-for="(item,index) in readBuyList" :key="index" :class="index == 0 ? 'firstTba' :''" @click="jumpDetail(item.vid, item.video)">
        <img v-lazy="item.cover" alt class="coverImg" />
        <div class="introsBox">
          <p class="moiveDate">{{item.create_time | handleTime}}</p>
          <p class="moiveIntros">{{item.title}}</p>
          <p class="bannelBox">
            <span class="contrlbox">
              <span class="look"></span>
              <span class="count">{{ item.video_wnum | handleReadCount }}</span>
            </span>
            <span class="contrlbox">
              <span class="zan"></span>
              <span class="count">{{item.video_lnum}}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
    <Loading :isShowLoading="isShowLoadMore" :noMore="noMoreVedio"></Loading>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Loading from "../../components/LoadMore.vue";
export default {
  name: "readBuyList",
  data: function() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      readBuyList:[],
      allReadCount:0,
      bannerList: [],
      isShowLoadMore: false,
      noMoreVedio: false,
      scrollTop: 0,
      currentPage: 1 ,
      testPage: 1,
      source: null
    };
  },
  components: {
    Loading: Loading
  },
  methods: {
    handleNetstate(e) {
      // 网络链接改变时处理函数
      console.log(e);
    },
    // 获取列表页数据
    async getReadBuyList() {
      let that = this;
      try {
        let params = {
          page: that.currentPage,
        };
        if(that.noMoreVedio) {
          that.isShowLoadMore = false;
          return;
        };
        let res = await that.$api.readBuy.readBuyList(params);
        if(res && res.result == 0 && res.list.length > 0){
            that.allReadCount = Number(res.video_total||0);
            that.isShowLoadMore = false;
            that.readBuyList = that.readBuyList.concat(res.list);
            if(that.readBuyList.length == res.total){
              that.noMoreVedio = true;
            }else {
              that.currentPage ++;
            }
        }else {
          that.isShowLoadMore = false;
        }
      } catch (e) {
        console.log("请求出错" + e);
      }
    },
    async getBannerData() {
      try{
        let res = await this.$api.readBuy.readBuyBanner();
        if(res && res.result == 0 && res.list.length){
          this.bannerList = res.list;
        }
      }catch(e){
        console.log(e)
      }
    },
    // 监听滚动条监听
    listScrollTop(){
      let that = this;
      window.onscroll=function(){
        that.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      }
    },
    jumpDetail(vid, vedio) {
      this.$router.push({ path: "/readBuyDetail?vid=" + vid + "&vedio=" + vedio });
    }
  },
  watch:{
    scrollTop(val){
      let that = this;
      if(window.screen.availHeight + val == document.body.scrollHeight){
        that.isShowLoadMore = true;
        that.getReadBuyList();
      }
    }
  },
  mounted() {
    this.getReadBuyList();
    this.getBannerData();
    this.listScrollTop();
  },
  filters:{
    handleTime(val) {
      let year = dayjs(val*1000).year();
      let month = dayjs(val*1000).month();
      let day = dayjs(val*1000).date();
      //TODO 不知道为什么需要加一个月
      let date = `${year}年${month+1}月${day}日`
      return date;
    },
    handleReadCount(val) {
      if(val.length > 5) return `${parseInt(val/1000)}k`;
      return val;
    },
    handleAllReadC(val) {
      if(val.length > 5) return `${parseFloat(val/10000).toFixed(1)}万`;
      return val;
    }
  }
};
</script>

<style lang="less" >
@mgLook: "../../assets/images/look.png";
@mgheart: "../../assets/images/blackheart.png";
.wrapper {
  overflow: hidden;
  width: 100%;
  // height: 220px;
  background: @backGrayColor;
  .swiper-img {
    // height: 220px;
    width: 100%;
  }
}
.moiveList {
  margin-top: 15px;
  padding: 0 20px;
  
  .moiveTab {
    width: 335px;
    height: 105px;
    border: 1px solid #f3f3f3;
    display: flex;
    margin-top: 5px;
    &.firstTba{
      margin-top: 0;
    }
    .coverImg {
      max-width: 160px;
      height: 105px;
    }
    .introsBox {
      padding: 13px 15px 14px 14px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .contrlbox {
        display: flex;
        align-items: center;
      }
      .moiveDate {
        color: #999999;
        font-size: 10px;
        margin-bottom: 6px;
      }
      .moiveIntros {
        color: #000000;
        font-size: 13px;
        height: 36px;
        min-width: 141px;
        margin-bottom: 6px;
        font-weight: bold;
        overflow-y: hidden;
      }
      .bannelBox {
        display: flex;
        justify-content: flex-end;
        .zan {
          width: 16px; /*no*/
          height: 16px; /*no*/
          background: url(@mgheart) no-repeat;
          margin-left: 17px;
        }
        .look {
          width: 16px; /*no*/
          height: 16px; /*no*/
          background: url(@mgLook) no-repeat;
        }
        .count {
          font-size: 10px;
          color: #999;
          line-height: 10px;
          margin-left: 4px;
        }
      }
    }
  }
}
.tuijianTitle{
  margin-top: 13px;
  margin-bottom: 15px;
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  .tjTitle{
    font-size: 18px;
    font-weight: bold;
  }
  .allReadCount{
    font-family: "微软雅黑";
    background-color: #E9E9E9;
    display: flex;
    align-items: center;
    padding-right: 10px;
    border-radius: 15px;
    .countIntro{
      font-size: 12px;
      margin-left: 6px;
    }
  }
}
</style>
