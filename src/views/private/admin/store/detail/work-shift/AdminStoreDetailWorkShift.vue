<template>
  <el-container>
    <el-header height="auto" class="padding-bottom-10">
      <create-or-update-store-work-shift-dialog @saved="getListStoreWorkShiftByStore" ref="dialogForm"/>
      <update-store-work-shift-user-dialog @saved="getListStoreWorkShiftByStore" ref="updateStoreWorkShiftUserDialog"/>
      <el-row type="flex" align="middle" justify="end">
        <el-button type="primary" @click="createStoreWorkShift">Tạo mới</el-button>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="10" class="margin-0">
        <el-col :span="colSize" v-for="shift in storeWorkShifts" :key="shift.guid">
          <el-card :body-style="{padding: '10px'}" shadow="never">
            <div slot="header">
              <el-row type="flex" align="middle">
                <el-col>
                  <span class="text-bold text-dark">{{shift.storeWorkShiftName}}</span>
                </el-col>
                <el-dropdown trigger="click">
                  <el-button size="mini" type="success" plain>
                    <i class="el-icon-setting"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editStoreWorkShift(shift)">Sửa</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteStoreWorkShift(shift)">Xoá</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-row>
            </div>
            <div>
              <el-row>
                <template v-if="shift.listStoreWorkShiftUser && shift.listStoreWorkShiftUser.length">
                  <el-row class="padding-bottom-10" type="flex" align="middle" v-for="workShiftUser in shift.listStoreWorkShiftUser" :key="workShiftUser.userLogin">
                    <el-col>
                      <el-tag class="full-width">
                        <span>{{workShiftUser.fullName}}</span>
                      </el-tag>
                    </el-col>
                    <el-tooltip>
                      <div slot="content">
                        <div>SĐT: {{workShiftUser.userPhone}}</div>
                        <div>Email: {{workShiftUser.userEmail}}</div>
                      </div>
                      <el-button class="margin-left-10" type="info" size="small" plain>
                        <i class="el-icon-info"></i>
                      </el-button>
                    </el-tooltip>
                  </el-row>
                </template>
                <el-alert type="warning" class="padding-20-0 margin-bottom-10" v-else :closable="false" center>
                  <el-row type="flex" align="middle">
                    <span>Chưa có nhân viên nào làm ca này</span>
                  </el-row>
                </el-alert>
              </el-row>
              <el-button class="full-width" size="small" type="warning" plain @click="editStoreWorkShiftUser(shift)">
                <i class="el-icon-edit"></i>
                <span>Sửa danh sách</span>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="margin-10-5">
        <admin-store-work-shift-assign-table :store-work-shifts="storeWorkShifts" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import CreateOrUpdateStoreWorkShiftDialog
    from '@/views/private/admin/store/detail/work-shift/CreateOrUpdateStoreWorkShiftDialog';
  import AdminStoreWorkShiftService from '@/service/admin/admin.store-work-shift.service';
  import MessageBoxUtils from '@/utils/message-box.util';
  import ErrorUtils from '@/utils/error.util';
  import UpdateStoreWorkShiftUserDialog
    from '@/views/private/admin/store/detail/work-shift/UpdateStoreWorkShiftUserDialog';
  import AdminStoreWorkShiftAssignTable
    from '@/views/private/admin/store/detail/work-shift/AdminStoreWorkShiftAssignTable';

  export default {
    name: 'AdminStoreDetailWorkShift',
    components: {AdminStoreWorkShiftAssignTable, UpdateStoreWorkShiftUserDialog, CreateOrUpdateStoreWorkShiftDialog},
    data() {
      return {
        storeWorkShifts: [],
        colSize: 6,
      };
    },
    created() {
      this.getListStoreWorkShiftByStore();
    },
    methods: {
      createStoreWorkShift() {
        this.$refs.dialogForm.create();
      },
      editStoreWorkShift(shift) {
        this.$refs.dialogForm.edit(shift);
      },
      editStoreWorkShiftUser(shift) {
        this.$refs.updateStoreWorkShiftUserDialog.edit(shift);
      },
      async getListStoreWorkShiftByStore() {
        try {
          const {data} = await AdminStoreWorkShiftService.getListStoreWorkShiftByStore(this.$route.params.storeGuid);
          this.storeWorkShifts = data;
          this.colSize = Math.floor(24 / data.length);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
      async deleteStoreWorkShift(shift) {
        await MessageBoxUtils.confirmPromise('Xoá ca làm việc này?');
        try {
          await AdminStoreWorkShiftService.deleteStoreWorkShift(shift.guid);
          this.getListStoreWorkShiftByStore();
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
    },
  };
</script>

<style scoped>
  /deep/ .el-card__header {
    padding: 10px;
  }

  /deep/ .el-alert {
    padding: 10px;
  }

</style>
