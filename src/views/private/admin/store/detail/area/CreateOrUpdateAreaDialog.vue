<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc sửa khu vực"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    @opened="onOpened"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="areaName">
              <input-label label="Tên khu vực (Tiếng Việt)" required/>
              <el-input ref="areaName" v-model="form.areaName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="areaNameEng">
              <input-label label="Tên khu vực (Tiếng Anh)" required/>
              <el-input v-model="form.areaNameEng"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="areaType">
              <input-label label="Loại khu vực" required/>
              <el-select :disabled="isEdit" v-model="form.areaType" class="full-width">
                <el-option v-for="item in areaTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item>
              <input-label label="Màu khu vực" required/>
              <el-color-picker
                v-model="form.areaColor"
                show-alpha
                :predefine="predefineColors">
              </el-color-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="areaActivated">
              <input-label label="Kích hoạt" required/>
              <el-checkbox v-model="form.areaActivated">
                <span v-if="form.areaActivated">Có</span>
                <span v-else>Không</span>
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2" v-if="!isEdit">
            <el-form-item>
              <input-label label="Số lượng chỗ" required/>
              <el-input v-model="form.numberOfSeats">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-if="!isEdit">
        <el-row>
          <el-col :span="11">
            <el-form-item>
              <input-label label="Tiền tố tên chỗ (Tiếng Việt)" required/>
              <el-input v-model="form.seatPrefix">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item>
              <input-label label="Tiền tố tên chỗ (Tiếng Anh)" required/>
              <el-input v-model="form.seatPrefixEng">
              </el-input>
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
  import AreaType from "@/enum/AreaType";
  import AdminAreaService from "@/service/admin/admin.area.service";

  export default {
    name: "CreateOrUpdateAreaDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        areaTypes: AreaType.withLabel,
        form: {
          guid: null,
          areaName: null,
          areaNameEng: null,
          areaType: null,
          areaColor: null,
          areaActivated: null,
          seatPrefix: null,
          seatPrefixEng: null,
          numberOfSeats: null,
          storeGuid: null,
        },
        formRules: {
          areaName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          areaNameEng: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ]
        },
        predefineColors: [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          'hsv(51, 100, 98)',
          'hsva(120, 40, 94, 0.5)',
          'hsl(181, 100%, 37%)',
          'hsla(209, 100%, 56%, 0.73)',
          '#c7158577'
        ],
      };
    },
    methods: {
      create() {
        this.isEdit = false;
        this.form = {
          storeGuid: this.$route.params.storeGuid,
          areaColor: "#90ee90",
          areaType: AreaType.values.IN_STORE,
          areaActivated: true,
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
        this.$refs.areaName.focus();
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              if (this.isEdit) {
                await AdminAreaService.updateArea(this.form);
              } else {
                await AdminAreaService.createArea(this.form);
              }
              this.$emit("saved");
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
