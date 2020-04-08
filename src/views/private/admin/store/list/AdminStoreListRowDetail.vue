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
                {{ $t("private.adminStoreListPage.store.storeAddress") }}
              </td>
              <td>{{ row.storeAddress }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.store.storeOwnerEmail") }}
              </td>
              <td>{{ row.storeOwnerEmail }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("private.adminStoreListPage.store.storeTaxCode") }}
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
                {{$t("private.adminStoreListPage.activeTime")}}
              </td>
              <td>{{ row.storeOpenHour }} - {{ row.storeCloseHour }}</td>
            </tr>
            <tr>
              <td>
                {{ $t("common.entity.audit.lastModifiedDate") }}
              </td>
              <td>
                {{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("common.entity.audit.lastModifiedBy") }}
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
