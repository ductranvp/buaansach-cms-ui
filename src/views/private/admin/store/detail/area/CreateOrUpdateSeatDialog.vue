<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc sửa chỗ ngồi"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    @opened="onOpened"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="seatName">
              <input-label label="Tên chỗ (Tiếng Việt)" required/>
              <el-input ref="seatName" v-model="form.seatName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="seatNameEng">
              <input-label label="Tên chỗ (Tiếng Anh)" required/>
              <el-input v-model="form.seatNameEng"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  import AdminSeatService from "@/service/admin/admin.seat.service";

  export default {
    name: "CreateOrUpdateSeatDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          guid: null,
          seatName: null,
          seatNameEng: null,
          areaGuid: null,
        },
        formRules: {
          seatName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          seatNameEng: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      create(area) {
        this.isEdit = false;
        this.form = {
          areaGuid: area.guid,
        };
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
      onOpened() {
        this.$refs.seatName.focus();
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              let result;
              if (this.isEdit) {
                const {data} = await AdminSeatService.updateSeat(this.form);
                result = data;
              } else {
                const {data} = await AdminSeatService.createSeat(this.form);
                result = data;
                result.created = true;
              }
              this.$emit("saved", result);
              this.resetForm();
              this.hide();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            } finally {
              this.isLoading = false;
            }
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
