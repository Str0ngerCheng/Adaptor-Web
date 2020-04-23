<template>

  <div class="amap-page-container">
    <el-amap ref="map" vid="amapDemo"  :center="center" :zoom="zoom" :plugin="plugin" :events="events" style="height: 500px">
      <el-amap-marker vid="component-marker" :position="position" :events="events" ></el-amap-marker>
    </el-amap>
  </div>
</template>

<style>

</style>

<script>
  // NPM 方式
   import { AMapManager } from 'vue-amap';
  // CDN 方式
  //let amapManager = new VueAMap.AMapManager();
  export default {
    data() {
      return {
        center: [121.5273285, 31.21515044],
        zoom: 12,
        position: [121.5273285, 31.21515044],
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
          },
          click: e => {
            alert('map clicked')
          }
        },
        markers: [
          {
            position: [121.5273285, 31.41515044]
          },
          {
            position: [121.5273286, 31.31515045]
          }
        ],
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
        ]
      }
    },
  }
</script>

