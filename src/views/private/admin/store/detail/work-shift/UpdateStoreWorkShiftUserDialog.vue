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
        <el-select v-model="form.listUser" multiple class="full-width" @change="changeSelectUser">
          <el-option v-for="user in storeUsers" :key="user.userLogin" :label="user.fullName"
                     :value="user.userLogin"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="form.listUser">
      <el-row type="flex" align="middle" class="padding-10-0" v-for="userLogin in form.listUser" :key="userLogin">
        <el-col :span="5">
          <span v-if="storeUsersObject[userLogin]">{{storeUsersObject[userLogin].fullName}}</span>
        </el-col>
        <el-col :span="5">
          <el-checkbox v-model="allChecked[userLogin]" @change="toggleSelectAll($event, userLogin)">Cả tuần</el-checkbox>
        </el-col>
        <el-col :span="14" >
          <el-checkbox-group @change="changeSelectGroup($event, userLogin)" v-model="selectedWorkDays[userLogin]" class="full-width">
            <el-checkbox v-for="item in weekDays" :key="userLogin + item" :label="item"></el-checkbox>
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
          listUser: null,
          listWorkDay: null,
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
        let listUserLogin = [];
        this.selectedWorkDays = {};
        this.allChecked = {};
        entity.listUser.forEach(workShiftUser => {
          const login = workShiftUser.userLogin;
          listUserLogin.push(login);
          let userWorkDays = workShiftUser.workDay ? workShiftUser.workDay.split(";") : [];
          this.$set(this.selectedWorkDays, login, userWorkDays);
          if (userWorkDays.length === 7){
            this.$set(this.allChecked, login, true);
          } else {
            this.$set(this.allChecked, login, false);
          }
        });
        listUserLogin = entity.listUser.map(item => item.userLogin);
        this.storeWorkShift = {
          ...AppUtils.deepCopy(entity),
        };
        this.form = {
          storeWorkShiftGuid: entity.guid,
          listUser: listUserLogin,
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
              this.form.listUser.forEach((userLogin, index) => {
                this.form.listWorkDay[index] = this.selectedWorkDays[userLogin].sort().join(";");
              });
              this.isLoading = true;
              await AdminStoreWorkShiftUserService.updateStoreWorkShift(this.form);
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
      changeSelectGroup(value, userLogin){
        if (this.selectedWorkDays[userLogin].length === 7){
          this.$set(this.allChecked, userLogin, true);
        } else {
          this.$set(this.allChecked, userLogin, false);
        }
      },
      toggleSelectAll(value, userLogin){
        if (value){
          this.$set(this.allChecked, userLogin, true);
          this.$set(this.selectedWorkDays, userLogin, this.weekDays);
        } else {
          this.$set(this.allChecked, userLogin, false);
          this.$set(this.selectedWorkDays, userLogin, []);
        }
      },
      changeSelectUser(listUserLogin){
        listUserLogin.forEach(userLogin => {
          if (!this.selectedWorkDays[userLogin]) this.$set(this.selectedWorkDays, userLogin, []);
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
            this.storeUsersObject[item.userLogin] = item;
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
