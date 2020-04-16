<template>
  <el-footer class="bg-success padding-10" height="auto">
    <el-container class="full-size" direction="vertical">
      <el-header height="auto">
        <el-row type="flex" align="middle">
          <el-col class="margin-right-10">
            <el-input placeholder="SĐT Khách Hàng">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-button class="icon-button" type="success" v-if="!showAdvanced" @click="showAdvanced = true"><i
            class="el-icon-arrow-up"></i></el-button>
          <el-button class="icon-button" type="success" v-else @click="showAdvanced = false"><i
            class="el-icon-arrow-down"></i></el-button>
        </el-row>
      </el-header>

      <el-main>
        <template v-if="showAdvanced">
          <el-row type="flex" class="padding-top-10">
            <el-col>
              <el-input placeholder="Mã khuyến mãi">
                <i slot="prefix" class="el-input__icon el-icon-discount"></i>
                <el-button slot="append">Tìm</el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" class="padding-top-10" align="top">
            <el-col class="text-light text-bold" style="line-height: 25px" :span="14">
              <span>Ngày cấp:</span>
              <br>
              <span>Giảm giá:</span>
            </el-col>
            <el-col :span="10">
              <el-button class="full-width">Áp dụng</el-button>
            </el-col>
          </el-row>
        </template>
      </el-main>
      <el-footer height="auto">
        <el-divider class="margin-10-0"></el-divider>
        <el-row type="flex" align="middle">
          <el-col class="text-light text-bold" :span="14">
            <span>Tổng: </span>
            <span>{{200000 | price }}</span>
          </el-col>
          <el-col :span="10">
            <el-button class="full-width">
              <i class="el-icon-printer"></i>
              <span>IN HÓA ĐƠN</span>
            </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-footer>
</template>

<script>
  export default {
    name: "PosSidebarFooter",
    data() {
      return {
        showAdvanced: false,
      };
    }
  };
</script>

<style scoped>
  .icon-button {
    padding: 0;
    height: 40px;
    width: 50px;
    font-size: 28px
  }
</style>
