<template>
  <imp-panel :title="form.id ? '编辑':'新增传感器'">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="form.longitude"></el-input>
      </el-form-item>
      <el-form-item label="维度">
        <el-input v-model="form.latitude"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">已运行</el-radio>
          <el-radio :label="0">未运行</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onEditSubmit" v-if="form.id">保存</el-button>
        <el-button type="primary" @click="onSubmit" v-else>立即创建</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import * as api from "../../api"
  import * as protocolApi from '../../services/protocol'
  import panel from "../../components/panel.vue"


  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        form: {
          id: null,
          name: '',
          longitude:'',
          latitude:'',
          type: '',
          location: '',
          status: 1,
          description: ''
        }
      }
    },
    computed: {
      'form.location': function () {
        return this.longitude+' '+this.latitude;
      }
    },
    methods: {
      onSubmit(){
        protocolApi.addSensor(api.SENSOR_ADD,{
          ...this.form,
          location:this.form.longitude+' '+this.form.latitude,
          protocol:this.$route.params.protocol
        }).then(res => {
            this.$confirm('添加成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.go(-1)
            })
          },err=>{
            this.$message.error('添加失败：'+err)
          })
      },
      onEditSubmit(){
        protocolApi.editSensor(api.SENSOR_UPDATE,{
          ...this.form,
          protocol:this.$route.params.protocol
        })
          .then(res => {
            this.$confirm('修改成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.go(-1)
            })
          },err=>{
            this.$message.error('修改失败：'+err)
          }).catch(err => {
          this.$message.error('修改失败：'+err)
        })
      },
      loadData(){
        console.log(this.$route.params)
        if (this.$route.params && this.$route.params != null && this.$route.params.id && this.$route.params.id != null) {
          this.form.id = this.$route.params.id;
          this.form.name = this.$route.params.name;
          this.form.type = this.$route.params.type;
          this.form.status = this.$route.params.status;
          this.form.longitude= this.$route.params.place.split(' ')[0];
          this.form.latitude= this.$route.params.place.split(' ')[1];
        }
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
