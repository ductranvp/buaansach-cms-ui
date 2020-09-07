<!--<template>-->
<!--  <el-dialog-->
<!--    :visible.sync="dialogFormVisible"-->
<!--    :before-close="beforeClose"-->
<!--    :fullscreen="true"-->
<!--    :show-close="false"-->
<!--    :append-to-body="true"-->
<!--  >-->
<!--    <div slot="title">-->
<!--      <el-row type="flex" align="middle">-->
<!--        <el-col>-->
<!--          <span>Danh sách SĐT</span>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
<!--    <el-main>-->
<!--      <raw-data-table :data="reportData" show-index show-audit>-->
<!--          <el-table-column prop="customerCode" label="Mã KH"></el-table-column>-->
<!--          <el-table-column prop="customerName" label="Tên KH"></el-table-column>-->
<!--          <el-table-column prop="customerPhone" label="SĐT KH"></el-table-column>-->
<!--          <el-table-column prop="customerGender" label="Giới tính">-->
<!--            <template slot-scope="{row}">-->
<!--              <el-tag v-if="row.customerGender === 'MALE'">Nam</el-tag>-->
<!--              <el-tag v-else-if="row.customerGender === 'FEMALE'">Nữ</el-tag>-->
<!--              <el-tag v-else>Chưa biết</el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--      </raw-data-table>-->
<!--    </el-main>-->
<!--    <div slot="footer">-->
<!--      <el-button @click="hide">-->
<!--        <span>{{$t("common.entity.action.close")}}</span>-->
<!--      </el-button>-->
<!--    </div>-->
<!--  </el-dialog>-->
<!--</template>-->

<!--<script>-->

<!--  import RawDataTable from "@/components/raw-table-data/RawDataTable";-->

<!--  export default {-->
<!--    name: "CustomerStatisticDetailDialog",-->
<!--    components: {RawDataTable},-->
<!--    data() {-->
<!--      return {-->
<!--        dialogFormVisible: false,-->
<!--        reportData: [],-->
<!--        reportType: null,-->
<!--      };-->
<!--    },-->
<!--    methods: {-->
<!--      show(data, type) {-->
<!--        this.reportData = data;-->
<!--        this.reportType = type;-->
<!--        this.dialogFormVisible = true;-->
<!--      },-->
<!--      hide() {-->
<!--        this.dialogFormVisible = false;-->
<!--        this.reportData = [];-->
<!--      },-->
<!--      beforeClose(done) {-->
<!--        this.reportData = [];-->
<!--        done();-->
<!--      },-->
<!--    }-->
<!--  };-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
