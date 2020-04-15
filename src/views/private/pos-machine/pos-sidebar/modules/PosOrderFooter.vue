<template>
  <el-footer class="bg-success" :height="showAdvanced ? '240px' : '110px'">
    <el-container class="full-size padding-10" direction="vertical">
      <el-header height="40px">
        <el-row type="flex">
          <el-col class="margin-right-10">
            <el-input placeholder="SĐT Khách Hàng">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-button v-if="!showAdvanced" @click="showAdvanced = true"><i class="el-icon-arrow-up"></i></el-button>
          <el-button v-else @click="showAdvanced = false"><i class="el-icon-arrow-down"></i></el-button>
        </el-row>
      </el-header>
      <el-main>
        <div v-if="showAdvanced">
          <el-row type="flex" class="padding-top-10">
            <el-col>
              <el-input placeholder="Mã khuyến mãi">
                <i slot="prefix" class="el-input__icon el-icon-discount"></i>
                <el-button slot="append">Tìm</el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" class="padding-top-10">
            <el-col class="text-light text-bold" style="line-height: 24px" :span="16">
              <span>Ngày cấp:</span>
              <br>
              <span>Giảm giá:</span>
            </el-col>
            <el-col :span="8">
              <el-button class="full-width">Áp dụng</el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider v-if="showAdvanced" class="margin-10-0"></el-divider>
      </el-main>
      <el-footer height="40px">
        <el-row type="flex" align="middle">
          <el-col class="text-light text-bold" :span="16">
            <span>Tổng: </span>
            <span>{{200000 | price }}</span>
          </el-col>
          <el-col :span="8">
            <el-button class="full-width">Thanh toán</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-footer>
</template>

<script>
  export default {
    name: "PosOrderFooter",
    data() {
      return {
        showAdvanced: false,
      };
    }
  };
</script>

<style scoped>

</style>
