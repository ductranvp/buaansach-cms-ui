<template>
  <el-row type="flex" align="middle">
    <el-col :span="6" :xs="24">
      <el-image
        style="width: 240px; height:135px"
        :src="row.storeImageUrl"
        fit="cover"
        :preview-src-list="[row.storeImageUrl]"
      >
        <div slot="error" class="image-error-slot full-size">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-col>
    <el-col :span="16" :xs="24">
      <el-row type="flex">
        <el-col :span="13">
          <table class="expanded-table">
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.storeAddress") }}
              </td>
              <td>{{ row.storeAddress }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.storeOwnerEmail") }}
              </td>
              <td>{{ row.storeOwnerEmail }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.storeOwnerLogin") }}
              </td>
              <td>{{ row.storeOwnerLogin }}</td>
            </tr>
            <tr>
              <td colspan="2">
                <el-button
                  type="info"
                  plain
                  size="mini"
                  @click="handleChangeOwner(row)"
                >
                  <span>{{
                    $t("private.adminStoreListPage.changeOwner.triggerBtn")
                  }}</span>
                </el-button>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical" class="full-height"></el-divider>
        </el-col>
        <el-col :span="10">
          <table class="expanded-table">
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.storeTaxCode") }}
              </td>
              <td>{{ row.storeTaxCode }}</td>
            </tr>
            <tr>
              <td>
                {{
                  $t("private.adminStoreListPage.storeEntity.previousUpdateReason")
                }}
              </td>
              <td>{{ row.lastUpdateReason }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.lastModifiedDate") }}
              </td>
              <td>
                {{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.storeEntity.lastModifiedBy") }}
              </td>
              <td>{{ row.lastModifiedBy }}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import MessageBoxUtils from "@/utils/message-box.util";
import StoreService from "@/service/store.service";
import NotificationUtils from "@/utils/notification.util";

export default {
  name: "RowDetail",
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleChangeOwner(row) {
      const vm = this;
      const title = vm.$t("private.adminStoreListPage.changeOwner.title");
      const msg = vm.$t("private.adminStoreListPage.changeOwner.inputPlaceholder");
      MessageBoxUtils.prompt(title, msg, false, function(response) {
        const dto = {
          storeGuid: row.guid,
          usernameOrEmail: response.value
        };
        StoreService.changeStoreOwner(dto)
          .then(() => {
            const successMessage = vm.$t(
              "private.adminStoreListPage.changeOwner.successMessage"
            );
            NotificationUtils.success(successMessage);
            vm.$emit("ownerChanged");
          })
          .catch(error => {
            const errorMessage =
              error.message ||
              error.data.message ||
              vm.$t("private.adminStoreListPage.changeOwner.errorMessage");
            NotificationUtils.error(errorMessage);
          });
      });
    }
  }
};
</script>

<style scoped>
.expanded-table {
  width: 100%;
}

.expanded-table tr td {
  border: none;
  /*padding: 0px 0px 5px 0px;*/
}
</style>
