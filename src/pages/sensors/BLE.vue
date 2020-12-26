<template>
  <imp-panel>
    <h3  style="width: 100%; margin-bottom: 10px">
    BLE-001
    </h3>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <el-card shadow="hover" class="mgb20">
          <div ref="dom1" :style="{ height: '250px'}"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="mgb20">
          <div ref="dom2" :style="{ height: '250px'}"></div>
        </el-card>
      </el-col>
    </el-row>
    <h3  style="width: 100%; margin-bottom: 10px; margin-top: 20px">
      BLE-002
    </h3>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <el-card shadow="hover" class="mgb20">
          <div ref="dom3" :style="{ height: '300px'}"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="mgb20">
          <div ref="dom4" :style="{ height: '300px'}"></div>
        </el-card>
      </el-col>
    </el-row>
  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  import echarts from 'echarts'
  import tdTheme from '../../components/charts/theme.json'
  import {on, off} from '../../common/tools'

  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    data() {
      return {
        msg: '--',
        websocket: {},
        dom1: null,
        dom2: null,
        dom3: null,
        dom4: null,
        amp1: [],
        pow1: [],
        avg1: [],
        mas1: [],
        amp2: [],
        pow2: [],
        avg2: [],
        mas2: [],
        option1: [],
        option2: [],

      };
    },
    methods: {
      websocketOnMessage(e) {
        this.msg = e.data;
        let sensor1 = JSON.parse(this.msg).A
        let sensor2 = JSON.parse(this.msg).B
        this.amp1 = sensor1.amp.split("\t")
        this.pow1 = sensor1.pow.split("\t")
        this.avg1 = sensor1.avg.split("\t")
        this.mas1 = sensor1.mas.split("\t")
        this.amp2 = sensor2.amp.split("\t")
        this.pow2 = sensor2.pow.split("\t")
        this.avg2 = sensor2.avg.split("\t")
        this.mas2 = sensor2.mas.split("\t")
        this.option1.series[0].data=this.amp1
        this.option1.series[1].data=this.pow1
        this.option1.series[2].data=this.avg1
        this.option2.series[0].data=this.mas1
        this.dom1.setOption(this.option1, true)
        this.dom2.setOption(this.option2, true)

        this.option1.series[0].data=this.amp2
        this.option1.series[1].data=this.pow2
        this.option1.series[2].data=this.avg2
        this.option2.series[0].data=this.mas2
        this.dom3.setOption(this.option1, true)
        this.dom4.setOption(this.option2, true)
        on(window, 'resize', this.resize)
        /*  let amp1= JSON.parse(sensor1).amp*/
      },
      resize() {
        this.dom1.resize();
        this.dom2.resize();
         this.dom3.resize()
         this.dom4.resize()
      }
    },
    mounted() {
      //页面初始化的时候持有一个websocket对象
      this.websocket = new WebSocket(api.BLE_WEBSOCKET_URL);
      //页面刷新的时候需要关闭websocket连接
      window.addEventListener('beforeunload', e => {
        this.websocket.close();
      });
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
      this.$nextTick(() => {
        this.option1 = {
          legend: {
            data: ['幅值', '功率', '平均功率']
          },
          xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            boundaryGap: false,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '幅值',
            data: this.amp1,
            type: 'line'
          },
            {
              name: '功率',
              data: this.pow1,
              type: 'line'
            }, {
              name: '平均功率',
              data: this.avg1,
              type: 'line'
            }
          ]
        }
        this.option2 = {
          legend: {
            data: ['肌肉力度']
          },
          xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            boundaryGap: false,
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '肌肉力度',
              data: this.mas1,
              type: 'line'
            }
          ]
        }
        this.dom1 = echarts.init(this.$refs.dom1)
        this.dom1.setOption(this.option1, true)

        this.dom2 = echarts.init(this.$refs.dom2)
        this.dom2.setOption(this.option2, true)

        this.option1.series[0].data=this.amp2
        this.option1.series[1].data=this.pow2
        this.option1.series[2].data=this.avg2
        this.dom3 = echarts.init(this.$refs.dom3)
        this.dom3.setOption(this.option1, true)

        this.option2.series[0].data=this.mas2
        this.dom4 = echarts.init(this.$refs.dom4)
        this.dom4.setOption(this.option2, true)
        on(window, 'resize', this.resize)
      })
    },
    computed: {
      isCollapsed() {
        return this.$store.state.sidebar.collapsed;
      }
    },
    watch: {
      isCollapsed() {
        setTimeout(() => {
          this.resize();
        }, 400)
      }
    },
    beforeDestroy() {
      this.websocket.close();//关闭页面时关闭连接
      off(window, 'resize', this.resize)
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
