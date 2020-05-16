<template>
  <el-dialog
    title="Chuyển bàn"
    :modal-append-to-body="true"
    :append-to-body="true"
    width="40%"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false">
    <el-form ref="changeOrderSeatForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item label="Chọn khu vực">
            <el-select class="full-width" v-model="form.selectedAreaGuid" @change="changeAreaGuid">
              <el-option v-for="area in allAreas"
                         :key="area.guid"
                         :value="area.guid"
                         :label="area.areaName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="selectedAreaGuid" label="Chọn vị trí">
            <el-select no-data-text="Không còn vị trí trống" class="full-width" v-model="form.selectedSeatGuid">
              <el-option v-for="seat in emptySeats"
                         :key="seat.guid"
                         :value="seat.guid"
                         :label="seat.seatName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState} from "vuex";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "ChangeOrderSeatDialog",
    computed: {
      ...mapState({
        allAreas: state => state.posMachine.allAreas,
        selectedArea: state => state.posMachine.selectedArea
      })
    },
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        emptySeats: [],
        form: {
          selectedAreaGuid: null,
          selectedSeatGuid: null,
        },
        formRules: {
          selectedSeatGuid: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
        }
      };
    },
    methods: {
      changeAreaGuid(areaGuid) {
        const selectedArea = this.allAreas.find(area => area.guid === areaGuid);
        this.emptySeats = selectedArea.listSeat.filter(seat => seat.seatStatus === 'EMPTY');
      },
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.form = {};
        this.$refs.changeOrderSeatForm.clearValidate();
        this.$refs.changeOrderSeatForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      submit() {
        const vm = this;
        this.$refs.changeOrderSeatForm.validate(async valid => {
          if (valid) {
            vm.isLoading = true;
            try {
              await vm.$store.dispatch("posMachine/changeOrderSeat", vm.form.selectedSeatGuid);
              await vm.$store.dispatch("posMachine/getAllArea", vm.$route.params.storeGuid);
              await vm.$store.dispatch("posMachine/changeArea", vm.selectedArea.guid);
              vm.hide();
              vm.isLoading = false;
              NotificationUtils.success("Chuyển bàn thành công");
            } catch (error) {
              vm.isLoading = false;
              NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
