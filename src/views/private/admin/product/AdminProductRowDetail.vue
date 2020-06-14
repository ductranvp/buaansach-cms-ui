<template>
  <el-row type="flex" align="middle">
    <el-col :span="4" :xs="24">
      <el-image class="product-image" :src="row.productThumbnailUrl" fit="cover" :preview-src-list="[row.productThumbnailUrl]">
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
              <td>{{ row.productDescription }}</td>
            </tr>
            <tr>
              <td>Giá gốc</td>
              <td>{{ row.productRootPrice | priceAppend }}</td>
            </tr>
            <tr>
              <td>Giảm giá</td>
              <td>{{ row.productDiscount | priceAppend }}</td>
            </tr>
            <tr>
              <td>Hiển thị</td>
              <td>
                <el-tag v-if="row.productDisplay === 'DEFAULT'" type="primary">Mặc định</el-tag>
                <el-tag v-if="row.productDisplay === 'HIGHLIGHT'" type="primary">Nổi bật</el-tag>
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
    name: "AdminProductRowDetail",
    props: {
      row: {
        type: Object,
        required: true
      }
    },
  };
</script>

<style scoped>
  .product-image {
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
