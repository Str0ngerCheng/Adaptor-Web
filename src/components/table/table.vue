<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <router-link :to="{ name: 'sensorAdd', params: {protocol:this.protocol}}">
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
          prop="location"
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
  import * as api from "../../api"
  import * as protocolApi from '../../services/protocol'
  import line from '../charts/line.vue'
  import defaultValue from '../../services/default'

  export default {
    components: {
      'imp-panel': panel,
      'chart-line':line
    },
    data(){
      return {
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
        historyData:{}
      }
    },
    props:{
      protocol:String
    },
    watch:{
      //清空输入框中的内容后显示所有列表数据
      //searchSelected用来防止初始时(此时输入框为空)调用loadData()
      searchKey: {
        handler(newValue, oldValue) {
          if(newValue==''&&this.searchSelected){
            this.loadData();
            this.searchSelected=false
          }
        }
      },
    },
    methods: {
      querySearch(queryString, cb) {
        let  rows = []
        for(let i=0;i<this.tableData.rows.length;i++){
          rows.push({value:this.tableData.rows[i].name})
        }
        let res = new Map();
        rows=rows.filter((row) => !res.has(row.value) && res.set(row.value, 1));//rows去重
        let  results = queryString ? rows.filter(this.createFilter(queryString)) : rows;
        cb(results);
      },
      createFilter(queryString) {
        return (row) => {
          return (row.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        let sensorName=item.value;
        protocolApi.getSensorsByName(api.SENSOR_GET_BY_NAME,{sensorName:sensorName
        }).then(res => {
          this.tableData.rows = res.records;
          this.tableData.pagination.total = res.total;
        });
        this.searchSelected=true
      },
      //将historyData置为空，此时图表会再次刷新，避免影响获取其他历史数据的绘制
      handleDialogClose(){
        this.historyData={}
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
      },
      handleHistoryData(index, row){
        this.dialogVisible = true;
        protocolApi.getHistoryData(api.SENSOR_HistoryData,{
          sensorName: row.name,
          type:row.type
        }).then(res => {
          this.historyData=res
        },err=>{
          this.$message.error('历史数据获取失败：'+err)
        })
      },
      handleEdit(index, row){
        //路由跳转，并传递参数
        this.$router.push({name: 'sensorAdd', params: {...row,protocol:this.protocol},query:{id: row.id}})
      },
      handleDelete(index, row){
        protocolApi.deleteSensor(api.SENSOR_DELETE,{
          sensorName: row.name,
          type: row.type
        }).then(res => {
          this.loadData();
        },err=>{
          this.$message.error('删除失败：'+err)
        });
      },
      filterTag(filters) {
        //aType此处是数组，前端类型可以选择多个，以此来筛选传感器
        //重置时，aType为空
        debugger
        if(filters.aType.length==0)
          this.loadData();
        else protocolApi.getSensorsByType(api.SENSOR_GET_BY_TYPE,{
          type:filters.aType,
          protocol:this.protocol
        }).then(res => {
            this.tableData.rows = res.records;
            this.tableData.pagination.total = res.total;
          });
      },
      //加载列表数据
      loadData(){
        protocolApi.getSensorList(api.SENSOR_LIST,{
          protocol:this.protocol
        })
          .then(res => {
            this.tableData.rows = res.records;
            this.tableData.pagination.total = res.total;
            this.typeData= defaultValue.typeData
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
