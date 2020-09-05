<template>
  <el-container direction="vertical">
    <create-or-update-area-dialog ref="areaDialog" @saved="getArea"/>
    <create-or-update-seat-dialog ref="seatDialog" @saved="seatSaved"/>
    <el-row class="padding-bottom-10">
      <el-col class="text-right">
        <el-button type="primary" @click="showAreaDialog()">
          <span>Tạo mới</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <raw-data-table ref="areaTable" :data="areas">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row :gutter="10" type="flex" align="middle" class="full-size flex-wrap margin-0">
              <el-col class="margin-bottom-10" :span="6" v-for="seat in row.listSeat" :key="seat.guid">
                <el-card :body-style="{padding: '10px', background: '#eee'}" shadow="never">
                  <el-row type="flex" align="middle">
                    <span class="flex-1">{{seat.seatName}} - {{seat.seatNameEng}}</span>
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
                <el-card class="pointer" @click.native="createSeat(row)" :body-style="{padding: '10px'}"
                         shadow="never">
                  <div class="text-center">
                    <el-button size="mini" type="text">
                      <span>Thêm chỗ</span>
                    </el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="areaName" sortable label="Tên (Tiếng Việt)"/>
        <el-table-column prop="areaNameEng" sortable label="Tên (Tiếng Anh)"/>
        <el-table-column prop="areaType" sortable label="Loại"/>
        <el-table-column
          prop="areaColor"
          label="Màu">
          <template slot-scope="{ row }">
            <el-button :style="{backgroundColor: row.areaColor}"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="areaActivated"
          label="Trạng thái">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.areaActivated">Bật</el-tag>
            <el-tag type="danger" v-else>Tắt</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="numberOfSeats"
          width="100px"
          label="Số chỗ">
          <template slot-scope="{ row }">
            {{ row.listSeat.length }}
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column :label="$t('common.entity.action.title')" width="160px">
            <template slot-scope="{ row }">
              <el-button plain type="warning" size="mini" @click="showAreaDialog(row)">
                <span>{{$t("common.entity.action.edit")}}</span>
              </el-button>
              <el-button plain type="danger" size="mini" @click="deleteArea(row)">
                <span>{{$t("common.entity.action.delete")}}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-row>
  </el-container>
</template>

<script>
  import AdminAreaService from "@/service/admin/admin.area.service";
  import NotificationUtils from "@/utils/notification.util";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import MessageBoxUtils from "@/utils/message-box.util";
  import CreateOrUpdateAreaDialog from "@/views/private/admin/store/detail/area/CreateOrUpdateAreaDialog";
  import AdminSeatService from "@/service/admin/admin.seat.service";
  import CreateOrUpdateSeatDialog from "@/views/private/admin/store/detail/area/CreateOrUpdateSeatDialog";
  import AppUtils from "@/utils/app.util";

  export default {
    name: "AdminStoreDetailArea",
    components: {CreateOrUpdateSeatDialog, CreateOrUpdateAreaDialog, RawDataTable},
    created() {
      this.getArea();
    },
    watch: {
      $route(to, from) {
        this.getArea();
      },
    },
    data() {
      return {
        isLoading: false,
        areas: [],
        seatFlag: null,
        areaFlag: null,
      };
    },
    methods: {
      createSeat(area) {
        this.$refs.seatDialog.create(area);
        this.areaFlag = area;
      },
      editSeat(seat) {
        this.$refs.seatDialog.edit(seat);
        this.seatFlag = seat;
      },
      seatSaved(savedSeat){
        if (savedSeat.created){
          this.areaFlag.listSeat.push(savedSeat);
        } else {
          AppUtils.setAttrs(this, this.seatFlag, savedSeat);
        }
      },
      showAreaDialog(area) {
        if (area) this.$refs.areaDialog.edit(area);
        else this.$refs.areaDialog.create();
      },
      deleteArea(row) {
        let vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AdminAreaService.deleteArea(row.guid);
            await vm.getArea();
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      deleteSeat(row, seat) {
        const vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AdminSeatService.deleteSeat(seat.guid);
            row.listSeat = row.listSeat.filter(s => s.guid !== seat.guid);
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      async getArea() {
        try {
          const {data} = await AdminAreaService.getListAreaByStoreGuid(this.$route.params.storeGuid);
          this.areas = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
    }
  };
</script>

<style scoped>

</style>
