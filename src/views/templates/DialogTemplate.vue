<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item>
        <input-label label="" required/>
        <el-input></el-input>
      </el-form-item>

      <el-form-item>
        <input-label label="" optional/>
        <el-input></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item>
            <input-label label="" required/>
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item>
            <input-label label="" optional/>
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-select>
          <el-option></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.cancel")}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t("common.entity.action.save")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "DialogTemplate",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {},
        formRules: {}
      };
    },
    methods: {
      create() {
        this.form = {};
        this.isEdit = false;
      },
      edit(entity) {
        this.isEdit = true;
        this.form = AppUtils.deepCopy(entity);
      },
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      submit() {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            try {
              console.log("submit");
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            }
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
