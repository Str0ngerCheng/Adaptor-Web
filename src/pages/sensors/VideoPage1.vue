<template>
  <imp-panel>
    <div class="table" style="padding: 5px">
      <!-- <div class="container"> -->
      <!-- <div class='demo'> -->
      <el-button type="primary" size="medium" @click="moreScreenMode" variant="primary" v-if="videoPageButton == true">
        {{buttonTitile}}</el-button>
      <div class=" wfsjs" id="wfsjs" style="margin-top: 20px;text-align: center;" ref="videoDiv">
        <div id="video-main" :style="{width:mainWidth,height:mainHeight}">
          <video id="video" ref="video" :width="videoWidth" :height="videoHeight" onclick="return false"
                 @contextmenu.prevent="rightClick" muted controls="false"></video>
        </div>
        <div id="video-main2" :style="{width:mainWidth,height:mainHeight}">
          <video id="video2" ref="video2" :width="videoWidth" :height="videoHeight" onclick="return false"
                 @contextmenu.prevent="rightClick" muted controls="false"></video>
        </div>
        <!-- 换行start -->
        <div></div>
        <!-- 换行end -->
        <div id="video-main3" :style="{width:mainWidth,height:mainHeight}">
          <video id="video3" ref="video3" :width="videoWidth" :height="videoHeight" onclick="return false"
                 @contextmenu.prevent="rightClick" muted controls="false"></video>
        </div>
        <div id="video-main4" :style="{width:mainWidth,height:mainHeight}">
          <video id="video4" ref="video4" :width="videoWidth" :height="videoHeight" onclick="return false"
                 @contextmenu.prevent="rightClick" muted controls="false"></video>
        </div>
      </div>
      <!-- </div> -->
      <!-- </div> -->
    </div>
  </imp-panel>
</template>

<script>
  /* import "../../../static/js/sow-v1.1.0.min.js";
   //引入控制层
   // import "@/assets/js/cow-v1.0.0.js"
   import "../../../static/js/cow-v1.1.1.min.js"
   import "../../../static/js/touch.min.js"*/
  import $ from 'jquery'
  //阻止浏览器拖动
  document.ontouchstart = function () {

  }
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, { passive: false });
  export default {
    data() {
      return {
        videoPageButton: false,
        buttonHide: 1,
        mainHeight: 720,
        mainWidth: 0,
        videoWidth: 0,
        videoHeight: 720,
        code: 0,
        buttonTitile: "多屏模式",

        timer: null,
        //定义全局变量
        _maxMagnification: null,
        _maxMagnification2: null,
        _maxMagnification3: null,
        _maxMagnification4: null,
        isResourceManaged: null,

        sow1: null,
        sow2: null,
        sow3: null,
        sow4: null,

        videoPc1: null,
        videoPc2: null,
        videoPc3: null,
        videoPc4: null,

        websocketUrlLibrary: null,
        controlUrlLibrary: null,

        websocketUrlLibrary2: null,
        controlUrl2Library: null,

        websocketUrlLibrary3: null,
        controlUrlLibrary3: null,

        websocketUrlLibrary4: null,
        controlUrlLibrary4: null,

        sceneId: "",
        resolution: "3840x2160",


        clientId: this.uuid(),
        controlUrl: "",
        wsStreamUrl: "",
        token: "",

        clientId2: this.uuid(),
        controlUrl2: "",
        wsStreamUrl2: "",
        token2: "",

        clientId3: this.uuid(),
        controlUrl3: "",
        wsStreamUrl3: "",
        token3: "",

        clientId4: this.uuid(),
        controlUrl4: "",
        wsStreamUrl4: "",
        token4: "",

        scenesId: null,
        defaultScenarioId: null,
        webDataarr: [],
        res : {
          "data": {
            "data": {
              "name": "场景管理",
              "url": "/video",
              "icon": "icon-camrecorder",
              "isResourceManaged": true,
              "resourceManage": {
                "videoPageButton": true,
                "getResourceListUrl": "http://192.168.0.107:8085/resourcelist",
                "getResourceUrl": "http://192.168.0.107:8085/resource",
                "mainResolution": "3840x2160",
                "nextResolution": "1280x720"
              },
              "maxMagnification": 40,

              "logoPath": "./img/avatars/logo.png"
            },
            "loginData": [{
              "username": "zhkj",
              "password": "zhkj2501"
            }, {
              "username": "admin",
              "password": "12345"
            }]
          }
        }
      };
    },
    // 组件销毁 生命周期
    beforeDestroy() {
      this.videoPc1.closeControl();
      if (this.webDataarr.length > 0) {
        for (let i = 0; i < this.webDataarr.length; i++) {
          this.webDataarr[i].videoPc.closeControl();
          this.webDataarr[i].sowWeb.closeWs();
          this.webDataarr[i].ele.pause();
          window.URL.revokeObjectURL(this.webDataarr[i].ele.src);
          this.webDataarr[i].sowWeb.destroy();
        }
      }
      this.sow1.closeWs();
      this.$refs.video.pause();
      window.URL.revokeObjectURL(this.$refs.video.src);
      this.sow1.destroy();
    },
    mounted() {
      this.scenesId = 0;
      this.defaultScenarioId = 0;
      this.getData();
    },
    // 初始化数据
    created() {
      // 设置video及video父元素的宽度高度
      this.getVideo();
    },
    //监听路由id参数变化
    watch: {
      '$route'(to, from) { //监听路由是否变化
        this.videoPc1.closeControl();
        if (this.webDataarr.length > 0) {
          for (let i = 0; i < this.webDataarr.length; i++) {
            this.webDataarr[i].videoPc.closeControl();
            this.webDataarr[i].sowWeb.closeWs();
            this.webDataarr[i].ele.pause();
            window.URL.revokeObjectURL(this.webDataarr[i].ele.src);
            this.webDataarr[i].sowWeb.destroy();
          }
        }
        this.sow1.closeWs();
        this.$refs.video.pause();
        window.URL.revokeObjectURL(this.$refs.video.src);
        this.sow1.destroy();

        this.scenesId = this.$route.params.id;
        this.defaultScenarioId = this.$route.params.id;
        document.getElementById("video-main2").style.display = "none";
        document.getElementById("video-main3").style.display = "none";
        document.getElementById("video-main4").style.display = "none";
        this.code = 0;
        this.buttonTitile = "多屏模式";
        this.getData();
      }

    },
    methods: {
      // 获取视频流信息及控制层信息内容
      getData() {
        let res=this.res;
        let that = this;
        let video = document.getElementById("video");
        // config文件中获取视频缩放最大值 _maxMagnification
        that._maxMagnification = res.data.data.maxMagnification;
        that._maxMagnification2 = res.data.data.maxMagnification;
        that._maxMagnification3 = res.data.data.maxMagnification;
        that._maxMagnification4 = res.data.data.maxMagnification;
        // config文件中获取是否接入资源管理的控制
        that.isResourceManaged = res.data.data.isResourceManaged;
        //判断是否需要连接资源管理库 isResourceManaged = true 连接
        if (this.isResourceManaged == true) {
          // 接入资源管理的情况下config文件中获取资源列表信息
          that.AccessToResources = res.data.data.resourceManage.getResourceListUrl;
          that.ApplicationResources = res.data.data.resourceManage.getResourceUrl;
          // 获取对应的多屏按钮是否显示
          that.videoPageButton = res.data.data.resourceManage.videoPageButton;
          // 请求资源列别获取信息内容
          that.$http.get(that.AccessToResources).then(resp => {
            // 判断系统是否为win7系统
            that.sceneId = resp.data.msgData.scenes[this.scenesId].sceneId;
            if (that.getOsInfo().version == "Windows 7") {
              // 如果为win 7 判断他的主分辨率是否比1280分辨率小
              if (Number(res.data.data.resourceManage.mainResolution.slice(0, res.data.data.resourceManage.mainResolution.indexOf('x'))) >= 1280) {
                that.resolution = "1280x720"
              } else {
                that.resolution = res.data.data.resourceManage.mainResolution;
              }
            } else {
              // 不是win7 系统进行分辨率赋值
              if (resp.data.msgData.scenes[this.scenesId].resolutions.indexOf("3840x2160") != -1 && res.data.data.resourceManage.mainResolution == "3840x2160") {
                that.resolution = "3840x2160";
              } else {
                let resolutionString = res.data.data.resourceManage.mainResolution;
                let resolutionArr = [];
                for (let i = 0; i < resp.data.msgData.scenes[this.scenesId].resolutions.length; i++) {
                  if (Number(resolutionString.slice(0, resolutionString.indexOf('x'))) > Number(resp.data.msgData.scenes[this.scenesId].resolutions[i].slice(0, resp.data.msgData.scenes[this.scenesId].resolutions[i].indexOf('x')))) {
                    resolutionArr.push(resp.data.msgData.scenes[this.scenesId].resolutions[i])
                  }
                }
                that.resolution = resolutionArr[0]
              }
            }
            // 获取资源视频流信息接控制地址
            $.ajax({
              type: 'POST',
              url: that.ApplicationResources,
              dataType: 'json',
              data: JSON.stringify({
                "clientId": that.clientId,
                "msgData": {
                  "sceneId": that.sceneId,
                  "resolution": that.resolution,
                  "control": "desired",
                  "streamType": "ws"
                }
              }),
              async: false,
              success: function (res) {
                that.controlUrl = res.msgData.controlUrl;
                that.token = res.msgData.token;
                that.wsStreamUrl = res.msgData.wsStreamUrl;
                // 显示video视频显示
                if (Sow.isSupported()) {
                  that.sow1 = new Sow();
                  that.sow1.attachData(video, that.wsStreamUrl);

                } else {
                  that.$message.error('浏览器暂不支持此视频播放!');
                }
                // 连接控制层sdk 传入参数进行控制（video ，控制层websocket地址，_maxMagnification，clientid）
                that.videoPc1 = new Cow(video, that.controlUrl + "?token=" + that.token + "&clientId=" + that.clientId, that._maxMagnification, that.clientId)
              }
            })
          })
        }
      },
      // 多屏单屏切换按钮
      moreScreenMode() {
        let res=this.res;
        this.code += 1;
        this.videoPc1.closeControl();
        // 声明that = this 防止在函数中this指向改变
        var that = this;
        this.clientId = this.uuid();

        if (this.isResourceManaged == true) {
          $.ajax({
            type: 'POST',
            url: that.ApplicationResources,
            dataType: 'json',
            data: JSON.stringify({
              "clientId": that.clientId,
              "msgData": {
                "sceneId": that.sceneId,
                "resolution": that.resolution,
                "control": "desired",
                "streamType": "ws"
              }
            }),
            async: false,
            success: function (res) {
              that.controlUrl = res.msgData.controlUrl;
              that.token = res.msgData.token;
              that.wsStreamUrl = res.msgData.wsStreamUrl;
              that.videoPc1 = new Cow(video, that.controlUrl + "?token=" + that.token + "&clientId=" + that.clientId, that._maxMagnification, that.clientId)
            }
          })
        }
        // code = 1 为多屏模式
        if (this.code == 1) {
          document.getElementById("video-main2").style.display = "inline-block";
          document.getElementById("video-main3").style.display = "inline-block";
          document.getElementById("video-main4").style.display = "inline-block";
          this.buttonTitile = "单屏模式";
          console.log(res)
          // ele：元素的id，
          //sowWeb：显示声明变量，
          //videoPc：控制声明变量，
          //websocketUrlLibrary：显示websocket地址（不接入资源管理需传入），
          //controlUrlLibrary：控制websocket地址（不接入资源管理需传入）
          //clientId：唯一标识，
          //_maxMagnification：视频缩放大小
          this.webDataarr = [
            { 'ele': video2, "sowWeb": this.sow2, "videoPc": this.videoPc2, "websocketUrlLibrary": this.websocketUrlLibrary2, "controlUrlLibrary": this.controlUrlLibrary2, "clientId": this.clientId2, "_maxMagnification": this._maxMagnification2 },
            { 'ele': video3, "sowWeb": this.sow3, "videoPc": this.videoPc3, "websocketUrlLibrary": this.websocketUrlLibrary3, "controlUrlLibrary": this.controlUrlLibrary3, "clientId": this.clientId3, "_maxMagnification": this._maxMagnification3 },
            { 'ele': video4, "sowWeb": this.sow4, "videoPc": this.videoPc4, "websocketUrlLibrary": this.websocketUrlLibrary4, "controlUrlLibrary": this.controlUrlLibrary4, "clientId": this.clientId4, "_maxMagnification": this._maxMagnification4 }
          ]
          // 调用多屏显示连接websocket
          this.setWebsocketData(res)

        }
        // code = 2 为多屏模式
        if (this.code == 2) {
          this.code = 0;
          // 单凭模式下其他三个video进行隐藏处理
          document.getElementById("video-main2").style.display = "none";
          document.getElementById("video-main3").style.display = "none";
          document.getElementById("video-main4").style.display = "none";
          this.buttonTitile = "多屏模式";
          for (let i = 0; i < this.webDataarr.length; i++) {
            this.webDataarr[i].videoPc.closeControl();
            this.webDataarr[i].sowWeb.closeWs();
            this.webDataarr[i].ele.pause();
            window.URL.revokeObjectURL(this.webDataarr[i].ele.src);
            this.webDataarr[i].sowWeb.destroy();
          }
        }
      },
      //
      setWebsocketData(res) {
        var that = this;
        for (let i = 0; i < this.webDataarr.length; i++) {
          let sceneId2, resolution2, wsStreamUrl2, controlUrl2, token2;
          if (this.isResourceManaged == true) {
            this.$http.get(res.data.data.resourceManage.getResourceListUrl).then(resp => {
              sceneId2 = resp.data.msgData.scenes[this.scenesId].sceneId;
              //判断是否为win7系统
              if (that.getOsInfo().version == "Windows 7") {
                // 如果为win 7 判断他的主分辨率是否比1280分辨率小
                if (Number(res.data.data.resourceManage.nextResolution.slice(0, res.data.data.resourceManage.nextResolution.indexOf('x'))) >= 1280) {
                  that.resolution2 = "1280x720"
                } else {
                  that.resolution2 = res.data.data.resourceManage.nextResolution;
                }
              } else {
                // 不是win 7 系统
                if (resp.data.msgData.scenes[this.scenesId].resolutions.indexOf("3840x2160") != -1 && that.resolution == "3840x2160") {
                  if (resp.data.msgData.scenes[this.scenesId].resolutions.indexOf(res.data.data.resourceManage.nextResolution) != -1) {
                    resolution2 = res.data.data.resourceManage.nextResolution;
                  } else {
                    resolution2 = resp.data.msgData.scenes[this.scenesId].resolutions.pop();
                  }
                } else {
                  resolution2 = resp.data.msgData.scenes[this.scenesId].resolutions.pop();
                }
              }

              $.ajax({
                type: 'POST',
                url: res.data.data.resourceManage.getResourceUrl,
                dataType: 'json',
                data: JSON.stringify({
                  "clientId": this.webDataarr[i].clientId,
                  "msgData": {
                    "sceneId": sceneId2,
                    "resolution": resolution2,
                    "control": "desired+degradable",
                    "streamType": "ws"
                  }
                }),
                async: false,
                success: resdata => {
                  controlUrl2 = resdata.msgData.controlUrl;
                  token2 = resdata.msgData.token;
                  wsStreamUrl2 = resdata.msgData.wsStreamUrl;
                  if (Sow.isSupported()) {
                    this.webDataarr[i].sowWeb = new Sow();
                    this.webDataarr[i].sowWeb.attachData(this.webDataarr[i].ele, wsStreamUrl2);
                  } else {
                    that.$message.error('浏览器暂不支持此视频播放!');
                  }
                  this.webDataarr[i].videoPc = new Cow(this.webDataarr[i].ele, controlUrl2 + "?token=" + token2 + "&clientId=" + this.webDataarr[i].clientId, this.webDataarr[i]._maxMagnification, this.webDataarr[i].clientId)
                }
              })

            })
          }
        }

      },
      // 设置video及父元素宽高
      getVideo() {
        let that = this
        this.$nextTick(() => {
          that.timer = setInterval(() => {
            let sUserAgent = navigator.userAgent.toLowerCase();
            console.log(document.getElementsByClassName("box")[0].clientWidth)
            if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
              // 移动设备
              if (this.code == 4 || this.code == 0) {
                this.mainWidth = (document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 60 + 'px';
                this.mainHeight = (document.getElementsByClassName("box")[0].clientWidth - 60) * 9 / 16 + 'px';

                this.videoHeight = (document.getElementsByClassName("box")[0].clientWidth - 60) * 9 / 16;
                this.videoWidth = (document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 60;

              } else {
                this.mainWidth = ((document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 80) / 2 + 'px';
                this.mainHeight = (document.getElementsByClassName("box")[0].clientWidth - 80) / 2 * 9 / 16 + 'px';

                this.videoWidth = ((document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 80) / 2
                this.videoHeight = (document.getElementsByClassName("box")[0].clientWidth - 80) / 2 * 9 / 16;
              }
            } else {
              if (this.code == 4 || this.code == 0) {
                this.mainWidth = (document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 620 + 'px';
                this.mainHeight = (document.getElementsByClassName("box")[0].clientWidth - 620) * 9 / 16 + 'px';

                this.videoHeight = (document.getElementsByClassName("box")[0].clientWidth - 620) * 9 / 16;
                this.videoWidth = (document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 620;

              } else {
                this.mainWidth = ((document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 420) / 2 + 'px';
                this.mainHeight = (document.getElementsByClassName("box")[0].clientWidth - 420) / 2 * 9 / 16 + 'px';

                this.videoWidth = ((document.getElementsByClassName("box")[0].clientWidth || document.getElementsByClassName("box")[0].offsetWidth) - 420) / 2
                this.videoHeight = (document.getElementsByClassName("box")[0].clientWidth - 420) / 2 * 9 / 16;
              }
            }
          }, 200)

        })
      },
      // 获取操作系统信息
      getOsInfo() {
        var userAgent = navigator.userAgent.toLowerCase();
        var name = 'Unknown';
        var version = 'Unknown';
        if (userAgent.indexOf('win') > -1) {
          name = 'Windows';
          if (userAgent.indexOf('windows nt 5.0') > -1) {
            version = 'Windows 2000';
          } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
            version = 'Windows XP';
          } else if (userAgent.indexOf('windows nt 6.0') > -1) {
            version = 'Windows Vista';
          } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
            version = 'Windows 7';
          } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
            version = 'Windows 8';
          } else if (userAgent.indexOf('windows nt 6.3') > -1) {
            version = 'Windows 8.1';
          } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
            version = 'Windows 10';
          } else {
            version = 'Unknown';
          }
        } else if (userAgent.indexOf('iphone') > -1) {
          name = 'Iphone';
        } else if (userAgent.indexOf('mac') > -1) {
          name = 'Mac';
        } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
          name = 'Unix';
        } else if (userAgent.indexOf('linux') > -1) {
          if (userAgent.indexOf('android') > -1) {
            name = 'Android';
          } else {
            name = 'Linux';
          }
        } else {
          name = 'Unknown';
        }
        return { name, version };
      },
      // 右击事件  屏蔽右击事件出现显示控件
      rightClick() {

      },
      //获取clientid
      uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
      }

    }
  };
</script>
<style scoped>
  video {
    object-fit: fill;
  }
  video::-webkit-media-controls-enclosure {
    display: none !important;
  }
  video::-webkit-media-controls {
    display: none !important;
  }
  #video-main,
  #video-main2,
  #video-main3,
  #video-main4 {
    display: none;
    position: relative;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
  }
  #video-main {
    display: inline-block;
  }
  #video-main,
  #video-main3 {
    margin-right: 20px;
  }

  #video-main,
  #video-main2 {
    margin-bottom: 50px;
  }
</style>
