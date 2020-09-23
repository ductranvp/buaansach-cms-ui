<template>
  <el-container direction="vertical">
    <create-or-update-version-dialog @saved="getAllVersion" ref="versionDialog" />
    <el-main>
      <el-row class="padding-bottom-10">
        <el-button type="warning" @click="$router.push({name: 'qrCreatorPage'})">Tạo mã QR</el-button>
      </el-row>
      <el-row class="padding-bottom-10">
        <el-button type="primary" @click="createVersion">Tạo phiên bản</el-button>
      </el-row>
      <el-row>
        <raw-data-table :data="versions">
          <el-table-column prop="versionName" label="Tên phiên bản"></el-table-column>
          <el-table-column prop="versionNumber" label="Số hiệu phiên bản"></el-table-column>
          <el-table-column prop="versionDescription" label="Mô tả"></el-table-column>
          <el-table-column prop="versionType" label="Loại phiên bản">
            <template slot-scope="{row}">
              <el-tag type="primary">{{versionTypeLabels[row.versionType]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="versionDeployed" label="Deployed">
            <template slot-scope="{row}">
              <el-button size="small" type="success"
                         @click="toggleVersion(row)" v-if="row.versionDeployed">
                <span>Yes</span>
              </el-button>
              <el-button size="small" type="danger" @click="toggleVersion(row)" v-else>
                <span>No</span>
              </el-button>
            </template>
          </el-table-column>
          <template slot="action">
            <el-table-column>
              <template slot-scope="{row}">
                <el-button size="mini" type="danger" @click="deleteVersion(row)">Xóa</el-button>
              </template>
            </el-table-column>
          </template>
        </raw-data-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import AdminVersionService from '@/service/admin/admin.version.service';
  import CreateOrUpdateVersionDialog from '@/views/private/admin/version/CreateOrUpdateVersionDialog';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import VersionType from '@/enum/VersionType';
  import NotificationUtils from '@/utils/notification.util';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: "AdminDashboard",
    components: {RawDataTable, CreateOrUpdateVersionDialog},
    data() {
      return {
        versions: [],
        versionTypeLabels: VersionType.label
      };
    },
    created(){
      this.getAllVersion();
    },
    methods: {
      async getAllVersion(){
        const {data} = await AdminVersionService.getAllVersion();
        this.versions = data;
      },
      createVersion(){
        this.$refs.versionDialog.create();
      },
      editVersion(version){
        this.$refs.versionDialog.edit(version);
      },
      deleteVersion(version){

      },
      async toggleVersion(version){
        try {
          await AdminVersionService.updateVersion(version);
          version.versionDeployed = !version.versionDeployed;
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      }
    }
  };
</script>

<style scoped></style>
