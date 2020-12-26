<template>
  <imp-panel>
  <el-input
    type="textarea"
    :rows="32"
    placeholder="holder"
    v-model="textarea">
  </el-input>
  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  export default {
    name: "mavlink",
    data() {
    return {
      uavId: "DX-1",
      time_interval: 5,
      textarea: '原始报文'
    };

  },
  mounted() {
    //页面初始化的时候持有一个websocket对象
    this.websocket = new WebSocket(api.UAV_WEBSOCKET_URL);

    //页面刷新的时候需要关闭websocket连接
    window.addEventListener('beforeunload', e => { this.websocket.close(); });
    this.websocket.onopen = () => {
      console.log("WebSocket连接成功");
      this.handleRealTimeData(this.uavId, this.time_interval);
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
  methods: {
    setPlaceholder() {
    this.holder=mavlinkData;
  },

    //WebSocket部分函数
    handleRealTimeData(uavId, signal) {
      //{signal:5,uavId:"DJ-1"}
      //接收到signal=0表示客户端暂停接收数据，signal=t表示前端希望每隔ts接收到服务端发送的数据
      let jsonstr = JSON.stringify({
        signal: signal, //控制实时数据的发送间隔为1s
        uavId: uavId
      });
      this.websocket.send(jsonstr);
      this.dataId = 2;
      console.log("send message to get real time data:" + jsonstr);
    },
    closeRealTimeData() {
      //向后端发送停止的信号
      let jsonstr = JSON.stringify({
        signal: 0,
        uavId: ""
      });
      this.websocket.send(jsonstr);
      console.log("send message to stop real time data:" + jsonstr);
    },
    websocketOnMessage(e) {
      console.log(JSON.parse(e.data));
      this.textarea=this.textarea+"\n"+JSON.stringify(e.data);
      setPlaceholder();
    }

  }
  }
</script>

<style scoped>

</style>
