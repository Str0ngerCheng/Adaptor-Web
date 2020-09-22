<template>
  <imp-panel>
    <div id="app">
      <div id="cesiumContainer"></div>
    </div>
  </imp-panel>
</template>
<script>
  import * as Cesium from 'cesium/Cesium';
  import 'cesium/Widgets/widgets.css'
  export default {
    name: 'CesiumView',
    mounted () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZjQ1MGFlNC0zYmRmLTRhM2ItYTk5Yi0wYzc2NGUyYzFmOGUiLCJpZCI6MzQ3MTQsImlhdCI6MTYwMDc1MTI0M30.-p92mI1ZHfCunAMeiKVswBH58XtV-CcYCYpnlxd-1J0'

      var viewer = new Cesium.Viewer('cesiumContainer',{
        sceneModel: Cesium.SceneMode.SCENE2D,
        fullscreenButton: false,
        animation: false, //是否显示动画控件
        baseLayerPicker: true, //是否显示图层选择控件
        geocoder: true, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: true, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: true //是否显示点击要素之后显示的信息
      });
      var czml = [
        {
          id: "document",
          name: "CZML Colors",
          version: "1.0"
        },
        {
          id: "rgba",
          name: "Rectangle with outline using RGBA Colors",
          rectangle: {
            coordinates: {
              wsenDegrees: [100, 40, 110, 50]
            },
            fill: true,
            material: {
              solidColor: {
                color: {
                  rgba: [255, 0, 0, 100]
                }
              }
            },
            height: 0, // disables ground clamping, needed for outlines
            outline: true,
            outlineColor: {
              rgba: [0, 0, 0, 255]
            }
          }
        }
        ];
      var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
      viewer.dataSources.add(dataSourcePromise);
      viewer.zoomTo(dataSourcePromise);
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(111.07, 39.05, 4000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0)
        }
      });
    }
  }
</script>
<style>
  #app,#cesiumContainer {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    width: 100%;
    height: 900px;
    overflow: hidden;
  }
</style>
