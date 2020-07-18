<template>
  <el-row type="flex" align="middle">
    <table class="expanded-table">
      <thead>
      <tr>
        <th>Mã phiên</th>
        <th>Kết nối lúc</th>
        <th>Địa chỉ IP</th>
        <th>Vị trí</th>
        <th>Warp</th>
        <th>Trình duyệt</th>
        <th>Hệ điều hành</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in activeUsers[row].sessions" :key="item.sessionId">
        <td>{{item.sessionId}}</td>
        <td>{{item.time | moment("HH:mm:ss DD/MM/YYYY")}}</td>
        <td>{{item.cloudFlareTrace.ip}}</td>
        <td>{{item.cloudFlareTrace.loc}}</td>
        <td>{{item.cloudFlareTrace.warp}}</td>
        <td>
          <span v-if="item.userAgent.browser">{{item.userAgent.browser.name + " " + item.userAgent.browser.major}}</span>
        </td>
        <td>
          <span v-if="item.userAgent.os">{{item.userAgent.os.name + " " + item.userAgent.os.version}}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </el-row>
</template>

<script>
  import {mapState} from "vuex";
  import UAParser from "ua-parser-js";

  export default {
    name: "AdminTrackerRowDetail",
    computed: {
      ...mapState({
        activeUsers: state => {
          let arr = {};
          Object.keys(state.adminStore.activeUsers).forEach(key => {
            if (state.adminStore.activeUsers[key].sessions.length) {
              arr[key] = state.adminStore.activeUsers[key];
              arr[key].sessions.forEach(item => {
                if (item.cloudFlareTrace){
                  let parser = new UAParser();
                  parser.setUA(item.cloudFlareTrace.uag);
                  item.userAgent = parser.getResult();
                } else {
                  item.cloudFlareTrace = {};
                  item.userAgent = {};
                }
              });
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
    props: {
      row: {
        type: String,
        required: true
      }
    },
  };
</script>

<style scoped>
  .expanded-table {
    width: 100%;
  }

  .expanded-table tr td {
    border: none;
  }

  .expanded-table tr th {
    border-bottom: 1px solid #eee;
    border-right: none;
  }
</style>
