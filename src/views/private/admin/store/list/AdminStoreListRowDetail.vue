<template>
  <el-row type="flex" align="middle">
    <el-col :span="4" :xs="24">
      <el-image
        style="width: 160px; height:90px"
        :src="row.storeImageUrl"
        fit="cover"
        :preview-src-list="[row.storeImageUrl]"
      >
        <div slot="error" class="image-error-slot full-size">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-col>
    <el-col :span="20" :xs="24">
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
                {{ $t("private.adminStoreListPage.storeEntity.storeTaxCode") }}
              </td>
              <td>{{ row.storeTaxCode }}</td>
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
                {{$t("private.adminStoreListPage.storeEntity.previousUpdateReason")}}
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

  export default {
    name: "AdminStoreListRowDetail",
    props: {
      row: {
        type: Object,
        required: true
      }
    },
    methods: {}
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
