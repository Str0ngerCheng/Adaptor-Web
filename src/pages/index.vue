<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content">
            <i class="fa fa-skyatlas grid-con-icon" style="background: rgb(45, 140, 240)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(45, 140, 240)">
                <count-to :startVal='0' :endVal='7' :duration='2000' />
              </div>
              <div>接入协议数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content">
            <i class="fa fa-database grid-con-icon" style="background: rgb(255, 153, 0)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(255, 153, 0)">
                <count-to :startVal='0' :endVal='15' :duration='2000' />
              </div>
              <div>数据产品类型</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content" >
            <i class="fa fa-tablet grid-con-icon" style="background: rgb(154, 102, 228)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(154, 102, 228)">
                <count-to :startVal='0' :endVal='1000' :duration='2000' />
              </div>
              <div>设备总量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content">
            <i class="fa fa-check-circle grid-con-icon" style="background: rgb(100, 213, 114)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(100, 213, 114)">
                <count-to :startVal='0' :endVal='972' :duration='2000' />
              </div>
              <div>正常运行设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content">
            <i class="fa fa-exclamation-triangle grid-con-icon" style="background: rgb(242, 94, 67)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(242, 94, 67)">
                <count-to :startVal='0' :endVal='28' :duration='2000' />
              </div>
              <div>故障设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content">
            <i class="fa fa-bell-o grid-con-icon" style="background: rgb(228, 108, 187)"></i>
            <div class="grid-cont-right">
              <div class="grid-num" style="color: rgb(228, 108, 187)">
                <count-to :startVal='0' :endVal='51' :duration='2000' />
              </div>
              <div>系统消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20">
          <chart-pie style="height: 300px;" :value="pieData" text="协议对应传感器数量"></chart-pie>
        </el-card>
        <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <span style="font-size: 18px;font-weight: bold">区域传感器数量占比</span>
          </div>豹澥实验场
          <el-progress :percentage="71.3" color="#42b983"></el-progress>豹澥街区
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>硅田地下停车场
          <el-progress :percentage="13.7"></el-progress>武大实验场
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" class="mgb20">
          <chart-bar style="height: 300px;" :value="barData" text="各类型传感器数量"/>
        </el-card>
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <span style="font-size: 18px;font-weight: bold">故障列表</span>
            <count-to  :startVal=asynStartVal :endVal=asynEndVal />
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { ChartPie, ChartBar } from '../components/charts/index'
  import countTo from 'vue-count-to';
  export default {
    name: 'index',
    components: {
      ChartPie,
      ChartBar,
      countTo
    },
    data() {
      return {
        name: '',
        asynStartVal:0,
        asynEndVal: 100,
        todoList: [
          {
            title: 'zigbee_01数据异常，校验未通过',
            status: true
          },
          {
            title: 'nb-iot_01设备异常，通信断开',
            status: false
          },
          {
            title: 'lora_02设备异常，原因不明',
            status: false
          }
        ],
        pieData: [
          { value: 31, name: 'ModBus' },
          { value: 326, name: 'NB-IoT' },
          { value: 200, name: 'ZigBee' },
          { value: 152, name: 'Lora' },
          { value: 99, name: 'BLE' },
          { value: 162, name: 'RFID' },
          { value: 30, name: 'RTSP' }
        ],
        barData: {
          '大气温度': 150,
          '大气湿度': 143,
          '土壤湿度': 326,
          '土壤温度': 300,
          '气压': 93,
          'PM2.5': 100,
          '热通量': 50,
          '风速风向': 86,
          '水位': 220,
          '蒸发': 42
        }
      };
    },

    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '普通用户';
      }
    },
    methods: {
      init () {
        setInterval(() => {
          this.asynStartVal= this.asynEndVal,
          this.asynEndVal += 1
        }, 5000)
      }
    },
    mounted () {
      this.init()
    }
  };
</script>


<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    width: 64%;
    color: #999;
  }

  .grid-num {
    font-size: 35px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 40px;
    width: 36%;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }


  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }


  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

</style>
