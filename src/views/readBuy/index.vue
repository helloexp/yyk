<template>
  <div class="mianContent">
    <div class="vedioBox">
      <div id="container"></div>
      <div class="titleBox">
        <div class="titleRow">
          <p class="title">{{ allDetailData.title }}</p>
        </div>
        <div class="readRow">
          <div class="controlPannel">
            <div class="zanBox" @click="likeVedio()">
              <img v-if="otherInfo.isLike" src="@@/images/redheart.png" />
              <img v-else src="@@/images/blackheart.png" />
              <!-- <span class="zan" :class="{'notLike':otherInfo.isLike}"></span> -->
              <span class="zanCount">{{otherInfo.likeC}}</span>
            </div>
            <span class="line"></span>
            <span class="share"></span>
          </div>
          <p class="rightRead">
            <!-- <span class="read"></span> -->
            <img src="@@/images/look.png" alt />
            <span class="readCount">{{ otherInfo.watchC }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="vedioPop" v-if="isShowVedioPop">
      <p class="tuijian">为您推荐</p>
      <img class="midContent" v-lazy="allDetailData.cover" />
      <!-- <img src="" class="leftImg">
        <div class="rightIntros">
          <p class="rightIntroTitle">棉质休闲圆领T恤(长袖)</p>
          <p class="rightIntroId">419974</p>
          <p class="rightIntroPric">￥99.00</p>
      </div>-->
      <!-- </div> -->
      <div class="refresh" @click="startVedio"></div>
    </div>
    <div class="vedioIntros">
      <div class="asVedio" v-if="sameVD.length">
        <p class="classTitle">视频同款</p>
        <div class="scrollWrap asContent">
          <div class="scrollBox asBox">
            <!-- <div class="scorllItem saleOut" v-for="(item, idx) in sameVD" :key="idx"> -->
            <div
              class="scorllItem"
              :class="{'saleOut': item.inactive || item.xiajia || item.shouqin}"
              v-for="(item, idx) in sameVD"
              :key="idx"
            >
              <div class="saleOutPop">售罄</div>
              <img class="classImg" v-lazy="{src: item.mfImgUrl, error: item.skuImgUrl}" />
              <p class="classTitle">{{item.name}}</p>
              <!-- <p class="classId">{{item.pnum}}</p> -->
              <p class="classPrice">
                <span class="yprice">￥{{item.originPrice}}</span>
                <span class="findSame" v-if="item.inactive || item.xiajia || item.shouqin">找相似</span>
                <span class="joinShop" v-else></span>
              </p>
            </div>
            <!-- <span class="scorllItem">
              <div class="saleOutPop">
                售罄
              </div>
              <img src="" class="classImg">
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
              <img src="" class="classImg">
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
              <img src="" class="classImg">
              <p class="classTitle">棉质休闲圆领T恤(长袖)</p>
              <p class="classId">12312</p>
              <p class="classPrice">
                <span class="yprice">￥12.00</span>
                <span class="joinShop"></span>
              </p>
            </span>-->
          </div>
        </div>
      </div>
      <div class="moreVedio" v-if="VDList.length" :class="{ 'firstContent': !sameVD.length }">
        <p class="classTitle">更多精彩视频</p>
        <div class="scrollWrap moreContent">
          <div class="scrollBox moreBox">
            <span
              class="scorllItem"
              v-for="(item, index) in VDList"
              :key="index"
              @click="jumpDetail(item.vid, item.video)"
            >
              <img v-lazy="{ src: item.cover }" class="moreImg" />
              <p class="moreTitle">{{ item.title }}</p>
              <p class="moreIntros">{{ item.subtitle }}</p>
            </span>
          </div>
        </div>
      </div>
      <div
        class="moreNew"
        v-if="moreVD.length"
        :class="{'firstContent': !sameVD.length && !VDList.length}"
      >
        <p class="classTitle">更多新品</p>
        <div class="newBox">
          <div v-for="(item, idx) in moreVD" :key="idx">
            <div class="oneImg" v-if="item.type == 1">
              <img v-for="(_item, _idx) in item.img_list" :key="_idx" :src="_item.img_url" />
            </div>
            <div class="twoImg" v-else :class="{ 'lastImg': idx == moreVD.length - 1 }">
              <div
                class="img"
                v-for="(_item, _idx) in item.img_list"
                :key="_idx"
                :style="{background:'url(' + _item.img_url + ') no-repeat',
              'background-size':'cover',
              'background-position': 'center 0'}"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="noMore">没有更多了</div>
    </div>
    <Confirm ref="confirmToast" @userControl="toastType"></Confirm>
  </div>
</template>
<script>
import Confirm from "@/components/confirmToast.vue";
import _utils from "@/utils/utils.js";
export default {
  data() {
    return {
      player: null,
      isShowVedioPop: false,
      vedioStatus: -1,
      vedioId: "",
      vid: "",
      moreVD: [],
      sameVD: [],
      VDList: [],
      otherInfo: {},
      allDetailData: {},
      isWifi: false,
      zanCtrl: {
        clickCount: 0,
        canClick: true
      },
      imgBaseUrl: "",
      imgUrlParams: "",
      userInfo: {},
      netType: "",
      isAndroid: _utils.isAndroid(),
      isIos: _utils.isIos(),
      userToken: ""
    };
  },
  components: {
    Confirm
  },
  watch: {
    vedioStatus(val) {
      if (val == 0) {
        this.isShowVedioPop = true;
      }
    },
    netType(val) {
      let that = this;
      if (val == "4g") {
        that.showConfrim(
          "检测到你的网络非WIFI，请确认非WIFI环境是否自动播放视频",
          "net"
        );
      } else if (val == "wifi") {
        that.startVedio();
        that.$refs.confirmToast.hidden();
      } else {
      }
    }
  },
  created() {
    // console.log(process.env.VUE_APP_IMGBASE,'VUE_APP_IMGBASE');
    this.$loading(true);
    this.vedioId = this.$route.query.vedio;
    this.vid = this.$route.query.vid;
    // 不同环境下的图片域名
    // this.imgBaseUrl = process.env.VUE_APP_IMGBASE;
    this.imgBaseUrl = "https://www.uniqlo.cn";
  },
  mounted() {
    this.getImgParams();
    // 初始化视频组件
    this.initVideo();
    // 获取原生返回的网络状态，根据网络状态控制视频播放
    // this.startVedio();
    this.getReadBuyDetail();
    // this.$loading(true);

    // getUserToken 获取登陆后的用户信息
    window["getUserToken"] = result => {
      this.getUserToken(result);
    };
    window["getNetType"] = result => {
      this.getNetType(result);
    };
    // 唤醒app
    this.callPhoneApp();
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
      });
    },
    // 获取视频详情
    async getReadBuyDetail() {
      let that = this;
      try {
        let params = {
          vid: that.vid,
          code: ""
        };
        let res = await this.$api.readBuy.readBuyDetail(params);
        if (res && res.result == 0) {
          that.allDetailData = res;
          if (res.video_list && res.video_list.length > 0) {
            that.VDList = res.video_list;
          }
          if (res.more_list && res.more_list.length > 0) {
            that.moreVD = res.more_list;
          }
          that.otherInfo.isLike = Number(res.like);
          that.otherInfo["likeC"] = res.video_lnum;
          that.otherInfo["watchC"] = res.video_wnum;
          if (res.same_list && res.same_list.length > 0) {
            that.handleSameVideoData(res.same_list);
          }
          that.$loading(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取图片地址参数
    async getImgParams() {
      let that = this;
      try {
        let res = await that.$api.imgUrlParams.imgUrlParams();
        that.imgUrlParams = res.picturePath;
      } catch (e) {
        console.log(e);
      }
    },
    // 播放
    startVedio() {
      this.player.play();
      this.isShowVedioPop = false;
    },
    // 暂停
    pauseVedio() {
      this.player.pause();
    },
    // 点赞
    likeVedio() {
      // this.$toast(this.vedioId);
      let that = this;
      // 判断是否登录,登陆原生返回登陆信息，没登录返回需要登陆信息
      if (sessionStorage.getItem("userInfo")) {
        // 一次没有点时开始计时，两秒复位一次，超过两次说明，两秒内点击次数过多，直接return
        if (!that.zanCtrl.canClick) return;
        if (!that.zanCtrl.clickCount) {
          setTimeout(() => {
            that.zanCtrl.clickCount = 0;
            that.zanCtrl.canClick = true;
          }, 2000);
        }
        that.zanCtrl.clickCount++;
        if (that.zanCtrl.clickCount > 2) {
          that.$toast("点赞过于频繁");
          that.zanCtrl.canClick = false;
          return;
        }
        if (that.otherInfo.isLike) {
          // 请求接口取消点赞
          let data = {
            like: 2,
            code: ""
          };
          let res = that.dianZan(data);
          if (res && res.result == 0) {
            that.otherInfo.isLike = false;
          }
        } else {
          // 点赞
          let data = {
            like: 1,
            code: ""
          };
          let res = that.dianZan(data);
          if (res && res.result == 0) {
            that.otherInfo.isLike = true;
          }
        }
      } else {
        // 发起登陆请求
        that.showConfrim("你暂时还未登陆，请登陆后点赞", "zan");
      }
    },
    // 视频切换
    jumpDetail(vid, vedio) {
      this.$router.replace({
        path: "/readBuyDetail?vid=" + vid + "&vedio=" + vedio
      });
    },
    // 视频同款处理
    handleSameVideoData(list) {
      let that = this;
      list.sort(function(a, b) {
        return Number(b.sort) - Number(a.sort);
      });
      list.forEach(async (item, idx) => {
        let res = await that.sameVedioData(item.goods_id);
        item["mfImgUrl"] =
          that.imgBaseUrl +
          that.imgUrlParams +
          item.goods_id +
          "/main/first/" +
          "1000/" +
          item.color_no +
          ".jpg";
        item["skuImgUrl"] =
          that.imgBaseUrl +
          that.imgUrlParams +
          item.goods_id +
          "/sku/" +
          "1000/" +
          item.color_no +
          ".jpg";
        item["inactive"] = res.inactive == "Y";
        item["xiajia"] = !(
          res.approval == "LIST" || res.approval == "AUTOLIST"
        );
        item["shouqin"] = res.hasStock != "Y";
        item["name"] = res.fullName;
        item["originPrice"] = res.originPrice;
        item["sortS"] = idx;
        that.sameVD.push(item);
      });
    },
    // 视频同款数据
    async sameVedioData(spu) {
      let that = this;
      try {
        let res = await that.$api.imgUrlParams.samevideo(spu);
        return res;
      } catch (e) {
        console.log(e);
      }
    },
    async dianZan(data) {
      let that = this;
      try {
        let params = {
          like: data.like,
          code: ""
        };
        let res = await that.$$api.readBuy.readBuyLike(params);
        return res;
      } catch (e) {
        console.log(e);
      }
    },
    /*
      原生交互方法
    */
    // 获取用户登录信息
    getUserToken(res) {
      console.log(res, "token------");
      if (res) {
        // 登陆了直接存
        sessionStorage.setItem("userInfo", res);
      } else {
        // 没登录暂时不知道怎么操作
      }
    },
    // 网络状态
    getNetType(res) {
      console.log(res, "net------");
      this.netType = "wifi";
    },
    // 弹窗提示
    showConfrim(content, type) {
      let netConfig = {
        titleText: "自动播放视频？",
        cancelText: "不播放",
        confirmText: "自动播放",
        data: type
      };
      let zanConfig = {
        titleText: "是否登陆",
        cancelText: "不登录",
        confirmText: "去登陆",
        data: type
      };
      if (type == "net") {
        this.$refs.confirmToast.show(content, netConfig);
      } else {
        this.$refs.confirmToast.show(content, zanConfig);
      }
    },
    // 点击弹窗操作处理
    toastType(type, data) {
      let that = this;
      if (data == "net") {
        if (type == "clickConfirm") {
          that.startVedio();
        }
      }
      if (data == "zan") {
        if (type == "clickConfirm") {
          that.callAppToken();
        }
      }
    },
    // 唤醒app监听网络
    callPhoneApp() {
      if (this.isIos) {
        window.webkit.messageHandlers.startListenNet.postMessage();
      } else if (this.isAndroid) {
        window.youyiku.startListenNet();
      }
      // 唤醒的时候进行赋值
      let token = document.cookie ? document.cookie.split("=")[1] : "";
      if (token) {
        sessionStorage.setItem("userInfo", token);
      }
    },
    // 发起跳转原生登陆请求
    callAppToken() {
      if (this.isIos) {
        window.webkit.messageHandlers.userLogin.postMessage();
      } else if (this.isAndroid) {
        window.youyiku.userLogin();
      }
    },
    // 发起跳转原生的页面
    callAppJump() {
      if (this.isIos) {
        window.webkit.messageHandlers.pageJump.postMessage();
      } else if (this.isAndroid) {
        window.youyiku.pageJump();
      }
    },
    // 发起分享请求
    callAppShare() {
      if (this.isIos) {
        window.webkit.messageHandlers.shareWX.postMessage();
      } else if (this.isAndroid) {
        window.youyiku.shareWX();
      }
    }
  }
};
</script>

<style lang="less">
@mgLook: "../../assets/images/look.png";
@mgheart: "../../assets/images/redheart.png";
@mgheartblack: "../../assets/images/blackheart.png";
@mgshare: "../../assets/images/share.png";
@mgShop: "../../assets/images/cart.png";

.vedioBox {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 10;
  .titleBox {
    padding: 18px 22px 10px 25px; /*no*/
    .titleRow {
      display: flex;
      align-content: center;
      justify-content: space-between;
      .title {
        width: 100%; /*no*/
        font-size: 18px; /*no*/
        overflow: hidden;
        max-height: 38px; /*no*/
        line-height: 19px; /*no*/
        font-weight: bold;
      }
    }
    .readRow {
      margin-top: 15px; /*no*/
      height: 19px; /*no*/
      line-height: 18px; /*no*/
      display: flex;
      justify-content: space-between;
      .controlPannel {
        display: flex;
        align-items: center;
        .zanBox {
          display: flex;
          align-items: center;
          .zan {
            width: 20px; /*no*/
            height: 15px; /*no*/
            background: url(@mgheart) no-repeat;
          }
          .zanCount {
            font-size: 12px; /*no*/
            margin-left: 3px; /*no*/
          }
          .notLike {
            background: url(@mgheartblack) no-repeat;
          }
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
      .rightRead {
        display: flex;
        align-items: center;
        .read {
          width: 18px; /*no*/
          height: 15px; /*no*/
          background: url(@mgLook) no-repeat;
        }
        .readCount {
          font-size: 12px; /*no*/
          color: #999;
          margin-left: 4px;
          padding-top: 1px; /*no*/
        }
      }
    }
  }
}
.vedioIntros {
  margin-top: 355px; /*no*/
  padding-left: 25px;
  padding-top: 13px; /*no*/
  .classTitle {
    font-size: 16px;
  }
  .scrollWrap {
    margin-top: 15px;
    width: 100%;
    // height: 186px;
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
    margin-top: 13px;
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
            opacity: 0.5;
            color: white;
            width: 125px;
            height: 125px;
            position: absolute;
            top: 0;
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
            line-height: 14px;
            height: 28px;
            width: 125px;
            white-space: pre-wrap;
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
            .findSame {
              height: 28x;
              background: #fa0000;
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
          color: #9b9b9b;
          .saleOutPop {
            display: block;
          }
        }
      }
    }
  }
  .moreVedio {
    margin-top: 24px;
    .moreContent {
      // height: 112px;
      .moreBox {
        // height: 114px;
        .scorllItem {
          // height: 112px;
          width: 100px;
          margin-right: 10px;
          font-size: 12px;
          .moreImg {
            // height: 66px;
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
        max-height: 170px;
      }
    }
    .twoImg {
      margin-top: 15px;
      display: flex;
      padding-right: 25px;
      justify-content: space-between;
      margin-bottom: 15px;
      // img {
      //   width: 155px;
      //   height:216px;
      // }
      div.img {
        width: 155px;
        min-height: 155px * 1.78;
      }
    }
    .lastImg {
      margin-bottom: 0;
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
  .firstContent {
    margin-top: 0;
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
