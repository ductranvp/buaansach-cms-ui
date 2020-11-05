<template>
  <el-card shadow="never">
    <el-container class="full-width" direction="vertical">
      <el-main class="full-width">
        <el-row type="flex" class="full-width">
          <el-col :class="cellClass" :span="3"></el-col>
          <el-col :span="3" class="text-center" v-for="day in weekDays" :key="day.value" :class="[day.value === activeDay ? activeDayClass : '', cellClass]">
            <div class="text-bold padding-left-5">{{day.label}}</div>
          </el-col>
        </el-row>
        <el-divider class="margin-0 bg-warning-light"></el-divider>
        <template v-for="(shift, shiftIndex) in workShiftUsers">
          <el-row type="flex" class="full-width" :key="shift.guid">
            <el-col :span="3" :class="cellClass">
              <div class="text-bold">{{shift.storeWorkShiftName}}</div>
            </el-col>
            <template v-if="storeUsersObject">
              <el-col :span="3" v-for="day in weekDays" :key="day.value" :class="[day.value === activeDay ? activeDayClass : '', cellClass]">
                <div v-for="(userGuid, index) in shift[day.value]" :key="index + shift.guid" class="padding-5">
<!--                  <el-tag type="primary" :style="{background: storeUsersObject[userGuid].color, color: 'white'}" v-if="storeUsersObject[userGuid]">{{storeUsersObject[userGuid].fullName | firstName}}</el-tag>-->
                  <el-button :class="activeUserGuid === userGuid ? 'bg-success text-white' : ''" @click="toggleActiveUser(userGuid)" type="info" plain size="small" v-if="storeUsersObject[userGuid]">
                    <span>{{storeUsersObject[userGuid].fullName | firstName}}</span>
                  </el-button>
                </div>
              </el-col>
            </template>
          </el-row>
          <el-divider class="margin-0 bg-warning-light" v-if="shiftIndex !== workShiftUsers.length - 1" :key="shiftIndex + shift.guid"></el-divider>
        </template>
      </el-main>
    </el-container>
  </el-card>
</template>

<script>

  import AdminStoreUserService from '@/service/admin/admin.store-user.service';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'AdminStoreWorkShiftAssignTable',
    props: {
      storeWorkShifts: Array,
    },
    computed: {
      workShiftUsers(){
        let result = [];
        this.storeWorkShifts.forEach(storeWorkShift => {
          let shift = {
            guid: storeWorkShift.guid,
            storeWorkShiftName: storeWorkShift.storeWorkShiftName,
          };
          storeWorkShift.listStoreWorkShiftUser.forEach(workShiftUser => {
            for (let i = 0; i < 7; i++){
              if (!shift[i]) shift[i] = [];
              if (workShiftUser.workDay.includes(i)) shift[i].push(workShiftUser.userGuid);
            }
          });
          result.push(shift);
        });
        return result;
      }
    },
    data() {
      let date = new Date();
      return {
        cellClass: 'padding-10-0',
        activeDay: date.getDay(),
        activeDayClass: 'border-cell',
        activeUserGuid: null,
        weekDays: [
          {label: 'Thứ 2', value: 0},
          {label: 'Thứ 3', value: 1},
          {label: 'Thứ 4', value: 2},
          {label: 'Thứ 5', value: 3},
          {label: 'Thứ 6', value: 4},
          {label: 'Thứ 7', value: 5},
          {label: 'Chủ Nhật', value: 6},
        ],
        storeUsers: [],
        storeUsersObject: null,
        predefineColors: [
          '#ff4500',
          '#ff8c00',
          '#ffd904',
          '#4bb846',
          '#00ced1',
          '#1e90ff',
          '#c71585'
        ],
      };
    },
    created(){
      this.getStoreUser();
    },
    methods: {
      toggleActiveUser(userGuid){
        if (this.activeUserGuid === userGuid) this.activeUserGuid = null;
        else this.activeUserGuid = userGuid;
      },
      async getStoreUser() {
        try {
          const {data} = await AdminStoreUserService.getListStoreUserByStoreGuid(this.$route.params.storeGuid);
          this.storeUsers = data.map(item => {
            item.isLoading = false;
            return item;
          });
          let temp = {};
          data.forEach((item, index) => {
            item.color = this.predefineColors[index];
            temp[item.userGuid] = item;
          });
          this.storeUsersObject = temp;
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .bg-warning-light {
    background: $--color-warning;
  }

  .border-cell {
    border: 2px dashed $--color-warning;
    border-top-width: 0;
    border-bottom-width: 0;
  }
</style>