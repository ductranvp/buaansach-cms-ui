<template>
  <el-dialog
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          :before-close="beforeClose"
          :destroy-on-close="true"
  >
    <div slot="title">
      <span>{{storeWorkShift.storeWorkShiftName}}</span>
    </div>
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item label="Chọn nhân viên">
        <el-select v-model="form.listUserGuid" multiple class="full-width" @change="changeSelectUser">
          <el-option v-for="storeUser in storeUsers" :key="storeUser.userGuid" :label="storeUser.fullName"
                     :value="storeUser.userGuid"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="form.listUserGuid">
      <el-row type="flex" align="middle" class="padding-10-0" v-for="userGuid in form.listUserGuid" :key="userGuid">
        <el-col :span="5">
          <span v-if="storeUsersObject[userGuid]">{{storeUsersObject[userGuid].fullName}}</span>
        </el-col>
        <el-col :span="5">
          <el-checkbox v-model="allChecked[userGuid]" @change="toggleSelectAll($event, userGuid)">Cả tuần</el-checkbox>
        </el-col>
        <el-col :span="14" >
          <el-checkbox-group @change="changeSelectGroup($event, userGuid)" v-model="selectedWorkDays[userGuid]" class="full-width">
            <el-checkbox v-for="item in weekDays" :key="userGuid + item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t('common.entity.action.cancel')}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t('common.entity.action.save')}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import ErrorUtils from '@/utils/error.util';
  import AdminStoreWorkShiftUserService from '@/service/admin/admin.store-work-shift-user.service';
  import AdminStoreUserService from '@/service/admin/admin.store-user.service';
  import AppUtils from '@/utils/app.util';

  export default {
    name: 'UpdateStoreWorkShiftUserDialog',
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        storeWorkShift: {},
        form: {
          storeWorkShiftGuid: null,
          listUserGuid: [],
          listWorkDay: [],
        },
        selectedWorkDays: {},
        allChecked: {},
        weekDays: ["2", "3", "4", "5", "6", "7", "CN"],
        formRules: {},
        storeUsers: [],
        storeUsersObject: {},
      };
    },
    methods: {
      edit(entity) {
        this.isEdit = true;
        let listUserGuid = [];
        this.selectedWorkDays = {};
        this.allChecked = {};
        entity.listStoreWorkShiftUser.forEach(workShiftUser => {
          const userGuid = workShiftUser.userGuid;
          listUserGuid.push(userGuid);
          let userWorkDays = workShiftUser.workDay ? workShiftUser.workDay.split(";") : [];
          this.$set(this.selectedWorkDays, userGuid, userWorkDays);
          if (userWorkDays.length === 7){
            this.$set(this.allChecked, userGuid, true);
          } else {
            this.$set(this.allChecked, userGuid, false);
          }
        });
        listUserGuid = entity.listStoreWorkShiftUser.map(item => item.userGuid);
        this.storeWorkShift = {
          ...AppUtils.deepCopy(entity),
        };
        this.form = {
          storeWorkShiftGuid: entity.guid,
          listUserGuid: listUserGuid,
          listWorkDay: []
        };
        this.show();
      },
      show() {
        this.getStoreUser();
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
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.form.listUserGuid.forEach((userGuid, index) => {
                this.form.listWorkDay[index] = this.selectedWorkDays[userGuid].sort().join(";");
              });
              this.isLoading = true;
              await AdminStoreWorkShiftUserService.updateStoreWorkShiftUser(this.form);
              this.$emit('saved');
              this.hide();
            } catch (error) {
              ErrorUtils.showErrorMessage(error);
            } finally {
              this.isLoading = false;
            }
          }
        });
      },
      changeSelectGroup(value, userGuid){
        if (this.selectedWorkDays[userGuid].length === 7){
          this.$set(this.allChecked, userGuid, true);
        } else {
          this.$set(this.allChecked, userGuid, false);
        }
      },
      toggleSelectAll(value, userGuid){
        if (value){
          this.$set(this.allChecked, userGuid, true);
          this.$set(this.selectedWorkDays, userGuid, this.weekDays);
        } else {
          this.$set(this.allChecked, userGuid, false);
          this.$set(this.selectedWorkDays, userGuid, []);
        }
      },
      changeSelectUser(listUserGuid){
        listUserGuid.forEach(userGuid => {
          if (!this.selectedWorkDays[userGuid]) this.$set(this.selectedWorkDays, userGuid, []);
        });
      },
      async getStoreUser() {
        try {
          const {data} = await AdminStoreUserService.getListStoreUserByStoreGuid(this.$route.params.storeGuid);
          this.storeUsers = data.map(item => {
            item.isLoading = false;
            return item;
          });
          data.forEach(item => {
            this.storeUsersObject[item.userGuid] = item;
          });
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
    },
  };
</script>

<style scoped>

</style>
