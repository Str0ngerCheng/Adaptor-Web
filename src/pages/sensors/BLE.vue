<template>
  <imp-panel>
    <div id="app">
      <p>ble收到的数据：</p>
      <p>{{this.msg}}</p>
    </div>
  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  export default {
    data(){
      return {
        msg: '--',
        websocket: {}
      };
    },
    methods:{
      websocketOnMessage(e) {
        this.msg = e.data + new Date();
        console.log("realTimeData",e);
      },
    },
    mounted() {
      //页面初始化的时候持有一个websocket对象
      this.websocket = new WebSocket(api.BLE_WEBSOCKET_URL);
      //页面刷新的时候需要关闭websocket连接
      window.addEventListener('beforeunload', e => {this.websocket.close();});
      this.websocket.onopen = () => {
        console.log("WebSocket连接成功");
      };
      this.websocket.onclose = (e) => {
        console.log("关闭WebSocket连接" + e.code);
      };
      this.websocket.onerror = (e) => {
        console.log("WebSocket连接发生错误", e);
      };
      //处理服务器发送过来的数据
      this.websocket.onmessage = this.websocketOnMessage;
    },
    beforeDestroy() {
      this.websocket.close();//关闭页面时关闭连接
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
