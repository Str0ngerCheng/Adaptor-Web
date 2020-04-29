<template>
  <imp-panel>
    <my-video/>
  </imp-panel>
</template>

<script>
  import video from "../../components/video/video.vue"
  export default {
    name: "rtsp",
    components: {
      'my-video':video
    }
  }
</script>

<style scoped>

</style>
