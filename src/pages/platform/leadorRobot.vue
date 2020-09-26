<template>
  <imp-panel>
    <div id="app">
      <p>mqtt收到的数据：</p>
      <p>{{this.msg}}</p>
    </div>
  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  export default {
    name: 'leadorRobot',
    data() {
      return {
        msg: '--',
        websocket: {}
      };
    },
    created() {
      this.mqttMsg()
    },
    methods: {
      mqttMsg() {
        // 接收消息
      },
      websocketOnMessage(e) {
        this.msg = e.data;
        console.log("realTimeData",e);
      },
    },
    mounted() {
      //页面初始化的时候持有一个websocket对象
      this.websocket = new WebSocket(api.ROBOT_WEBSOCKET_URL);
      //页面刷新的时候需要关闭websocket连接
      window.addEventListener('beforeunload', e => {
        this.websocket.close();
      });
      this.websocket.onopen = () => {
        console.log("测量机器人: WebSocket连接成功");
        this.websocket.send("connect start");
      };
      this.websocket.onclose = (e) => {
        console.log("测量机器人: 关闭WebSocket连接" + e.code);
      };
      this.websocket.onerror = (e) => {
        console.log("测量机器人: WebSocket连接发生错误", e);
      };
      //处理服务器发送过来的数据
      this.websocket.onmessage = this.websocketOnMessage;
    },
    beforeDestroy() {
      this.websocket.close();//关闭页面时关闭连接
    }
  }

</script>

<style scoped>

</style>
