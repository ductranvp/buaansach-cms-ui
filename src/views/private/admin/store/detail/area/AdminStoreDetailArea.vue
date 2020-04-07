<template>
  <el-container direction="vertical">
    <el-row id="action" type="flex">
      <el-col :span="20">
        <el-form ref="areaForm" :rules="formRules" :model="form" :inline="true">
          <el-form-item prop="areaName">
            <el-input :placeholder="$t('private.adminStoreDetailAreaPage.form.areaName')"
                      v-model="form.areaName">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input :disabled="!form.autoCreateSeat" type="number"
                      :placeholder="$t('private.adminStoreDetailAreaPage.form.numberOfSeats')"
                      v-model="form.numberOfSeats">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input :disabled="!form.autoCreateSeat"
                      :placeholder="$t('private.adminStoreDetailAreaPage.form.seatPrefix')"
                      v-model="form.seatPrefix">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.autoCreateSeat" @change="changeCheckbox">
              <span>{{$t("private.adminStoreDetailAreaPage.form.autoCreateSeat")}}</span>
            </el-checkbox>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="text-right">
        <el-button :disabled="!validInput" :loading="isLoading" type="primary" @click="saveArea">
          <span>{{$t("private.adminStoreDetailAreaPage.form.submitBtn")}}</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <raw-data-table ref="areaTable" :data="areas">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row :gutter="10" type="flex" align="middle" class="full-size flex-wrap margin-0">
              <el-col class="margin-bottom-10" :span="4" v-for="seat in row.listSeat" :key="seat.guid">
                <el-card :body-style="{padding: '10px', background: '#eee'}" shadow="never">
                  <el-row type="flex" align="middle">
                    <span class="flex-1">{{seat.seatName}}</span>
                    <span>
                      <el-button-group>
                        <el-button plain type="info" size="mini" @click="editSeat(seat)"><i
                          class="el-icon-edit"></i></el-button>
                        <el-button plain type="info" size="mini" @click="deleteSeat(row, seat)"><i
                          class="el-icon-delete"></i></el-button>
                      </el-button-group>
                    </span>
                  </el-row>
                </el-card>
              </el-col>
              <el-col class="margin-bottom-10" :span="4">
                <el-card class="pointer" @click.native="addSeat(row)" :body-style="{padding: '10px'}" shadow="never">
                  <div class="text-center">
                    <el-button size="mini" type="text">
                      <span>{{$t('private.adminStoreDetailAreaPage.table.addBtn')}}</span>
                    </el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="areaName"
          sortable
          :label="$t('private.adminStoreDetailAreaPage.table.areaName')">
          <template slot-scope="{ row }">
            <el-input :ref="row.guid" v-show="row.edit" v-model="row.areaName" size="small"/>
            <span v-show="!row.edit">{{ row.areaName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="numberOfSeats"
          :label="$t('private.adminStoreDetailAreaPage.table.numberOfSeats')">
          <template slot-scope="{ row }">
            {{ row.listSeat.length }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          :label="$t('private.adminStoreDetailAreaPage.table.createdBy')">
          <template slot-scope="{ row }">
            {{ row.createdBy }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdDate"
          sortable
          :label="$t('private.adminStoreDetailAreaPage.table.createdDate')">
          <template slot-scope="{ row }">
            {{ row.createdDate | moment("HH:mm - DD/MM/YYYY") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastModifiedBy"
          :label="$t('private.adminStoreDetailAreaPage.table.lastModifiedBy')">
          <template slot-scope="{ row }">
            {{ row.lastModifiedBy }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastModifiedDate"
          sortable
          :label="$t('private.adminStoreDetailAreaPage.table.lastModifiedDate')">
          <template slot-scope="{ row }">
            {{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.entity.action.title')" width="160px">
          <template slot-scope="{ row }">
            <div v-if="row.edit">
              <el-button plain type="info" size="mini" @click="row.edit = false">
                <span>{{$t("common.entity.action.cancel")}}</span>
              </el-button>
              <el-button plain type="primary" size="mini" @click="confirmEditArea(row)">
                <span>{{$t("common.entity.action.save")}}</span>
              </el-button>
            </div>
            <div v-else>
              <el-button plain type="warning" size="mini" @click="editArea(row)">
                <span>{{$t("common.entity.action.edit")}}</span>
              </el-button>

              <el-button plain type="danger" size="mini" @click="deleteArea(row)">
                <span>{{$t("common.entity.action.delete")}}</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </raw-data-table>
    </el-row>
  </el-container>
</template>

<script>
  import AreaService from "@/service/area.service";
  import NotificationUtils from "@/utils/notification.util";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import MessageBoxUtils from "@/utils/message-box.util";
  import SeatService from "@/service/seat.service";

  export default {
    name: "AdminStoreDetailArea",
    components: {RawDataTable},
    computed: {
      validInput() {
        if (this.form.autoCreateSeat) {
          return this.form.areaName && this.form.numberOfSeats && this.form.numberOfSeats > 0;
        } else {
          return this.form.areaName;
        }
      }
    },
    created() {
      this.getArea();
    },
    data() {
      return {
        isLoading: false,
        areas: [],
        form: {
          areaName: null,
          autoCreateSeat: true,
          numberOfSeats: null,
          seatPrefix: null,
        },
        formRules: {
          areaName: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      addSeat(row) {
        const vm = this;
        MessageBoxUtils.prompt(vm.$t("private.adminStoreDetailAreaPage.dialog.addSeatTitle"),
          vm.$t("private.adminStoreDetailAreaPage.dialog.addSeatMessage"),
          false, "",
          async function (val) {
            try {
              const seatEntity = {
                seatName: val.value,
                areaGuid: row.guid
              };
              const {data} = await SeatService.createSeat(seatEntity);
              row.listSeat.push(data);
              NotificationUtils.success(vm.$t("private.adminStoreDetailAreaPage.notification.saveSeatSuccess"));
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            }
          });
      },
      deleteSeat(row, seat) {
        const vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await SeatService.deleteSeat(seat.guid);
            row.listSeat = row.listSeat.filter(s => s.guid !== seat.guid);
            NotificationUtils.success(vm.$t("private.adminStoreDetailAreaPage.notification.deleteSeatSuccess"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      editSeat(seat) {
        const vm = this;
        const originalSeatName = seat.seatName;
        MessageBoxUtils.prompt(
          vm.$t("private.adminStoreDetailAreaPage.dialog.editSeatTitle"),
          vm.$t("private.adminStoreDetailAreaPage.dialog.addSeatMessage"),
          false, seat.seatName,
          async function (val) {
            try {
              seat.seatName = val.value;
              await SeatService.updateSeat(seat);
              NotificationUtils.success(vm.$t("private.adminStoreDetailAreaPage.notification.saveSeatSuccess"));
            } catch (error) {
              seat.seatName = originalSeatName;
              NotificationUtils.error(error.message || error.data.message);
            }
          });
      },
      resetForm() {
        this.form = {autoCreateSeat: true};
        this.$refs.areaForm.clearValidate();
        this.$refs.areaForm.resetFields();
      },
      deleteArea(row) {
        let vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AreaService.deleteArea(row.guid);
            vm.areas = vm.areas.filter(area => area.guid !== row.guid);
            NotificationUtils.success(vm.$t("private.adminStoreDetailAreaPage.notification.deleteAreaSuccess"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      editArea(row) {
        row.edit = true;
        const vm = this;
        setTimeout(function () {
          vm.$refs[row.guid].focus();
        }, 100);
      },
      async confirmEditArea(row) {
        try {
          const {data: area} = await AreaService.updateArea(row);
          area.edit = false;
          Object.keys(area).forEach(key => {
            row[key] = area[key];
          });
          NotificationUtils.success(this.$t("private.adminStoreDetailAreaPage.notification.saveAreaSuccess"));
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      async saveArea() {
        const vm = this;
        vm.form.storeGuid = vm.$route.params.storeGuid;
        if (vm.form.storeGuid) {
          try {
            vm.isLoading = true;
            const {data: area} = await AreaService.createArea(vm.form);
            vm.isLoading = false;
            this.$set(area, 'edit', false);
            this.areas.push(area);
            this.resetForm();
            NotificationUtils.success(this.$t("private.adminStoreDetailAreaPage.notification.saveAreaSuccess"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        }
      },
      async getArea() {
        try {
          const {data} = await AreaService.getListAreaByStore(this.$route.params.storeGuid);
          this.areas = data.map(area => {
            this.$set(area, 'edit', false);
            return area;
          });
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      changeCheckbox(val) {
        if (!val) {
          this.form.numberOfSeats = null;
          this.form.seatPrefix = null;
        }
      }
    }
  };
</script>

<style scoped>

</style>
