<template>
  <el-row type="flex">
    <el-col :span="11">
      <table class="expanded-table">
        <tr>
          <td>Email</td>
          <td>{{ row.email }}</td>
        </tr>
        <tr>
          <td>Số điệnt thoại</td>
          <td>
            <span>{{row.phone}}</span>
          </td>
        </tr>
        <tr>
          <td>Giới tính</td>
          <td>
            <el-tag size="mini" type="primary" v-if="row.gender === 'MALE'">Nam</el-tag>
            <el-tag size="mini" type="primary" v-else-if="row.gender === 'FEMALE'">Nữ</el-tag>
            <el-tag size="mini" type="primary" v-else>Chưa biết</el-tag>
          </td>
        </tr>
        <tr>
          <td>Ngày sinh</td>
          <td>
            <span v-if="row.birthday">{{row.birthday | moment("DD/MM/YYYY")}}</span>
          </td>
        </tr>
      </table>
    </el-col>
    <el-col :span="2">
      <el-divider direction="vertical" class="full-height"></el-divider>
    </el-col>
    <el-col :span="11">
      <table class="expanded-table">
        <tr>
          <td>Người tạo</td>
          <td>{{ row.createdBy }}</td>
        </tr>
        <tr>
          <td>Ngày tạo</td>
          <td>{{ row.createdDate | moment("HH:mm - DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td>Cập nhật cuối bởi:</td>
          <td>{{ row.lastModifiedBy }}</td>
        </tr>
        <tr>
          <td>Cập nhật cuối lúc:</td>
          <td>{{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}</td>
        </tr>
      </table>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "AdminStoreUserRowDetail",
    props: {
      row: {
        type: Object,
        required: true
      }
    },
  };
</script>

<style scoped>
  .expanded-image {
    width: 100px;
    height: 100px
  }

  .expanded-table {
    width: 100%;
  }

  .expanded-table tr td {
    border: none;
  }
</style>
