<template>
  <el-row type="flex" align="middle">
    <table class="expanded-table">
      <thead>
      <tr>
        <th>Session ID</th>
        <th>Connected Time</th>
        <th>IP Address</th>
        <th>Location</th>
        <th>Warp</th>
        <th>Browser</th>
        <th>Device OS</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in activeUsers[row].sessions" :key="item.sessionId">
        <td>{{item.sessionId}}</td>
        <td>{{item.time | moment("HH:mm:ss DD/MM/YYYY")}}</td>
        <td>{{item.cloudFlareTrace.ip}}</td>
        <td>{{item.cloudFlareTrace.loc}}</td>
        <td>{{item.cloudFlareTrace.warp}}</td>
        <td>{{item.userAgent.browser.name + " - " + item.userAgent.browser.major}}</td>
        <td>{{item.userAgent.os.name + " - " + item.userAgent.os.version}}</td>
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
                let parser = new UAParser();
                parser.setUA(item.cloudFlareTrace.uag);
                item.userAgent = parser.getResult();
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
