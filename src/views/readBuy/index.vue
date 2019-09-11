<template>
  <div class="mianContent">
    <div class="vedioBox">
      <div id="container"></div>
    </div>
    <div class="vedioPop" v-if="isShowVedioPop">
      <p class="tuijian">为您推荐</p>
      <img
        class="midContent"
        v-lazy="allDetailData.cover"
        @click="callAppJump(allDetailData.type,allDetailData.content,allDetailData.share_title)"
      />
      <img class="refresh" src="@@/images/replay2.png" @click="startVedio" />
    </div>
    <div class="vedioIntros">
      <div class="titleBox">
        <div class="titleRow">
          <p class="title">{{ allDetailData.title }}</p>
        </div>
        <div class="readRow">
          <div class="controlPannel">
            <div class="zanBox" @click="likeVedio()">
              <img v-if="otherInfo.isLike" src="@@/images/collect.png" />
              <img v-else src="@@/images/like.png" />
              <span class="zanCount">{{otherInfo.likeC}}</span>
            </div>
            <span class="line"></span>
            <img class="share" src="@@/images/share2.png" @click="callAppShare" />
          </div>
          <p class="rightRead">
            <img class="read" src="@@/images/look2.png" alt />
            <span class="readCount">{{ otherInfo.watchC }}</span>
          </p>
        </div>
      </div>
      <div class="asVedio" v-if="sameVD.length">
        <p class="classTitle">视频同款</p>
        <div class="scrollWrap asContent">
          <div class="scrollBox asBox">
            <div
              class="scorllItem"
              :class="{'saleOut': item.inactive || item.xiajia || item.shouqin}"
              v-for="(item, idx) in sameVD"
              :key="idx"
            >
              <div class="saleOutPop" @click="callAppJump(56,item.goods_id,item.keyword)">售罄</div>
              <img
                class="classImg"
                v-lazy="{src: item.mfImgUrl, error: item.skuImgUrl}"
                @click="callAppJump(56,item.goods_id,item.keyword)"
              />
              <p class="classTitle">{{item.name}}</p>
              <p class="classPrice">
                <span class="yprice">￥{{item.originPrice}}</span>
                <span
                  class="findSame"
                  v-if="item.inactive || item.xiajia || item.shouqin"
                  @click="callAppJump(54,item.goods_id,item.keyword)"
                >找相似</span>
                <img src="@@/images/cart2.png" class="joinShop" v-else />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="moreVedio" v-if="VDList.length">
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
      <div class="moreNew" v-if="moreVD.length">
        <p class="classTitle">更多新品</p>
        <div class="newBox">
          <div v-for="(item, idx) in moreVD" :key="idx">
            <div class="oneImg" v-if="item.type == 1">
              <img
                v-for="(_item, _idx) in item.img_list"
                :key="_idx"
                :src="_item.img_url"
                @click="callAppJump(_item.type,_item.content,_item.title)"
              />
            </div>
            <div class="twoImg" v-else :class="{ 'lastImg': idx == moreVD.length - 1 }">
              <div
                class="img"
                v-for="(_item, _idx) in item.img_list"
                :key="_idx"
                :style="{background:'url(' + _item.img_url + ') no-repeat',
              'background-size':'cover',
              'background-position': 'center 0'}"
                @click="callAppJump(_item.type, _item.content, _item.title)"
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
      otherInfo: {
        isLike: false,
        likeC: 0,
        watchC: 0
      },
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
      // isAndroid: true,
      isIos: _utils.isIos(),
      userToken: "",
      netChangeCount: 0,
      isHandleNetPop: false
    };
  },
  components: {
    Confirm
  },
  watch: {
    vedioStatus(val) {
      if (val == 0) {
        this.isShowVedioPop = true;
      } else if (val == 1) {
        if (this.netType == "4g") {
          if (this.$store.state.isAutoPlay) {
            this.player.play();
          } else {
            this.player.pause();
            this.showConfrim(
              "检测到你的网络非WIFI，请确认非WIFI环境是否自动播放视频",
              "net"
            );
          }
        }
      }
      console.log("播放状态值：", val);
    }
  },
  created() {
    this.$loading(true);
    this.vedioId = this.$route.query.vedio;
    this.vid = this.$route.query.vid;
    // 不同环境下的图片域名
    this.imgBaseUrl = process.env.VUE_APP_IMGBASE;
    // this.imgBaseUrl = "https://www.uniqlo.cn";
    if (_utils.getCookie("sid")) {
      sessionStorage.setItem("sid", _utils.getCookie("sid"));
    } else {
      sessionStorage.setItem("sid", "");
    }
  },
  mounted() {
    // 初始化视频组件
    this.initVideo();
    // 获取原生返回的网络状态，根据网络状态控制视频播放
    this.getReadBuyDetail();
    // getUserToken 获取登陆后的用户信息
    window["getUserToken"] = result => {
      this.getUserToken(result);
    };
    window["getNetType"] = result => {
      this.netChangeCount++;
      this.getNetType(result);
    };
    // 唤醒app开始监听网络
    try {
      this.callPhoneApp();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    // 视频组件
    initVideo() {
      let that = this;
      that.player = new Txp.Player({
        containerId: "container",
        vid: that.vedioId,
        height: "275px"
      });
      that.player.on("playStateChange", function(res) {
        that.vedioStatus = res;
      });
    },
    // 获取视频详情
    async getReadBuyDetail() {
      let that = this;
      try {
        let params = {
          vid: that.vid
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
        } else {
          that.player.pause();
          that.$toast("登陆状态过期，请重新登陆");
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
      this.isShowVedioPop = false;
      this.player.play();
    },
    // 暂停
    pauseVedio() {
      this.player.pause();
    },
    // 点赞
    likeVedio() {
      let that = this;
      // 判断是否登录,登陆原生返回登陆信息，没登录返回需要登陆信息
      if (sessionStorage.getItem("sid")) {
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
        let data = {
          like: 1,
          vid: that.vid
        };
        // islik:o未点赞 1点赞了,给接口的参数like： 1点赞 2取消点赞
        if (that.otherInfo.isLike) {
          data["like"] = 2;
        }
        let res = that.dianZan(data);
        if (res) {
          if (that.otherInfo.isLike) {
            that.otherInfo.likeC--;
          } else {
            that.otherInfo.likeC++;
          }
          that.otherInfo.isLike = !that.otherInfo.isLike;
        } else {
          that.$toast("点赞失败");
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
    async handleSameVideoData(list) {
      let that = this;
      list.sort(function(a, b) {
        return Number(b.sort) - Number(a.sort);
      });
      await that.getImgParams();
      list.forEach(async (item, idx) => {
        let res = await that.sameVedioData(item.goods_id);
        if (!res) return;
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
        let res = await that.$api.readBuy.readBuyLike(data);
        if (res && res.result == 0) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    /*
      原生交互方法
    */
    // 获取用户登录信息
    getUserToken(res) {
      console.warn("用户登录以后sid：", res);
      if (res) {
        // 登陆了直接存
        sessionStorage.setItem("sid", res);
        this.likeVedio();
      } else {
        // 没登录暂时不知道怎么操作
        this.$toast("登录失败");
      }
    },
    // 网络状态
    getNetType(res) {
      let that = this;
      console.warn(
        "-----网络状态:",
        res,
        "网络监听次数：",
        that.netChangeCount
      );
      that.netType = res;
      if (that.netChangeCount == 1) {
        if (res == "4g") {
          if (that.$store.state.isAutoPlay == null) {
            that.pauseVedio();
            that.showConfrim(
              "检测到你的网络非WIFI，请确认非WIFI环境是否自动播放视频",
              "net"
            );
          } else if (that.$store.state.isAutoPlay) {
            that.$refs.confirmToast.hidden();
            that.$nextTick(() => {
              setTimeout(() => {
                that.player.play();
              }, 1000);
            });
          } else if (!that.$store.state.isAutoPlay) {
            that.pauseVedio();
          }
        } else if (res == "wifi") {
          that.$refs.confirmToast.hidden();
          that.$nextTick(() => {
            setTimeout(() => {
              that.player.play();
            }, 1000);
          });
        }
        // 非第一次进入页面时的网络变化
      } else {
        console.log(
          "是否有待处理的网络状态：",
          that.isHandleNetPop,
          "--跳转到了app原生页面：" + that.$store.state.jumpPause
        );
        if (that.isHandleNetPop) return;
        that.isHandleNetPop = true;
        if (that.netType == "wifi") {
          that.isHandleNetPop = false;
          // 跳转到其他页面，回来后继续播放，用户手动触发的暂停回来后不继续播放
          if (that.$store.state.playtime && that.$store.state.jumpPause) {
            that.$store.dispatch("setPlayTime", null);
            that.$store.dispatch("jumpPause", false);
            that.player.play();
          }
          return;
        } else {
          console.log(
            "4g：自动播放：" + that.$store.state.isAutoPlay,
            "视频状态:" + that.vedioStatus
          );
          if (!that.$store.state.isAutoPlay) {
            // 暂停
            if (that.vedioStatus == 2) {
              that.isHandleNetPop = false;
              if (that.$store.state.playtime && that.$store.state.jumpPause) {
                that.$store.dispatch("setPlayTime", null);
                that.$store.dispatch("jumpPause", false);
                that.player.play();
              }
              return;
            } else if (
              //非暂停
              that.vedioStatus == -1 ||
              that.vedioStatus == 1 ||
              that.vedioStatus == 3
            ) {
              that.player.pause();
              that.showConfrim(
                "检测到你的网络非WIFI，请确认非WIFI环境是否自动播放视频",
                "net2"
              );
            }
          } else {
            that.isHandleNetPop = false;
            return;
          }
        }
      }
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
      switch (type) {
        case "net":
          this.$refs.confirmToast.show(content, netConfig);
          break;
        case "zan":
          this.$refs.confirmToast.show(content, zanConfig);
          break;
        case "net2":
          this.$refs.confirmToast.show(content, netConfig);
          break;
      }
    },
    // 点击弹窗操作处理
    toastType(type, data) {
      let that = this;
      switch (data) {
        case "net":
          // 自动播放了记录自动播放状态，播放视频
          if (type == "clickConfirm") {
            that.$store.dispatch("autoPlay", true);
            that.startVedio();
          } else {
            that.$store.dispatch("autoPlay", false);
          }
          break;
        case "zan":
          if (type == "clickConfirm") {
            that.callAppToken();
          }
          break;
        case "net2":
          if (type == "clickConfirm") {
            that.$store.dispatch("autoPlay", true);
            that.startVedio();
            that.isHandleNetPop = false;
          } else {
            that.$store.dispatch("autoPlay", false);
            that.isHandleNetPop = false;
          }
          break;
      }
    },
    async getPlayTimes() {
      let time = await this.player.getCurrentTime();
      return time;
    },
    // 唤醒app监听网络
    callPhoneApp() {
      try {
        if (this.isIos) {
          window.webkit.messageHandlers.bkStartListenNet.postMessage("");
        } else if (this.isAndroid) {
          window.android.bkStartListenNet();
        }
      } catch (e) {
        console.warn("原生方法调用");
      }
    },
    // 发起跳转原生登陆请求
    callAppToken() {
      this.jumpAppOtherPage();
      try {
        if (this.isIos) {
          window.webkit.messageHandlers.bkUserLogin.postMessage("");
        } else if (this.isAndroid) {
          window.android.bkUserLogin();
        }
      } catch (e) {
        console.warn("原生方法调用");
      }
    },
    // 发起跳转原生的页面
    callAppJump(type, content, title) {
      this.jumpAppOtherPage();
      try {
        let that = this;
        let params = {
          type: type,
          content: content,
          title: title
        };
        if (this.isIos) {
          window.webkit.messageHandlers.bkPageJump.postMessage(params);
        } else if (this.isAndroid) {
          window.android.bkPageJump(content, title, type);
        }
      } catch (e) {
        console.warn("原生方法调用");
      }
    },
    // 发起分享请求
    callAppShare() {
      let that = this;
      that.jumpAppOtherPage();
      try {
        let params = {
          shareImg: that.allDetailData.share_friend_img,
          shareUrl: `https://test-event.uniqlo.cn/m/des/watch/#/readBuyDetail?vid=${that.vid}&vedio=${that.vedioId}`, // h5地址
          shareCon: that.allDetailData.share_title,
          shareMini: `activity/pages/videoDetail/videoDetail?vid=${that.vid}&channel=xxx` //TODO小程序地址
        };
        if (that.isIos) {
          console.log(params);
          window.webkit.messageHandlers.bkShareWX.postMessage(params);
        } else if (that.isAndroid) {
          window.android.bkShareWX(
            params.shareImg,
            params.shareUrl,
            params.shareCon,
            params.shareMini
          );
        }
      } catch (e) {
        console.warn("原生方法调用");
      }
    },
    jumpAppOtherPage() {
      let that = this;
      // 播放中状态，暂停播放，打开回退开关，页面回来时继续播放
      if (that.vedioStatus == 1) {
        let times = that.getPlayTimes() || 0;
        that.$store.dispatch("setPlayTime", times);
        that.$store.dispatch("jumpPause", true);
        that.pauseVedio();
      }
    }
  }
};
</script>

<style lang="less">
@mgLook: "../../assets/images/look.png";
@mgheart: "../../assets/images/collect.png";
@mgheartblack: "../../assets/images/like.png";
@mgShop: "../../assets/images/cart2.png";

.vedioBox {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 10;
}

.vedioIntros {
  margin-top: 275px; /*no*/
  padding-left: 25px;
  padding-top: 13px; /*no*/
  .titleBox {
    padding-right: 22px; /*no*/
    margin-top: 12px;
    .titleRow {
      display: flex;
      align-content: center;
      justify-content: space-between;
      .title {
        width: 100%; /*no*/
        font-size: 18px;
        overflow: hidden;
        max-height: 38px;
        line-height: 19px;
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
          img {
            width: 19px;
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
          margin-left: 4px; /*no*/
        }
      }
      .rightRead {
        display: flex;
        align-items: center;
        .read {
          width: 18px; /*no*/
          height: 15px; /*no*/
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
      -webkit-overflow-scrolling: touch;
    }
  }
  .asVedio {
    margin-top: 25px;
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
            background: rgba(0, 0, 0, 0.5);
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
            height: 26px;
            width: 125px;
            white-space: pre-wrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
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
    width: 302px; /*no*/
    height: 115px; /*no*/
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
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
    // background: url(../../assets/images/replay.png);
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
