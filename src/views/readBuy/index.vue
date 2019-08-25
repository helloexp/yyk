<template>
  <div class="mianContent">
    <div class="vedioBox">
      <div id="container"></div>
      <div class="titleBox">
        <div class="titleRow">
          <p class="title">倪妮教你搭配美学新品</p>
          <p class="controlPannel">
            <span class="zan" :class="{'notLike':otherInfo.isLike}"></span>
            <span class="zanCount">{{otherInfo.likeC}}</span>
            <span class="line"></span>
            <span class="share"></span>
          </p>
        </div>
        <p class="readRow">
          <span class="read"></span>
          <span class="readCount">{{ otherInfo.watchC }}</span>
        </p>
      </div>
    </div>
    <div class="vedioPop" v-if="isShowVedioPop">
      <p class="tuijian">为您推荐</p>
      <div class="midContent">
        <img src="" alt="" class="leftImg">
        <div class="rightIntros">
          <p class="rightIntroTitle">棉质休闲圆领T恤(长袖)</p>
          <p class="rightIntroId">419974</p>
          <p class="rightIntroPric">￥99.00</p>
        </div>
      </div>
      <div class="refresh" @click="startVedio"></div>
    </div>
    <div class="vedioIntros">
      <div class="asVedio" v-if="sameVD.length">
        <p class="classTitle">视频同款</p>
        <div class="scrollWrap asContent">
          <div class="scrollBox asBox">
            <div class="scorllItem saleOut">
              <div class="saleOutPop">
                售罄
              </div>
              <img src="" alt="" class="classImg">
              <p class="classTitle">棉质休闲圆领T恤(长袖)</p>
              <p class="classId">12312</p>
              <p class="classPrice">
                <span class="yprice">￥12.00</span>
                <span class="findSame">找相似</span>
              </p>
            </div>
            <span class="scorllItem">
              <div class="saleOutPop">
                售罄
              </div>
              <img src="" alt="" class="classImg">
              <p class="classTitle">棉质休闲圆领T恤(长袖)</p>
              <p class="classId">12312</p>
              <p class="classPrice">
                <span class="yprice">￥12.00</span>
                <span class="joinShop"></span>
              </p>
            </span>
            <span class="scorllItem">
               <div class="saleOutPop">
                售罄
              </div>
              <img src="" alt="" class="classImg">
              <p class="classTitle">棉质休闲圆领T恤(长袖)</p>
              <p class="classId">12312</p>
              <p class="classPrice">
                <span class="yprice">￥12.00</span>
                <span class="joinShop"></span>
              </p>
            </span>
            <span class="scorllItem">
              <div class="saleOutPop">
                售罄
              </div>
              <img src="" alt="" class="classImg">
              <p class="classTitle">棉质休闲圆领T恤(长袖)</p>
              <p class="classId">12312</p>
              <p class="classPrice">
                <span class="yprice">￥12.00</span>
                <span class="joinShop"></span>
              </p>
            </span>
          </div>
        </div>
      </div>
      <div class="moreVedio" v-if="VDList.length">
        <p class="classTitle">更多精彩视频</p>
        <div class="scrollWrap moreContent">
          <div class="scrollBox moreBox">
            <span class="scorllItem" v-for="(item, index) in VDList" :key="index">
              <img :src="item.cover" alt="" class="moreImg">
              <p class="moreTitle">{{item.title}}</p>
              <p class="moreIntros">{{item.subtitle}}</p>
            </span>
          </div>
        </div>
      </div>
      <div class="moreNew" v-if="moreVD.length">
        <p class="classTitle">更多新品</p>
        <div class="newBox">
          <div class="oneImg">
            <img src="" alt="">
          </div>
          <div class="twoImg">
            <img src="" alt="">
            <img src="" alt="">
          </div>
        </div>
      </div>
      <div class="noMore">
        没有更多了
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      player: null,
      isShowVedioPop: false,
      vedioStatus: -1,
      vedioId: "",
      moreVD: [],
      sameVD: [],
      VDList: [],
      otherInfo: {
        isLike: false,
        watchC: 0,
        likeC: 0
      }
    };
  },
  components: {},
  watch: {
    vedioStatus(val) {
      if (val == 0) {
        this.isShowVedioPop = true;
      }
    }
  },
  created() {
    this.vedioId = this.$route.params.vid;
  },
  mounted() {
    // 获取原生返回的网络状态，根据网络状态控制视频播放
    this.initVideo();
    this.getReadBuyDetail();
    console.log(this.vedioId);
  },
  methods: {
    // 视频组件
    initVideo() {
      let that = this;
      this.player = new Txp.Player({
        containerId: "container",
        vid: that.vedioId,
        height: "275px"
      });
      this.player.on("playStateChange", function(res) {
        that.vedioStatus = res;
        console.log(res);
      });
    },
    // 获取视频详情
    async getReadBuyDetail() {
      let that = this;
      try {
        let params = {
          vid: that.vedioId,
          code: ''
        };
        let res = await this.$api.readBuy.readBuyDetail(params);
        if(res && res.result == 0){
          if(res.same_list && res.same_list.length > 0) {
            that.sameVD = res.same_list;
          }
          if (res.video_list && res.video_list.length > 0) {
            that.VDList = res.video_list;
          }
          if (res.more_list && res.more_list.length > 0) {
            that.moreVD = res.more_list;
          }
          that.otherInfo.isLike = true;
          that.otherInfo['likeC'] = res.video_lnum;
          that.otherInfo['watchC'] = res.video_wnum;
        }
      }catch(e) {
        console.log(e);
      }
    },
    startVedio(){
      this.player.play();
    }
  }
};
</script>

<style lang="less">
@mgLook: "../../assets/images/look.png";
@mgheart: "../../assets/images/redheart.png";
@mgheartblack: "../../assets/images/blackheart.png";
@mgshare: "../../assets/images/share.png";
@mgShop:'../../assets/images/cart.png';

.vedioBox {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 10;
  .titleBox {
    padding: 24px 22px 10px 25px;/*no*/
    .titleRow {
      display: flex;
      align-content: center;
      justify-content: space-between;
      .title {
        width: 225px;/*no*/
        font-size: 18px;/*no*/
        overflow: hidden;
        height: 19px;/*no*/
        line-height: 19px;/*no*/
        font-weight: bold;
      }
      .controlPannel {
        display: flex;
        align-content: center;
        align-items: center;
        .zan {
          width: 15px; /*no*/
          height: 15px;/*no*/
          background: url(@mgheart) no-repeat;
        }
        .notLike{
          background: url(@mgheartblack) no-repeat;
        }
        .zanCount {
          font-size: 12px; /*no*/
          margin-left: 3px; /*no*/
        }
        .line {
          width: 1px; /*no*/
          height: 15px; /*no*/
          background: #ddd;
          margin-left: 14px; /*no*/
          margin-right: 14px; /*no*/
        }
        .share {
          width: 19px; /*no*/
          height: 19px; /*no*/
          background: url(@mgshare) no-repeat;
          margin-left: 4px; /*no*/
        }
      }
    }
    .readRow {
      margin-top: 8px; /*no*/
      height: 18px; /*no*/
      line-height: 18px; /*no*/
      display: flex;
      .read {
        width: 18px; /*no*/
        height: 15px; /*no*/
        background: url(@mgLook) no-repeat;
      }
      .readCount {
        font-size: 12px; /*no*/
        color: #999;
      }
    }
  }
}
.vedioIntros {
  margin-top: 355px; /*no*/
  padding: 13px 0 0 25px;
  .classTitle {
    font-size: 16px;
  }
  .scrollWrap {
      margin-top: 15px;
      width: 100%;
      height: 186px;
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      .scrollBox {
        width: auto;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
      }
  }
  .asVedio {
    .asContent {
      height: 186px;
      .asBox {
        height: 187px;
        .scorllItem {
          display: inline-block;
          height: 187px;
          width: 125px;
          margin-right: 15px;
          position: relative;
          .saleOutPop {
            display: none;
            background: #000000;
            opacity: .5;
            color: white;
            width: 125px;
            height: 125px;
            position: absolute;
            top:0;
            left: 0;
            text-align: center;
            line-height: 125px;
          }
          .classImg {
            width: 125px;
            height: 125px;
          }
          .classTitle {
            font-size: 12px;
            overflow: hidden;
            line-height: 14px;
          }
          .classId {
            font-size: 12px;
            overflow: hidden;
            line-height: 12px;
            margin-top: 4px;
          }
          .classPrice {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
            height: 20px;
            line-height: 20px;
            .yprice {
              font-size: 14px;
              font-weight: bold;
              overflow: hidden;
              line-height: 14px;
              padding-top: 3px;
            }
            .findSame{
              height: 28x;
              background: #FA0000;
              color: #fff;
              text-align: center;
              padding: 4px 4px;
              font-size: 20px;
              -webkit-transform: scale(0.5);
            }
            .joinShop {
              width: 18px; /*no*/
              height: 15px; /*no*/
              margin-right: 5px;
              background: url(@mgShop) no-repeat;
            }
          }
        }
        .saleOut {
          color:#9b9b9b;
          .saleOutPop {
            display: block;
          }
        }
      }
    }
  }
  .moreVedio {
    margin-top: 22px; /*no*/
    .moreContent {
      height: 112px;
      .moreBox {
        height: 114px;
        .scorllItem {
          height: 112px;
          width: 100px;
          margin-right: 10px;
          font-size: 12px;
          .moreImg {
            height: 66px;
            width: 107px;
          }
          .moreTitle {
            font-weight: bold;
            line-height: 16px;
            margin-top: 8px;
            width: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .moreIntros {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100px;
            // height: 14px;
            // line-height: 19px;
            // margin-top: 5px;
          }
        }
      }
    }
  }
  .moreNew {
    margin-top: 30px;
    .classTitle {
      font-size: 16px;
      margin-bottom: 16px;
    }
    .oneImg {
      img {
        width: 325px;
        height: 170px;
      }
    }
    .twoImg {
      margin-top: 15px;
      display: flex;
      padding-right: 25px;
      justify-content: space-between;
      img {
        width: 155px;
        height: 216px;
      }
    }
  }
  .noMore {
    font-size: 11px;
    color: #aaa;
    text-align: center;
    margin-bottom: 25px;
    margin-top: 7px;
    padding-right: 25px;
  }
}
.vedioPop {
  position: fixed;
  top: 0;
  left: 0;
  height: 275px; /*no*/
  width: 375px;
  z-index: 12;
  background: rgba(0, 0, 0, 0.5);
  .tuijian {
    font-size: 13px; /*no*/
    color: #aaa;
    margin-left: 35px; /*no*/
    margin-top: 48px; /*no*/
  }
  .midContent {
    width: 302px;
    height: 115px; /*no*/
    margin-top: 13px; /*no*/
    margin-left: 35px; /*no*/
    background: #fff;
    display: flex;
    .leftImg {
      widows: 115px; /*no*/
      height: 115px; /*no*/
    }
    .rightIntros {
      padding-top: 25px; /*no*/
      padding-left: 25px; /*no*/
      .rightIntroTitle {
        font-size: 12px;
        overflow: hidden;
        width: 122px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .rightIntroId {
        font-size: 12px;
      }
      .rightIntroPric {
        font-size: 14px;
        font-weight: bold;
        margin-top: 4px; /*no*/
      }
    }
  }
  .refresh {
    width: 40px; /*no*/
    height: 40px; /*no*/
    background: url(../../assets/images/replay.png);
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
