<template>
  <imp-panel>
    <div class="amap-page-container">
      <!--view-mode="3D" pitch="60" 3D显示-->
      <el-amap ref="map" vid="amapDemo"  :center="center" :zoom="zoom" :plugin="plugin" :events="events"
               style="height: 450px">
        <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index">
          <img @click="handleClick(index)" :src="marker.status===0?'../../../static/img/wrong.png':'../../../static/img/normal.png'"/>
        </el-amap-marker>
        <el-amap-info-window v-for="window in windows"  closeWhenClickMap="true" autoMove="true"
                             :position="window.position" :offset="window.offset" :visible="window.visible" :key="window.idx">
          <div class="info-middle">
            <h3>设备信息</h3>
            <p>设备名称：ZigBee-001</p>
            <p>设备位置：{{window.position[0]+" "+window.position[1]}}</p>
            <p>通信协议：ZigBee</p>
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
                <span @click=""><b>5</b>在线</span>
                <span><b>1</b>离线</span>
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
  import { on, off } from '../../common/tools'
  export default {
    data() {
      return {
        markers: [],
        windows:[],
        currentWindow:{
          position: [0,0],
          visible: false,
          idx: 'window-1'
        },
        center: [114.552937, 30.455473],
        zoom: 17,
        position: [114.549937, 30.455473],
        events: {
          init(o){
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
          { value: 1, name: '离线' },
          { value: 5, name: '在线' }
        ],
      }
    },
    methods:{
      handleClick(index){
        this.currentWindow.visible=false
        this.$nextTick(() => {
          this.currentWindow = this.windows[index];
          this.currentWindow.visible = true;
        });
      },
      initMap() {
        let basePosition = [114.55107, 30.455473];
        let num = 2;
        for (let i = 0 ; i < num ; i++) {
          this.markers.push({
            position: [basePosition[0], basePosition[1] + i * 0.0003],
            status:i===0?0:1,
            id: 'marker'+i
          });

          this.windows.push({
            position:[basePosition[0], basePosition[1] + i * 0.0003],
            offset: [5, -15],
            status:i===0?'离线':'在线',
            visible: false,
            idx: 'window'+i
          });
        }
      },
      resize () {
        this.dom.resize()
      },
      initChart(){
        this.$nextTick(() => {
          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}%)',
              position: 'right'
            },
            color : ['#394b69','#36ab60' ],
            series: [
              {
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                data: this.pieData,
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
      },
      testClick(){
        console.log("1111111111")
      }
    },
    created() {
      this.initMap()
      this.initChart()
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
    }
  }
</script>
<style>
  .amap-info-content {
    border-radius: 4px;

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
  .el-card.map-card.is-always-shadow{
    box-shadow:0 2px 12px 0 rgba(0,0,0,.25)
  }
  .map-card{
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.8;
  }
  .map-card .el-card__header{
    padding: 10px;
    background: #394b69;
  }

  .map-card .el-card__body{
    padding: 0;
  }

  .chart-right{
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
    text-align:center;
  }
  .chart-right span:hover {
    cursor:pointer;
  }

  .chart-right span:nth-child(1) {
    border: 3px solid  #36ab60;
    margin-right: 10px;
    margin-left: 10px;
    color:  #36ab60;
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



