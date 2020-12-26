<template>
  <imp-panel>
    <div>
      <div id="app">
        <div id="cesiumContainer"></div>
      </div>
      <div>
        <el-row>
          <el-col :span="12">
            <el-table :data="tableData1" ref="multipleTable">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="index" label="无人机ID"></el-table-column>
              <el-table-column prop="lon" label="经度"></el-table-column>
              <el-table-column prop="lat" label="纬度"></el-table-column>
              <el-table-column prop="alt" label="高程"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="6">
            <el-table :data="tableData2" ref="multipleTable">
              <el-table-column prop="groundspeed" label="地速"></el-table-column>
              <el-table-column prop="airspeed" label="空速"></el-table-column>
              <el-table-column prop="heading" label="航向"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="6">
            <el-table :data="tableData3" ref="multipleTable">
              <el-table-column prop="batteryRemaining" label="剩余电量"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </imp-panel>
</template>
<script>
  import * as Cesium from 'cesium/Cesium';
  import * as api from "../../api"
  import 'cesium/Widgets/widgets.css'
  export default {
    name: 'CesiumView',
    data() {
      return {
        viewer: null,
        dataId: 0,
        uavId: "DX-1",
        time_interval: 1,
        tableData1: [{
          selection: '1',
          index: 'DX-1',
          lon: 0,
          lat: 0,
          alt: 0
        }],
        tableData2: [{
          groundspeed: 0,
          airspeed: 0,
          heading: 0
        }],
        tableData3: [{
          batteryRemaining: 100
        }]

      };

    },
    mounted() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZjQ1MGFlNC0zYmRmLTRhM2ItYTk5Yi0wYzc2NGUyYzFmOGUiLCJpZCI6MzQ3MTQsImlhdCI6MTYwMDc1MTI0M30.-p92mI1ZHfCunAMeiKVswBH58XtV-CcYCYpnlxd-1J0'
      let viewerOption = {
        shouldAnimate: true,
        animation: true, // 控制场景动画的播放速度控件
        baseLayerPicker: true, // 底图切换控件
        fullscreenButton: false, // 全屏控件
        geocoder: true, // 地理位置查询定位控件
        homeButton: true, // 默认相机位置控件
        timeline: true, // 时间滚动条控件
        infoBox: true, //是否显示信息框
        sceneModePicker: true, //是否显示3D/2D选择器
        selectionIndicator: true, // 点击点绿色弹出 是否显示选取指示器组件
        sceneMode: Cesium.SceneMode.SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
        navigationHelpButton: false, // 默认的相机控制提示控件
        scene3DOnly: false, // 每个几何实例仅以3D渲染以节省GPU内存
        navigationInstructionsInitiallyVisible: false,
        showRenderLoopErrors: false, //是否显示渲染错误
        orderIndependentTranslucency: false //设置背景透明
      };
      this.viewer = new Cesium.Viewer('cesiumContainer', viewerOption);
      this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏 LOGO 版权
      this.viewer.scene.globe.enableLighting = true; //激活基于太阳位置的光照

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

      var d1 = new Date(new Date().getTime() + 8 * 3600 * 1000);
      //ISO 8小时时差
      var cur_time = d1.toISOString();
      var d2 = new Date(new Date().getTime() + (8 + 24) * 3600 * 1000);
      //结束时间为第二天
      d2.setDate(d1.getDate() + 1);
      var end_time = d2.toISOString();
      var interval_time = cur_time + "/" + end_time;

      this.czml = [{
        "id": "document",
        "name": "polygon",
        "version": "1.0",
        "clock": {
          "interval": interval_time,
          "currentTime": cur_time,
          "multiplier": 1
        }
      }, {
        "id": "shape2",
        "name": "Red box with black outline",
        "availability": interval_time,
        /*"position" : {
            "cartographicDegrees" : [-66.62557, 516.92809, 100.0]
        },*/
        "billboard": {
          "show": true,
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJSURBVDhPnZHRDcMgEEMZjVEYpaNklIzSEfLfD4qNnXAJSFWfhO7w2Zc0Tf9QG2rXrEzSUeZLOGm47WoH95x3Hl3jEgilvDgsOQUTqsNl68ezEwn1vae6lceSEEYvvWNT/Rxc4CXQNGadho1NXoJ+9iaqc2xi2xbt23PJCDIB6TQjOC6Bho/sDy3fBQT8PrVhibU7yBFcEPaRxOoeTwbwByCOYf9VGp1BYI1BA+EeHhmfzKbBoJEQwn1yzUZtyspIQUha85MpkNIXB7GizqDEECsAAAAASUVORK5CYII=",
          "scale": 2
        },
        "path": {
          "material": {
            "solidColor": {
              "color": {
                "interval": interval_time,
                "rgba": [0, 245, 255, 128]
              }
            }
          },
          "width": [{
            "interval": interval_time,
            "number": 3.0
          }],
          "show": [{
            "interval": interval_time,
            "boolean": true
          }]
        },
        "position": {
          "interpolationAlgorithm": "LAGRANGE",
          "interpolationDegree": 1,
          "epoch": cur_time,
          "cartographicDegrees": [
            0.0, 110.0, 30.910002, 5000.0,
            1.0, 110.0, 30.910001, 5000.0
          ]
        }
      }];
      let dataSourcePromise = Cesium.CzmlDataSource.load(this.czml);
      this.viewer.dataSources.add(dataSourcePromise);
      this.viewer.zoomTo(dataSourcePromise);
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(111.07, 39.05, 4000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0)
        }
      });
      //this.viewer.trackedEntity = dataSource.entities.getById('shape2');

      let imageryLayers = this.viewer.imageryLayers;
      //加载ArcGIS 深蓝色地图
      let arcGISMap = new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
      })
      //加载高德地图
      let gaodeMap = new Cesium.UrlTemplateImageryProvider({
        url: 'https://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'
      })
      imageryLayers.addImageryProvider(arcGISMap);
      var viewer = this.viewer;

      var islock = 1;
      var i = 30.97;
      var a = 1;
    },
    methods: {
      update(viewer, czml) {

      },
      formatDateT(dataTime) {
        // var timestamp3 = 1551686227000;
        var timestamp = dataTime;
        var newDate = new Date(dataTime);
        // var newDate = new Date(dataTime + 8 * 3600 * 1000 );

        newDate.getTime(timestamp * 1000);
        // console.log(newDate.toDateString());//Mon Mar 11 2019
        // console.log(newDate.toGMTString()); //Mon, 11 Mar 2019 06:55:07 GMT
        // console.log(newDate.toISOString()); //2019-03-11T06:55:07.622Z
        return newDate.toISOString()
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
        var mType = JSON.parse(e.data).mType;
        switch (mType) {
          case "gps":

            var date = this.formatDateT(JSON.parse(e.data).receivingTime);
            this.realTimeData = {
              lat: JSON.parse(e.data).lat,
              lon: JSON.parse(e.data).lon,
              //
            }
            this.czml[1].position.cartographicDegrees.push(this.dataId, this.realTimeData.lon, this.realTimeData.lat, 5000);
            //this.czml[0].clock.currentTime = date;
            this.czml[0].clock.currentTime = this.viewer.clock.currentTime.toString();
            this.viewer.entities.removeAll();
            this.viewer.dataSources.removeAll();
            this.viewer.dataSources.add(Cesium.CzmlDataSource.load(this.czml)).then(function(dataSource) {
              this.viewer.trackedEntity = dataSource.entities.getById('shape2');
            });
            this.dataId++;

            this.$set(this.tableData1, 0, { index: 'DX-1', lon: JSON.parse(e.data).lon, lat: JSON.parse(e.data).lat, alt: JSON.parse(e.data).alt });

            console.log("realTimeData", this.realTimeData);
            console.log(this.czml);

            break;
          case "vfrhud":
            this.$set(this.tableData2, 0, { groundspeed: JSON.parse(e.data).groundspeed, airspeed: JSON.parse(e.data).airspeed, heading: JSON.parse(e.data).heading });
            console.log("vfrhud");
            break;
          case "batterystatus":
            this.$set(this.tableData3, 0, { batteryRemaining: JSON.parse(e.data).batteryRemaining });
            console.log(JSON.parse(e.data).batteryRemaining);
            break;
          default:
            break;
        };

      }

    }
  }
  import axios from "../../common/axios";

</script>
<style>
  #app,
  #cesiumContainer {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    width: 100%;
    height: 600px;
    overflow: hidden;
  }

</style>
