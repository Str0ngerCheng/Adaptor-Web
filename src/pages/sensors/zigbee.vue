<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <router-link :to="{ path: 'userAdd'}">
            <el-button type="primary" icon="el-icon-plus" size="medium">新增</el-button>
          </router-link>
        </el-col>
        <el-col :span="6" style="float: right">
          <el-input type="text" placeholder="输入传感器类型" v-model="searchKey" @keyup.enter="search($event)"
                    prefix-icon="el-icon-search"/>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
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
          :filters="[{ text: '温度', value: '温度' }, { text: '水位', value: '水位' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
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
            <el-button size="small" :type="scope.row.status===1 ? 'success':'danger'">
              {{ scope.row.status===1 ? "正常运行":'未运行'}}
            </el-button>
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
              @click="handleRoleConfig(scope.$index, scope.row)">
              <i class='fa fa-line-chart'> 历史数据</i>
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

      <el-dialog title="传感器历史数据"  :visible.sync="dialogVisible" size="small">
        <dashboard/>
      </el-dialog>

      <!--向组件传入数据,数据分别为options1 和options-->
      <vSelect :options="options1" @my-event="select">  </vSelect>
      <vSelect :options="options" @my-event="select"> </vSelect>

      <!--excel ,需要先安装 npm install --save xlsx 和 npm install --save jquery-->
      <!--excel示例在static里面-->
      <inputExcel>
        <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
        <el-upload
          class="upload-demo"
          action=""
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :limit="limitUpload"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :auto-upload="false">
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div> -->
        </el-upload>

        <!-- 数据展示 -->
        <el-main>
          <el-table :data="da">
            <el-table-column prop="code" label="编号">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="pro" label="省份">
            </el-table-column>
            <el-table-column prop="cit" label="城市">
            </el-table-column>
            <el-table-column prop="dis" label="区县">
            </el-table-column>
          </el-table>
        </el-main>
      </inputExcel>

    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'
  import dashboard from '../../pages/dashboard.vue'
  import inputExcel from  '../../components/excel.vue'
  import vSelect from '../../components/vSelect.vue'

  export default {
    components: {
      'imp-panel': panel,
      'dashboard':dashboard,
      'inputExcel':inputExcel,
      'vSelect':vSelect
    },
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        options: [
          {
            value: 0,
            label: '选项一'
          },
          {
            value: 1,
            label: '选项二'
          },
        ],
        options1: [
          {
            value: 0,
            label: '选项一'
          },
        ]
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        this.currentRow = row;
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          sysApi.roleList({selectChildren:true})
            .then(res => {
              this.roleTree = res
            })
        }
        this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
          .then(res => {
            this.$refs.roleTree.setCheckedKeys(res.data);
          }).catch(err=>{

        })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
        this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
          .then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
          })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        this.$router.push({path: 'userAdd', query: {id: row.id}})
      },
      handleDelete(index, row){
        this.$http.get(api.SYS_USER_DELETE + "?userIds=" + row.id).then(res => {
          this.loadData();
        });
      },
      filterTag(value, row) {
        return row.type === value;
      },
      loadData(){
        sysApi.sensorList({
          key: this.searchKey,
          pageSize: this.tableData.pagination.pageSize,
          pageNo: this.tableData.pagination.pageNo
        })
          .then(res => {
            this.tableData.rows = res.records;
            this.tableData.pagination.total = res.total;
          });
      }
    },
    created(){
      this.loadData();
    },
    select(value) {
      console.log(value)
    }

  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
