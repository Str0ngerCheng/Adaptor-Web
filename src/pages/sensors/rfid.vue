<template>
  <my-table :protocol="protocol"/>
</template>

<script>
  import myTable from "../../components/table/table.vue"
  export default {
    components: {
      'my-table':myTable
    },
    data(){
      return {
        protocol:'RFID'
      }
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>


<style scoped>

</style>
