<template>
  <el-container direction="vertical">
    <el-main>
      <el-row class="padding-bottom-10" type="flex" align="middle">
        <el-col>
          <el-row type="flex" align="middle">
            <el-button>Người dùng: {{numberUser}}</el-button>
            <el-button>Khách: {{numberGuest}}</el-button>
          </el-row>
        </el-col>
        <el-button :loading="isRefreshing" @click="refresh">Làm mới</el-button>
      </el-row>
      <raw-data-table show-index :data="Object.keys(activeUsers)">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-tracker-row-detail :row="row" />
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Tên đăng nhập">
          <template slot-scope="{row}">
            <span>{{row}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Số kết nối websocket">
          <template slot-scope="{row}">
            <span v-if="activeUsers[row].sessions">{{activeUsers[row].sessions.length}}</span>
          </template>
        </el-table-column>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import AdminTrackerRowDetail from "@/views/private/admin/tracker/AdminTrackerRowDetail";

  export default {
    name: "AdminTracker",
    components: {AdminTrackerRowDetail, RawDataTable},
    computed: {
      ...mapState({
        activeUsers: state => {
          let arr = {};
          Object.keys(state.adminStore.activeUsers).forEach(key => {
            if (state.adminStore.activeUsers[key].sessions.length){
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
      })
    },
    data(){
      return {
        isRefreshing: false
      };
    },
    methods: {
      async refresh(){
        this.isRefreshing = true;
        await this.$store.dispatch("adminStore/getActiveUsers");
        this.isRefreshing = false;
      }
    }
  };
</script>

<style scoped></style>
