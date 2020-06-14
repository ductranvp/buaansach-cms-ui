<template>
  <el-row type="flex" align="middle">
    <el-col :span="4" :xs="24">
      <el-image class="expanded-image" :src="row.imageUrl" fit="cover" :preview-src-list="[row.imageUrl]">
        <div slot="error" class="image-error-slot full-size">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-col>
    <el-col :span="20" :xs="24">
      <el-row type="flex">
        <el-col :span="11">
          <table class="expanded-table">
            <tr>
              <td>Mã người dùng</td>
              <td>{{ row.code }}</td>
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
            <tr>
              <td>Địa chỉ</td>
              <td>
                <span class="no-break-word">{{row.address}}</span>
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
              <td>Người sửa cuối:</td>
              <td>{{ row.lastModifiedBy }}</td>
            </tr>
            <tr>
              <td>Ngày sửa cuối:</td>
              <td>{{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "AdminUserRowDetail",
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
