<template>
  <el-row class="full-size" type="flex" align="middle" justify="center">
    <el-col :span="14">
      <el-form onsubmit="return false" ref="createOrderForm" :model="form" :rules="formRules">
        <el-form-item>
          <el-alert style="line-height: 28px;" type="warning" :closable="false">
            <span class="text-small">Số điện thoại chưa có trong hệ thống sẽ được tạo tự động.</span>
          </el-alert>
        </el-form-item>
        <el-form-item prop="customerPhone">
          <input-label label="SĐT khách hàng" optional/>
          <el-input @keypress.enter.native="createOrder" v-model="form.customerPhone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="full-width" type="warning" @click="createOrder" :loading="isLoading">Tạo đơn
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from "vuex";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "CreateOrder",
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    data() {
      return {
        isLoading: false,
        form: {
          customerPhone: null,
        },
        formRules: {
          customerPhone: [
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ]
        },
      };
    },
    watch: {
      currentOrder: function () {
        if (!this.currentOrder.guid) this.resetForm();
      },
    },
    methods: {
      createOrder() {
        const vm = this;
        this.$refs.createOrderForm.validate(async valid => {
          if (valid) {
            vm.isLoading = true;
            try {
              await this.$store.dispatch("posMachine/createOrder", this.form.customerPhone);
              NotificationUtils.success("Tạo đơn thành công");
            } catch (error) {
              NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
            }
            vm.isLoading = false;
          }
        });
      },
      resetForm() {
        this.form = {};
      },
    }
  };
</script>

<style scoped>

</style>
