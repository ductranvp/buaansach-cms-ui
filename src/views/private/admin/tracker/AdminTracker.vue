<template>
  <el-container direction="vertical">
    <el-main>
      <el-row class="padding-bottom-10">
        <el-button :loading="isRefreshing" @click="refresh">Làm mới</el-button>
      </el-row>
      <raw-data-table show-index :data="Object.keys(activeUsers)">
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

  export default {
    name: "AdminTracker",
    components: {RawDataTable},
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
