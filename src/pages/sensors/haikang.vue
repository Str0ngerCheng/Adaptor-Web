<template>
  <imp-panel>
    <div id="videoPlayerBox" ref="videoPlayerBox"
         :style="{'width': '100%', 'height': height + 'px', 'top': top + 'px', 'left': left + 'px'}">
      <div class="header">
        <div class="el-dialog__title" @mousedown="onmousedown" @mouseleave="onmouseleave">
          <!-- {{ monitorDeviceName }} -->
          监控点
        </div>
        <span class="closeBtn" @click="handleClose">×</span>
      </div>
      <div class="topbutton">
        <span class="topBtns" :class="playMode === 0 ? 'activeBtn' : ''" @click="previewClick">预览</span>
        <span class="topBtns" :class="playMode === 1 ? 'activeBtn' : ''" @click="playBack">回放</span>
      </div>
      <div id="playBox" v-html="oWebControl === null ? playText : ''">
      </div>
    </div>
  </imp-panel>
</template>

<script>
  export default {
    name: 'haikang',
    props: [
      'videoVisible',
      'monitorDeviceNo',
      'monitorDeviceName'
    ],
    data() {
      return {
        oWebControl: null,
        pubKey: '', // 公钥
        appkey: '',
        secret: '',
        ip: '202.114.118.60',
        port: '7781',
        width: 700,
        height: 400, // 弹框高度
        playHeight: 360,
        layout: '1x1',
        left: '',
        top: '',
        buttonIDs: '0,16,256,257,515',
        initCount: 0,
        playMode: 0, // 0 预览 1回放
        playText: '启动中...',
        cameraIndexCode: this.monitorDeviceNo || '' // 监控点编号
      }
    },
    methods: {
      handleClose() {
        if (this.oWebControl) {
          this.oWebControl.JS_RequestInterface({
            funcName: "stopAllPreview"
          });
          this.oWebControl.JS_HideWnd();
          this.oWebControl.JS_Disconnect().then(
            () => {  // 断开与插件服务连接成功
            },
            () => {  // 断开与插件服务连接失败
            });
          this.oWebControl = null;
        }
        this.$emit('close');
      },
      // 推送消息
      cbIntegrationCallBack(oData) {
        console.log(oData, '推送消息');
      },
      // RSA加密
      setEncrypt (value) {
        /* eslint-disable */
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.pubKey);
        return encrypt.encrypt(value);
      },
      initPlugin(callback) {
        /* eslint-disable */
        let that = this;
        this.oWebControl = new WebControl({
          szPluginContainer: "playBox",                       // 指定容器id
          iServicePortStart: 15900,                           // 指定起止端口号，建议使用该值
          iServicePortEnd: 15909,
          szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",  // 用于IE10使用ActiveX的clsid
          cbConnectSuccess: function () {                     // 创建WebControl实例成功
            that.oWebControl.JS_StartService("window", {      // WebControl实例创建成功后需要启动服务
              dllPath: "./VideoPluginConnect.dll"             // 值"./VideoPluginConnect.dll"写死
            }).then(function () {                             // 启动插件服务成功
              that.oWebControl.JS_SetWindowControlCallback({  // 设置消息回调
                cbIntegrationCallBack: that.cbIntegrationCallBack
              });

              that.oWebControl.JS_CreateWnd("playBox", that.width, that.playHeight).then(function () { // JS_CreateWnd创建视频播放窗口，宽高可设定
                that.init(callback);  // 创建播放实例成功后初始化
              });
            }, function () { // 启动插件服务失败
            });
          },
          cbConnectError: function () { // 创建WebControl实例失败
            that.oWebControl = null;
            that.playText = '插件未启动，正在尝试启动，请稍候...';
            WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
            that.initCount++;
            if (that.initCount < 3) {
              setTimeout(function () {
                that.initPlugin();
              }, 3000)
            } else {
              that.playText = '插件启动失败，请检查插件是否安装！<a target="_blank" style="color: #30a8ff;text-decoration: underline;" href="http://xx.com/VideoWebPlugin.zip">下载地址(软件大小：62.7MB)</a>';
            }
          },
          cbConnectClose: function (bNormalClose) {
            // 异常断开：bNormalClose = false
            // JS_Disconnect正常断开：bNormalClose = true
            console.log("cbConnectClose");
            that.oWebControl = null;
          }
        });
      },
      // 获取公钥
      getPubKey (callback) {
        this.oWebControl.JS_RequestInterface({
          funcName: "getRSAPubKey",
          argument: JSON.stringify({
            keyLength: 1024
          })
        }).then((oData) => {
          if (oData.responseMsg.data) {
            this.pubKey = oData.responseMsg.data;
            callback()
          }
        })
      },
      init(callback) {
        let that = this;
        this.getPubKey(() => {
          //  请自行修改以下变量值
          let appkey = this.appkey;                           // 综合安防管理平台提供的appkey，必填
          let secret = that.setEncrypt(this.secret);// 综合安防管理平台提供的secret，必填
          let ip = this.ip;                           // 综合安防管理平台IP地址，必填
          let playMode = this.playMode;                                  // 初始播放模式：0-预览，1-回放
          let port = 443;                                    // 综合安防管理平台端口，若启用HTTPS协议，默认443
          let snapDir = "D:\\SnapDir";                       // 抓图存储路径
          let videoDir = "D:\\VideoDir";                     // 紧急录像或录像剪辑存储路径
          let layout = this.layout;                          // playMode指定模式的布局
          let enableHTTPS = 1;                               // 是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
          let encryptedFields = 'secret';					   				 // 加密字段，默认加密领域为secret
          let showToolbar = 1;                               // 是否显示工具栏，0-不显示，非0-显示
          let showSmart = 1;                                 // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
          let buttonIDs = this.buttonIDs;                    // 自定义工具条按钮
          // /// 请自行修改以上变量值
          that.oWebControl.JS_RequestInterface({
            funcName: "init",
            argument: JSON.stringify({
              appkey: appkey,                            // API网关提供的appkey
              secret: secret,                            // API网关提供的secret
              ip: ip,                                    // API网关IP地址
              playMode: playMode,                        // 播放模式（决定显示预览还是回放界面）
              port: port,                                // 端口
              snapDir: snapDir,                          // 抓图存储路径
              videoDir: videoDir,                        // 紧急录像或录像剪辑存储路径
              layout: layout,                            // 布局
              enableHTTPS: enableHTTPS,                  // 是否启用HTTPS协议
              encryptedFields: encryptedFields,          // 加密字段
              showToolbar: showToolbar,                  // 是否显示工具栏
              showSmart: showSmart,                      // 是否显示智能信息
              buttonIDs: buttonIDs                       // 自定义工具条按钮
            })
          }).then((oData) => {
            that.oWebControl.JS_Resize(that.width, that.playHeight);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            if (callback) {
              callback();
            }
          });
        });
      },
      // 视频预览功能
      previewClick() {
        if (!this.oWebControl) {
          return;
        }
        // 如果是回放，重新初始化
        if (this.playMode === 1) {
          this.playMode = 0;
          this.oWebControl.JS_HideWnd();
          this.initPlugin(() => {
            this.previewVideo();
          });

        } else if (this.playMode === 0) {
          this.previewVideo();
        }
      },
      previewVideo() {
        let cameraIndexCode = this.cameraIndexCode;             // 获取输入的监控点编号值，必填
        let streamMode = 0;                                     // 主子码流标识：0-主码流，1-子码流
        let transMode = 0;                                      // 传输协议：0-UDP，1-TCP
        let gpuMode = 0;                                        // 是否启用GPU硬解，0-不启用，1-启用
        let wndId = -1;                                         // 播放窗口序号（在2x2以上布局下可指定播放窗口）

        this.oWebControl.JS_RequestInterface({
          funcName: "startPreview",
          argument: JSON.stringify({
            cameraIndexCode: cameraIndexCode.trim(),        // 监控点编号
            streamMode: streamMode,                         // 主子码流标识
            transMode: transMode,                           // 传输协议
            gpuMode: gpuMode,                               // 是否开启GPU硬解
            wndId: wndId                                    // 可指定播放窗口
          })
        })
      },
      // 回放
      playBack() {
        if (!this.oWebControl) {
          return;
        }
        // 如果是预览
        if (this.playMode === 0) {
          this.playMode = 1;
          this.oWebControl.JS_HideWnd();
          this.initPlugin(() => {
            this.backVideo();
          });
        } else if (this.playMode === 1) {
          this.backVideo();
        }
      },
      backVideo() {
        let cameraIndexCode = this.cameraIndexCode;
        // 前30天
        let date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        let month = date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth()+ 1);
        // 开始时间当天00点
        let str = date.getFullYear() + '/' + month + '/' + date.getDate() + ' 00:00:00'
        let startTime = String(parseInt(new Date(str).getTime() / 1000) -  3 * 60 * 60);
        let endTime = String(parseInt(date.getTime() / 1000));
        this.oWebControl.JS_RequestInterface({
          funcName: "startPlayback",
          argument: JSON.stringify({
            cameraIndexCode: cameraIndexCode.trim(), // 监控点编号
            startTimeStamp: startTime, // 录像查询开始时间戳，单位：秒
            endTimeStamp: endTime, // 录像查询结束时间戳，单位：秒
            recordLocation: 1, // 录像存储类型 0-中心存储 1-设备存储
            transMode: 0, // 传输协议 ，0-UDP 1-TCP
            gpuMode: 0, // 是否开启 GPU 硬解，0-不开启 1-开启
            wndId: -1                         //可指定播放窗口
          })
        });
      },
      // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
      setWndCover() {
        let iWidth = $(window).width();
        let iHeight = $(window).height();
        let oDivRect = $("#playBox").get(0).getBoundingClientRect();
        let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
        let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
        let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
        let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = (iCoverLeft > this.width) ? this.width : iCoverLeft;
        iCoverTop = (iCoverTop > this.playHeight) ? this.playHeight : iCoverTop;
        iCoverRight = (iCoverRight > this.width) ? this.width : iCoverRight;
        iCoverBottom = (iCoverBottom > this.playHeight) ? this.playHeight : iCoverBottom;

        this.oWebControl.JS_RepairPartWindow(0, 0, (this.width + 1), this.playHeight);    // 多1个像素点防止还原后边界缺失一个像素条
        if (iCoverLeft != 0) {
          this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, this.playHeight);
        }
        if (iCoverTop != 0) {
          this.oWebControl.JS_CuttingPartWindow(0, 0, (this.width + 1), iCoverTop);    // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
        }
        if (iCoverRight != 0) {
          this.oWebControl.JS_CuttingPartWindow(this.width - iCoverRight, 0, iCoverRight, this.playHeight);
        }
        if (iCoverBottom != 0) {
          this.oWebControl.JS_CuttingPartWindow(0, this.playHeight - iCoverBottom, this.width, iCoverBottom);
        }
      },
      // 拖拽窗口
      onmousedown (e) {
        let that = this;
        let cWidth = document.body.clientWidth;
        let cHeight = document.body.clientHeight;
        this.$refs.videoPlayerBox.onmousemove = function (el) {
          let ev = el || window.event;
          ev.preventDefault();
          // 解决点击标题窗口抖动的问题
          if (Math.abs(ev.movementX) === 0 && Math.abs(ev.movementY) === 0) {
            return;
          }
          that.left += ev.movementX;
          that.top += ev.movementY;
          // 顶部不能超出，左侧、右侧、底部可以超出一半
          if (that.top < 0) {
            that.top = 0;
          }
          if (that.top > (cHeight - that.height / 2)) {
            that.top = cHeight - that.height / 2;
          }
          if (that.left < -that.width / 2) {
            that.left = -that.width / 2;
          }
          if (that.left > (cWidth - that.width / 2)) {
            that.left = (cWidth - that.width / 2);
          }
          that.oWebControl.JS_Resize(that.width, that.playHeight);
        }
        this.$refs.videoPlayerBox.onmouseup = function () {
          this.onmousemove = null;
          this.onmouseup = null;
        }
        // 阻止默认事件
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          return false
        }
      },
      onmouseleave(e) {
        // 拖拽过快鼠标划出标题位置，重新拖拽是，鼠标还未移入标题，由于上一次的onmouseup方法没有执行，导致鼠标靠近弹框，弹框移动，解决方法，给onmousemove和onmouseup赋值为null
        this.$refs.videoPlayerBox.onmousemove = null;
        this.$refs.videoPlayerBox.onmouseup = null;
        // 解决拖拽过快，播放器残影问题
        this.oWebControl.JS_Resize(this.width, this.playHeight);
      }
    },
    mounted() {
      let hksystem = JSON.parse(sessionStorage.getItem('hksystem'));
      this.appkey = hksystem.appKey;
      this.secret = hksystem.appSecret;
      this.ip = hksystem.host.split(':')[0];
      this.port = hksystem.host.split(':')[1];
      // 设置top left
      let bodyW = document.body.clientWidth;
      let bodyH = document.body.clientHeight;
      this.left = bodyW / 2 - this.width / 2;
      this.top = bodyH / 2 - this.height / 2;

      this.initPlugin(() => {
        this.previewVideo();
      });
      // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
      $(window).resize(() => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.width, this.playHeight);
          this.setWndCover();
        }
      });

      // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
      $(window).scroll(() => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.width, this.playHeight);
          this.setWndCover();
        }
      });
      // 标签关闭
      $(window).unload(() => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
          this.oWebControl.JS_Disconnect().then(
            () => {  // 断开与插件服务连接成功
            },
            () => {  // 断开与插件服务连接失败
            }
          );
        }
      });
    },
    watch: {
      monitorDeviceNo: {
        handler(newV, oldV) {
          this.cameraIndexCode = newV;
          if (newV && this.playMode === 0) {
            this.previewVideo();
          } else if (newV && this.playMode === 1) {
            this.backVideo();
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #videoPlayerBox
    background-color #0D1F3A
    .header
      padding 10px 20px
      background-color #142C50
      position relative
      .el-dialog__title
        height 24px
        text-align center
        background-color #142C50
        color #fff
        font-size 14px
        cursor pointer
      .closeBtn
        position absolute
        top 10px
        right 10px
        padding 2px 4px
        border 1px dotted #ccc
        color #fff
        font-size 18px
        cursor pointer
        &:hover
          color #4BA2FF
    .topbutton
      height 26px
      padding-top 6px
      padding-left 14px
      background-color #0D1F3A
      cursor pointer
      .topBtns
        padding 0 12px 6px
        border-bottom 1px solid #0D1F3A
        color #fff
      .activeBtn
        color #4BA2FF
        border-color #4BA2FF
    #playBox
      width 100%
      height 360px
      color red
</style>
