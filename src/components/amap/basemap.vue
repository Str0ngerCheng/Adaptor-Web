<template>
  <imp-panel>
    <div class="amap-page-container">
      <!--view-mode="3D" pitch="60" 3D显示-->
      <el-amap ref="map" vid="amapDemo" :center="center" :zoom="zoom" :plugin="plugin" :events="events"
               style="height:800px" view-mode="3D" pitch="60">
        <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index">
          <img @click="handleClick(index)"
               :src="marker.status===0?'../../../static/img/wrong.png':'../../../static/img/normal.png'"/>
        </el-amap-marker>
        <el-amap-info-window v-for="window in windows" closeWhenClickMap="true" autoMove="true"
                             :position="window.position" :offset="window.offset" :visible="window.visible"
                             :key="window.idx">
          <div class="info-middle">
            <h3>设备信息</h3>
            <p>设备名称：{{window.name}}</p>
            <p>设备位置：{{window.position[0]+" "+window.position[1]}}</p>
            <p>通信协议：{{window.protocol}}</p>
            <p>设备状态：{{window.status}}</p>
          </div>
        </el-amap-info-window>
        <el-card shadow="always" class="map-card">
          <div slot="header">
            <span style="color: white">设备概况</span>
          </div>
          <el-row style="width: 100%;">
            <el-col :span="12">
              <div ref="dom" style="height: 160px; width: 200px" class="charts chart-pie"></div>
            </el-col>
            <el-col :span="12">
              <div class="chart-right">
                <span @click=""><b>{{this.status.online}}</b>在线</span>
                <span><b>{{this.status.offline}}</b>离线</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-amap>

    </div>


  </imp-panel>
</template>
<script>
  import echarts from 'echarts'
  import {on, off} from '../../common/tools'
  import * as api from "../../api"
  import * as sensorApi from '../../services/sensor'
  export default {
    data() {
      return {
        markers: [],
        windows: [],
        currentWindow: {
          position: [0, 0],
          visible: false,
          idx: 'window-1'
        },
        center: [114.752937, 31.455473],
        zoom: 8,
        position: [114.749937, 31.455473],
        events: {
          init(o) {
            console.log(o.getCenter());
          },
          zoomchange: (e) => {
            console.log(e);
          },
          zoomend: (e) => {
            //获取当前缩放zoom值
            console.log(this.$refs.map.$$getInstance().getZoom());
            console.log(e);
          }
        },
//使用其他组件
        plugin: [
          {
            pName: 'Scale',
            events: {
              init(instance) {
                console.log(instance)
              }
            }
          },
          {
            pName: 'ToolBar',
            events: {
              init(instance) {
                console.log(instance)
              }
            }
          }
        ],
        dom: null,
        pieData: [
          {value: this.offline, name: '离线'},
          {value: this.online, name: '在线'}
        ],
        status: {
          online: 0,
          offline: 0
        }
      }
    },
    methods: {
      handleClick(index) {
        this.currentWindow.visible = false
        this.$nextTick(() => {
          this.currentWindow = this.windows[index];
          this.currentWindow.visible = true;
        });
      },
      initMap() {
        console.log("initMap start")
        sensorApi.getAllSensors(api.ALL_SENSOR)
          .then(res => {
            console.log(res)
            for (let i = 0; i < res.total; i++) {
              if (res.records[i].status == 1) {
                this.status.online++
              } else {
                this.status.offline++
              }
              let location = res.records[i].location.split(" ")
              this.markers.push({
                position: [location[1], location[0]],
                status: res.records[i].status,
                id: "marker" + i
              });

              this.windows.push({
                name: res.records[i].sensorName,
                position: [location[1], location[0]],
                offset: [7, -18],
                status: res.records[i].status === 0 ? '离线' : '在线',
                visible: false,
                protocol: res.records[i].protocol,
                idx: "window" + i
              });
            }
            this.initChart( this.status.online, this.status.offline)
          });
      },
      resize() {
        this.dom.resize()
      },
      initChart(online, offline) {
        this.$nextTick(() => {

          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}%)',
              position: 'right'
            },
            color: ['#394b69', '#36ab60'],
            series: [
              {
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                data: [
                  {value: offline, name: '离线'},
                  {value: online, name: '在线'}
                ],
                // 设置值域的那指向线
                labelLine: {
                  normal: {
                    show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
                  }
                },
                // 设置值域的标签
                label: {
                  normal: {
                    position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                    formatter: '{b}'
                  }
                }
              }
            ]
          }
          this.dom = echarts.init(this.$refs.dom)
          this.dom.setOption(option)
          on(window, 'resize', this.resize)

        })
      }
    },
    created() {
      this.initMap()
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
<style>
  .amap-info-content {
    border-radius: 4px;
   /* padding: 10px;*/

  }

  .info-middle {
    font-size: 12px;
    padding: 5px;
    line-height: 20px;
  }

  .info-middle h3 {
    height: 2rem;
    color: rgb(45, 140, 240);
  }

  .info-middle p {
    height: 1.5rem;
  }

  .el-card.map-card.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .25)
  }

  .map-card {
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.8;
  }

  .map-card .el-card__header {
    padding: 10px;
    background: #394b69;
  }

  .map-card .el-card__body {
    padding: 0;
  }

  .chart-right {
    right: 10%;
    position: relative;
  }

  .chart-right span {
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    margin-top: 36px;
    line-height: 80px;
    text-align: center;
  }

  .chart-right span:hover {
    cursor: pointer;
  }

  .chart-right span:nth-child(1) {
    border: 3px solid #36ab60;
    margin-right: 10px;
    margin-left: 10px;
    color: #36ab60;
  }

  .chart-right span:nth-child(2) {
    border: 3px solid #394b69;
    color: #394b69;
  }

  .chart-right span b {
    font-size: 32px;
    font-weight: 400;
  }


</style>



