<template>
  <el-row type="flex" align="middle">
    <el-col :span="4" :xs="24">
      <el-image class="expanded-image" :src="row.voucherImageUrl" fit="cover"
                :preview-src-list="[row.voucherImageUrl]">
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
              <td>Mô tả</td>
              <td>
                <span class="no-break-word">{{ row.voucherDescription }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-single-line">Hình thức giảm</td>
              <td>
                <el-tag size="medium" v-if="row.voucherDiscountType === 'VALUE'" type="primary">Giá trị</el-tag>
                <el-tag size="medium" v-if="row.voucherDiscountType === 'PERCENT'" type="primary">Phần trăm</el-tag>
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
    name: "AdminVoucherRowDetail",
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
    width: 120px;
    height: 120px
  }

  .expanded-table {
    width: 100%;
  }

  .expanded-table tr td {
    border: none;
  }
</style>
