<template>
  <my-table :protocol="protocol"/>
</template>

<script>
  import myTable from "../../components/table/table.vue"
  import * as api from "../../api"
  export default {
    components: {
      'my-table':myTable
    },
    data(){
      return {
        protocol:'BLE'
      }
    },
    mounted() {
      //页面初始化的时候持有一个websocket对象
      this.websocket = new WebSocket(api.SENSOR_WEBSOCKET_URL);
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
      //设置定时器
      let _this = this;
      this.timer = setInterval(function(){
        _this.date = _this .handleDateFormat(new Date())
      },1000);
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
