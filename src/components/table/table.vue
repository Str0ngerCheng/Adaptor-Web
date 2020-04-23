<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <router-link :to="{ name: 'sensorAdd', params: {url:this.addURL}}">
            <el-button type="primary" icon="el-icon-plus" size="medium">新增</el-button>
          </router-link>
        </el-col>
        <el-col :span="5" style="float: right">
          <el-autocomplete
            class="inline-input"
            v-model="searchKey"
            :fetch-suggestions="querySearch"
            placeholder="输入传感器名称"
            :trigger-on-focus="false"
            @select="handleSelect"
            prefix-icon="el-icon-search"
            clearable
          ></el-autocomplete>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows.slice
        ((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        v-loading="listLoading"
        @filter-change="filterTag">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column
          prop="id"
          type="selection"
          width="50"
          align='center'>
        </el-table-column>
        <el-table-column
          label="传感器"
          align='center'>
          <template slot-scope="scope">
            <img :src='scope.row.avatar' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="place"
          label="位置"
          width="120"
          align='center'
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          :filters="typeData"
          filter-placement="bottom-end"
          :column-key=" 'aType' "
          align='center'>
          <template slot-scope="scope">
            <el-tag
              type="primary"
              disable-transitions>{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="obs_value"
          label="观测值"
          align='center'>
        </el-table-column>

        <el-table-column
          label="状态"
          width="110"
          align='center'>
          <template slot-scope="scope">
            <el-button :type="scope.row.status===1 ? 'success':'danger'"
                       style="padding:8px; vertical-align:middle">
            </el-button>
           <!-- <el-button size="small" :type="scope.row.status===1 ? 'success':'danger'">
              {{ scope.row.status===1 ? "正常运行":'未运行'}}
            </el-button>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="protocol_params"
          label="协议参数"
          align='center'>
        </el-table-column>
        <el-table-column label="操作" width="295" align='center'>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="default"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleHistoryData(scope.$index, scope.row)">
              <i class='fa fa-line-chart'>历史数据</i>
            </el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNo"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>

      <el-dialog title="传感器历史数据"  :visible.sync="dialogVisible" size="small" @close='handleDialogClose'>
        <chart-line :history-data="historyData"/>
      </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import testData from "../../../static/data/data.json"
  import * as protocolApi from '../../services/protocol'
  import line from '../charts/line.vue'

  export default {
    components: {
      'imp-panel': panel,
      'chart-line':line
    },
    data(){
      return {
        globalRows:[],
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        listLoading: false,
        searchKey: '',
        searchSelected: false,
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        typeData:[],
        historyData:[]

      }
    },
    props:{
      loadURL:String,
      addURL:String,
      editURL:String,
      deleteURL:String,
      getByTypeURL:String,
      getHistoryDataURL:String,
    },
    watch:{
      searchKey: {
        handler(newValue, oldValue) {
          if(newValue==''&&this.searchSelected){
            this.tableData.rows = this.globalRows;
            this.tableData.pagination.total = this.globalRows.length;
            this.searchSelected=false
          }
        }
      },
    },
    methods: {
      querySearch(queryString, cb) {
        let  rows = []
        for(let i=0;i<this.globalRows.length;i++){
          rows.push({value:this.globalRows[i].name,index:i})
        }
        let  results = queryString ? rows.filter(this.createFilter(queryString)) : rows;
        cb(results);
      },
      createFilter(queryString) {
        return (row) => {
          return (row.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.tableData.rows = [this.globalRows[item.index]];
        this.tableData.pagination.total = 1;
        this.searchSelected=true;
      },

      handleDialogClose(){
        this.historyData=[]
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleHistoryData(index, row){
        this.dialogVisible = true;
        //this.historyData= defaultValue.historyData
        protocolApi.getHistoryData(this.getHistoryDataURL,{
          sensorName: row.name
        }).then(res => {
          this.historyData=res
        },err=>{
          this.$message.error('历史数据获取失败：'+err)
        })

      },
      handleEdit(index, row){
        this.$router.push({name: 'sensorAdd', params: {...row,url:this.editURL},query:{id: row.id}})
      },
      handleDelete(index, row){
        protocolApi.deleteSensor(this.deleteURL,{
          sensorName: row.name
        }).then(res => {
            this.loadData();
          },err=>{
          this.$message.error('删除失败：'+err)
        });
      },
      filterTag(filters) {
        if(filters.aType.length==0)
          this.loadData();
        else protocolApi.getSensorsByType(this.getByTypeURL,{type:filters.aType})
          .then(res => {
            this.tableData.rows = res.records;
            this.tableData.pagination.total = res.total;
          });
      },
      loadData(){
        protocolApi.getSensorList(this.loadURL)
          .then(res => {
            this.globalRows= res.records;
            this.tableData.rows = res.records;
            this.tableData.pagination.total = res.total;
            this.typeData=res.sensorType
          });
      }
    },
    created(){
      this.loadData();
    }

  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .el-table th>.cell{
    display:block;
  }
</style>
