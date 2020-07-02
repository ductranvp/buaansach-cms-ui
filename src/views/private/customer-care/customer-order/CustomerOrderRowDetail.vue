<template>
  <el-row type="flex">
    <el-col :span="11">
      <table class="expanded-table">
        <tr>
          <td>Tên khách</td>
          <td>{{ row.customerName }}</td>
        </tr>
        <tr>
          <td>Giới tính</td>
          <td>
            <span v-if="row.customerGender === 'MALE'">Nam</span>
            <span v-else-if="row.customerGender === 'FEMALE'">Nữ</span>
            <span v-else>Chưa biết</span>
          </td>
        </tr>
        <tr>
          <td>Mã cửa hàng</td>
          <td>{{ row.storeCode }}</td>
        </tr>
        <tr>
          <td>Tên cửa hàng</td>
          <td>{{ row.storeName }}</td>
        </tr>
      </table>
    </el-col>
    <el-col :span="2">
      <el-divider direction="vertical" class="full-height"></el-divider>
    </el-col>
    <el-col :span="11">
      <table class="expanded-table">
        <tr>
          <td>{{ $t("common.entity.audit.createdDate") }}</td>
          <td>{{ row.createdDate | moment("HH:mm - DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td>{{ $t("common.entity.audit.createdBy") }}</td>
          <td>{{ row.createdBy }}</td>
        </tr>
        <tr>
          <td>{{ $t("common.entity.audit.lastModifiedDate") }}</td>
          <td>{{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td>{{ $t("common.entity.audit.lastModifiedBy") }}</td>
          <td>{{ row.lastModifiedBy }}</td>
        </tr>
      </table>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "CustomerOrderRowDetail",
    props: {
      row: {
        type: Object,
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
</style>
