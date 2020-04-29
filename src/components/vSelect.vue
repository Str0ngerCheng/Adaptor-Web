<template>
  <el-select @change="handleChange" v-model="value" >
    <el-option v-for="item in options"
               :key="index"
               :label="item.label"
               :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: "vSelect",
    data() {
      return {
        value: ' '
      }
    },
    props:['options'],
    methods: {
      handleChange(value) {
        this.$emit('my-event',value);
      }
    },
  }
</script>

<style scoped>

</style>
