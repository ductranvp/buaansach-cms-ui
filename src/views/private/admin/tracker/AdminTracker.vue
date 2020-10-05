<template>
  <el-container direction="vertical">
    <el-main>
      <el-divider content-position="left">Thống kê truy cập trang {{customerDomain}}</el-divider>
      <el-row class="padding-bottom-10">
        <el-row type="flex" align="middle">
          <div class="padding-right-10">
            <el-date-picker
              :format="dateFormat"
              v-model="dateRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="tới"
              start-placeholder="Ngày bắt đầu"
              end-placeholder="Ngày kết thúc"
              align="right">
            </el-date-picker>
          </div>
          <el-button>Số lượt xem: {{pageView.totalPageView}}</el-button>
          <el-button>Số người xem: {{pageView.uniqueVisitor}}</el-button>
          <el-button :loading="isLoading" @click="getPageViewStatistic">Làm mới</el-button>
        </el-row>
      </el-row>
      <el-divider content-position="left">Người dùng đang online</el-divider>
      <el-row class="padding-bottom-10" type="flex" align="middle">
        <el-col>
          <el-row type="flex" align="middle">
            <el-button>Người dùng: {{numberUser}}</el-button>
            <el-button>Khách: {{numberGuest}}</el-button>
          </el-row>
        </el-col>
        <el-button :loading="isRefreshing" @click="refresh">Làm mới</el-button>
      </el-row>
      <raw-data-table default-expand-all show-index :data="Object.keys(activeUsers)">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-tracker-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Tên đăng nhập">
          <template slot-scope="{row}">
            <span>{{row}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Số lượng kết nôi">
          <template slot-scope="{row}">
            <span v-if="activeUsers[row].sessions">{{activeUsers[row].sessions.length}}</span>
          </template>
        </el-table-column>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import AdminTrackerRowDetail from '@/views/private/admin/tracker/AdminTrackerRowDetail';
  import AdminPageViewService from '@/service/admin/admin.page-view.service';
  import Constants from '@/utils/constants';

  export default {
    name: 'AdminTracker',
    components: {AdminTrackerRowDetail, RawDataTable},
    computed: {
      ...mapState({
        activeUsers: state => {
          let arr = {};
          Object.keys(state.adminStore.activeUsers).forEach(key => {
            if (state.adminStore.activeUsers[key].sessions.length) {
              arr[key] = state.adminStore.activeUsers[key];
            }
          });
          return arr;
        },
        numberUser: state => {
          return Object.keys(state.adminStore.activeUsers).filter(item => item !== 'anonymousUser').length;
        },
        numberGuest: state => {
          const temp = state.adminStore.activeUsers['anonymousUser'];
          if (!temp) return 0;
          return temp.sessions ? temp.sessions.length : 0;
        },
      }),
    },
    data() {
      const defaultEnd = new Date();
      const defaultStart = new Date();
      defaultStart.setHours(0, 0, 0, 0);
      defaultEnd.setHours(23, 59, 59, 0);

      return {
        isRefreshing: false,
        isLoading: true,
        dateFormat: 'HH:mm:ss dd/MM/yyyy',
        customerDomain: Constants.CUSTOMER_UI_URL,
        pickerOptions: {
          shortcuts: [
            {
              text: 'Hôm nay',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 0);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: 'Hôm qua',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '7 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '30 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              },
            }],
        },
        form: {
          storeGuid: null,
          userLogin: '',
          startDate: null,
          endDate: null,
        },
        dateRange: [defaultStart, defaultEnd],
        pageView: {},
      };
    },
    created() {
      this.getPageViewStatistic();
    },
    methods: {
      async getPageViewStatistic() {
        try {
          this.isLoading = true;
          const {data} = await AdminPageViewService.getPageViewStatistic({
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
          });
          this.pageView = data;
        } finally {
          this.isLoading = false;
        }
      },
      async refresh() {
        this.isRefreshing = true;
        await this.$store.dispatch('adminStore/getActiveUsers');
        this.isRefreshing = false;
      },
    },
  };
</script>

<style scoped>
  .el-divider__text {
    background: #f0f2f5
  }
</style>
