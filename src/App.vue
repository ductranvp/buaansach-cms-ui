<template>
  <div id="app">
    <ribbon />
    <router-view/>
  </div>
</template>

<script>

  import Ribbon from "@/components/ribbon/Ribbon";
  import PublicVersionService from '@/service/shared/public.version.service';
  import VersionType from '@/enum/VersionType';
  import StorageKey from '@/utils/storage-key';
  import {Notification} from 'element-ui';
  export default {
    name: "App",
    components: {Ribbon},
    data(){
      return {
        error: null
      };
    },
    created(){
      this.checkVersion();
    },
    mounted(){
      window.addEventListener("load", (event) => {
        if (!navigator.onLine){
          this.showConnectionError();
        }
      });
      window.addEventListener("offline", (event) => {
        this.showConnectionError();
      });

      window.addEventListener("online", (event) => {
        this.hideConnectionError();
      });
    },
    methods: {
      showConnectionError(){
        if (this.error) return;
        this.error = Notification.error({
          title: "Mất kết nối internet.",
          message: "<span>Kiểm tra lại kết nối mạng!</span>",
          dangerouslyUseHTMLString: true,
          showClose: false,
          duration: 0
        });
      },
      hideConnectionError(){
        if (this.error){
          this.error.close();
          this.error = null;
        }
      },
      async checkVersion(){
        const {data: cloudVersion} = await PublicVersionService.getLatestVersion(VersionType.value.CMS_UI);
        if (cloudVersion){
          const localVersion = JSON.parse(localStorage.getItem(StorageKey.localStorageKeys.LATEST_VERSION));
          if (!localVersion || localVersion !== cloudVersion) {
            localStorage.setItem(StorageKey.localStorageKeys.LATEST_VERSION, JSON.stringify(cloudVersion));
            window.location.reload();
          }
        }
      },
    }
  };
</script>
<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
    font-size: 100%;
  }
  body {
    overflow-y: hidden;
  }
</style>
