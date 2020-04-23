<template>
  <my-table :load-u-r-l="loadURL"
            :add-u-r-l="addURL"
            :edit-u-r-l="editURL"
            :delete-u-r-l="deleteURL"
            :get-by-name-u-r-l="getByNameURL"
            :get-by-type-u-r-l="getByTypeURL"
            :get-history-data-u-r-l="getHistoryDataURL"/>
</template>

<script>
  import myTable from "../../components/table/table.vue"
  import * as api from "../../api"
  export default {
    components: {
      'my-table':myTable
    },
    data(){
      return {
        loadURL:api.ZIGBEE_LIST,
        addURL:api.ZIGBEE_ADD,
        editURL:api.ZIGBEE_UPDATE,
        deleteURL:api.ZIGBEE_DELETE,
        getByNameURL:api.ZIGBEE_GET_BY_NAME,
        getByTypeURL:api.ZIGBEE_GET_BY_TYPE,
        getHistoryDataURL:api.ZIGBEE_HistoryData
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
