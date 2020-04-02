<template>
  <el-container direction="vertical">
    <el-row id="action" type="flex">
      <el-col :span="20">
        <el-form ref="areaForm" :rules="formRules" :model="form" :inline="true">
          <el-form-item prop="areaName">
            <el-input placeholder="Nhập tên khu vực" v-model="form.areaName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input :disabled="!form.autoCreateSeat" type="number" placeholder="Số lượng ghế" v-model="form.numberOfSeats"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.autoCreateSeat" @change="changeCheckbox">Tự tạo số ghế tương ứng</el-checkbox>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="text-right">
        <el-button :disabled="!validInput" type="primary" @click="submit">Thêm khu vực</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table>

      </el-table>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "AdminStoreDetailSeat",
    computed:{
      validInput(){
        if (this.form.autoCreateSeat){
          return this.form.areaName && this.form.numberOfSeats && this.form.numberOfSeats > 0;
        } else {
          return this.form.areaName;
        }
      }
    },
    data() {
      return {
        form: {
          areaName: null,
          autoCreateSeat: true,
          numberOfSeats: null,
        },
        formRules: {
          areaName: [
            {
              required: true,
              message: "Nhập vào tên khu vực",
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      submit(){

      },
      changeCheckbox(val){
        if (!val) {
          this.form.numberOfSeats = null;
        }
      }
    }
  };
</script>

<style scoped>

</style>
