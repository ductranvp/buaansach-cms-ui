<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="att">
        <input-label label="att" required/>
        <el-input v-model="form.att"></el-input>
      </el-form-item>

      <el-form-item prop="att">
        <input-label label="att" optional/>
        <el-input v-model="form.att"></el-input>
      </el-form-item>

      <el-form-item prop="att">
        <el-col :span="11">
          <el-form-item>
            <input-label label="att" required/>
            <el-input v-model="form.att"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="att">
            <input-label label="att" optional/>
            <el-input v-model="form.att"></el-input>
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
        form: {
          att: null
        },
        formRules: {
          att: [
            // {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            // {max: 10, message: this.$t("common.entity.validation.maxlength", {max: 10}), trigger: "blur"},
            // {min: 1, message: this.$t("common.entity.validation.minlength", {min: 1}), trigger: "blur"},
            // {type: 'email', message: this.$t("common.entity.validation.email"), trigger: "blur"},
            // {
            //   pattern: "^(09|03|07|08|05)+([0-9]{8})$",
            //   message: this.$t("common.entity.validation.pattern", {pattern: "^(09|03|07|08|05)+([0-9]{8})$"}),
            //   trigger: "blur"
            // },
            // {type: 'number', min: 1, message: this.$t("common.entity.validation.min", {min: 1}), trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      create() {
        this.form = {};
        this.isEdit = false;
        this.show();
      },
      edit(entity) {
        this.isEdit = true;
        this.form = AppUtils.deepCopy(entity);
        this.show();
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
