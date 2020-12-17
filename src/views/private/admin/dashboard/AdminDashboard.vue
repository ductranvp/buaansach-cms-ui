<template>
  <el-container direction="vertical">
    <create-or-update-version-dialog
      ref="versionDialog"
      @saved="getAllVersion"
    />
    <el-main>
      <el-row class="padding-bottom-10" type="flex">
        <el-button
          type="warning"
          @click="$router.push({ name: 'qrCreatorPage' })"
          >Tạo mã QR
        </el-button>
        <el-button type="warning" @click="updateSeatIdentity()"
          >Update Seat Identity
        </el-button>
      </el-row>
      <el-row class="padding-bottom-10">
        <el-button type="primary" @click="createVersion">
          <span>Tạo phiên bản</span>
        </el-button>
      </el-row>
      <el-row>
        <raw-data-table :data="versions">
          <el-table-column
            label="Tên phiên bản"
            prop="versionName"
          ></el-table-column>
          <el-table-column
            label="Số hiệu phiên bản"
            prop="versionNumber"
          ></el-table-column>
          <el-table-column
            label="Mô tả"
            prop="versionDescription"
          ></el-table-column>
          <el-table-column label="Loại phiên bản" prop="versionType">
            <template slot-scope="{ row }">
              <el-tag type="primary"
                >{{ versionTypeLabels[row.versionType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Deployed" prop="versionDeployed">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.versionDeployed"
                size="small"
                type="success"
                @click="toggleVersion(row)"
              >
                <span>Yes</span>
              </el-button>
              <el-button
                v-else
                size="small"
                type="danger"
                @click="toggleVersion(row)"
              >
                <span>No</span>
              </el-button>
            </template>
          </el-table-column>
          <template slot="action">
            <el-table-column>
              <template slot-scope="{ row }">
                <el-button size="mini" type="danger" @click="deleteVersion(row)"
                  >Xóa
                </el-button>
              </template>
            </el-table-column>
          </template>
        </raw-data-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import AdminVersionService from "@/service/admin/admin.version.service";
import CreateOrUpdateVersionDialog from "@/views/private/admin/version/CreateOrUpdateVersionDialog";
import RawDataTable from "@/components/raw-table-data/RawDataTable";
import VersionType from "@/enum/VersionType";
import ErrorUtils from "@/utils/error.util";
import AdminSeatIdentityService from "@/service/admin/admin.seat-identity.service";
import MessageUtils from "@/utils/message.util";

export default {
  name: "AdminDashboard",
  components: { RawDataTable, CreateOrUpdateVersionDialog },
  data() {
    return {
      versions: [],
      versionTypeLabels: VersionType.label
    };
  },
  created() {
    this.getAllVersion();
  },
  methods: {
    async updateSeatIdentity() {
      try {
        await AdminSeatIdentityService.updateAllSeatIdentity();
        MessageUtils.success("Thành công");
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      }
    },
    async getAllVersion() {
      const { data } = await AdminVersionService.getAllVersion();
      this.versions = data;
    },
    createVersion() {
      this.$refs.versionDialog.create();
    },
    editVersion(version) {
      this.$refs.versionDialog.edit(version);
    },
    deleteVersion(version) {},
    async toggleVersion(version) {
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
