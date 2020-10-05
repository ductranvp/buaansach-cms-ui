<!--<template>-->
<!--  <el-container direction="vertical" class="full-size">-->
<!--    <el-header>-->
<!--      <el-row type="flex" align="middle">-->
<!--        <div class="padding-right-10">-->
<!--          <el-date-picker-->
<!--            :format="dateFormat"-->
<!--            v-model="dateRange"-->
<!--            type="datetimerange"-->
<!--            :picker-options="pickerOptions"-->
<!--            range-separator="tới"-->
<!--            start-placeholder="Ngày bắt đầu"-->
<!--            end-placeholder="Ngày kết thúc"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
<!--        <el-button @click="getStatistic">Thống kê</el-button>-->
<!--      </el-row>-->
<!--    </el-header>-->
<!--    <el-main class="full-size" v-loading="isLoading">-->

<!--      <el-row type="flex" align="middle" v-if="!isLoading">-->
<!--        <el-col :span="6">-->
<!--          <el-card shadow="never">-->
<!--            <el-main class="padding-10-20 bg-info text-light">-->
<!--              <el-row>-->
<!--                <span class="text-bold">Số SĐT đã đăng ký</span>-->
<!--              </el-row>-->
<!--              <el-row type="flex" align="middle" style="height: 40px">-->
<!--                <el-col>-->
<!--                  <span class="text-very-large text-bold">{{parsedReportData.listTotal.length}}</span>-->
<!--                </el-col>-->
<!--                <el-col class="text-right">-->
<!--                  <el-button @click="showDetail(parsedReportData.listTotal)">Chi tiết</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-main>-->
<!--          </el-card>-->
<!--        </el-col>-->

<!--        <el-col :span="6">-->
<!--          <el-card shadow="never">-->
<!--            <el-main class="padding-10-20 bg-success text-light">-->
<!--              <el-row>-->
<!--                <span class="text-bold">Số SĐT có Zalo</span>-->
<!--              </el-row>-->
<!--              <el-row type="flex" align="middle" style="height: 40px">-->
<!--                <el-col>-->
<!--                  <span class="text-very-large text-bold">{{parsedReportData.listHasZalo.length}}</span>-->
<!--                </el-col>-->
<!--                <el-col class="text-right">-->
<!--                  <el-button @click="showDetail(parsedReportData.listHasZalo)">Chi tiết</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-main>-->
<!--          </el-card>-->
<!--        </el-col>-->

<!--        <el-col :span="6">-->
<!--          <el-card shadow="never">-->
<!--            <el-main class="padding-10-20 bg-warning text-light">-->
<!--              <el-row>-->
<!--                <span class="text-bold">Số SĐT không có Zalo</span>-->
<!--              </el-row>-->
<!--              <el-row type="flex" align="middle" style="height: 40px">-->
<!--                <el-col>-->
<!--                  <span class="text-very-large text-bold">{{parsedReportData.listNoZalo.length}}</span>-->
<!--                </el-col>-->
<!--                <el-col class="text-right">-->
<!--                  <el-button @click="showDetail(parsedReportData.listNoZalo)">Chi tiết</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-main>-->
<!--          </el-card>-->
<!--        </el-col>-->

<!--        <el-col :span="6">-->
<!--          <el-card shadow="never">-->
<!--            <el-main class="padding-10-20 bg-danger text-light">-->
<!--              <el-row>-->
<!--                <span class="text-bold">Số SĐT chưa kiểm tra</span>-->
<!--              </el-row>-->
<!--              <el-row type="flex" align="middle" style="height: 40px">-->
<!--                <el-col>-->
<!--                  <span class="text-very-large text-bold">{{parsedReportData.listUnknown.length}}</span>-->
<!--                </el-col>-->
<!--                <el-col class="text-right">-->
<!--                  <el-button @click="showDetail(parsedReportData.listUnknown)">Chi tiết</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-main>-->
<!--          </el-card>-->
<!--        </el-col>-->

<!--      </el-row>-->
<!--      <customer-statistic-detail-dialog ref="detailDialog" />-->
<!--    </el-main>-->
<!--  </el-container>-->
<!--</template>-->

<!--<script>-->
<!--  import CustomerCareCustomerService from "@/service/customer-care/customer-care.customer.service";-->
<!--  import NotificationUtils from "@/utils/notification.util";-->
<!--  import CustomerStatisticDetailDialog-->
<!--    from "@/views/private/customer-care/customer-voucher/CustomerStatisticDetailDialog";-->

<!--  export default {-->
<!--    name: "CustomerStatistic",-->
<!--    components: {CustomerStatisticDetailDialog},-->
<!--    data() {-->
<!--      const defaultEnd = new Date();-->
<!--      const defaultStart = new Date();-->
<!--      defaultStart.setHours(0, 0, 0, 0);-->

<!--      return {-->
<!--        isLoading: false,-->
<!--        dateFormat: 'HH:mm:ss dd/MM/yyyy',-->
<!--        pickerOptions: {-->
<!--          shortcuts: [-->
<!--            {-->
<!--              text: 'Hôm nay',-->
<!--              onClick(picker) {-->
<!--                const end = new Date();-->
<!--                const start = new Date();-->
<!--                start.setHours(0, 0, 0, 0);-->
<!--                picker.$emit('pick', [start, end]);-->
<!--              }-->
<!--            },-->
<!--            {-->
<!--              text: 'Hôm qua',-->
<!--              onClick(picker) {-->
<!--                const end = new Date();-->
<!--                const start = new Date();-->
<!--                start.setTime(start.getTime() - 3600 * 1000 * 24);-->
<!--                start.setHours(0, 0, 0, 0);-->
<!--                end.setHours(0, 0, 0, 0);-->
<!--                end.setTime(end.getTime() - 1000);-->
<!--                picker.$emit('pick', [start, end]);-->
<!--              }-->
<!--            },-->
<!--            {-->
<!--              text: '7 ngày trước',-->
<!--              onClick(picker) {-->
<!--                const end = new Date();-->
<!--                const start = new Date();-->
<!--                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);-->
<!--                start.setHours(0, 0, 0, 0);-->
<!--                end.setHours(0, 0, 0, 0);-->
<!--                end.setTime(end.getTime() - 1000);-->
<!--                picker.$emit('pick', [start, end]);-->
<!--              }-->
<!--            },-->
<!--            {-->
<!--              text: '30 ngày trước',-->
<!--              onClick(picker) {-->
<!--                const end = new Date();-->
<!--                const start = new Date();-->
<!--                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);-->
<!--                start.setHours(0, 0, 0, 0);-->
<!--                end.setHours(0, 0, 0, 0);-->
<!--                end.setTime(end.getTime() - 1000);-->
<!--                picker.$emit('pick', [start, end]);-->
<!--              }-->
<!--            }]-->
<!--        },-->
<!--        form: {-->
<!--          startDate: null,-->
<!--          endDate: null,-->
<!--        },-->
<!--        dateRange: [defaultStart, defaultEnd],-->
<!--        reportData: {},-->
<!--        parsedReportData: {-->
<!--          listTotal: [],-->
<!--          listHasZalo: [],-->
<!--          listNoZalo: [],-->
<!--          listUnknown: [],-->
<!--        },-->
<!--      };-->
<!--    },-->
<!--    created(){-->
<!--      this.getStatistic();-->
<!--    },-->
<!--    methods: {-->
<!--      async getStatistic() {-->
<!--        try {-->
<!--          this.isLoading= true;-->
<!--          this.form.startDate = this.dateRange[0];-->
<!--          this.form.endDate = this.dateRange[1];-->
<!--          const {data} = await CustomerCareCustomerService.getStatistic(this.form);-->
<!--          this.reportData = data.listCustomer;-->
<!--          this.parseReportData();-->
<!--          this.isLoading= false;-->
<!--        } catch (e) {-->
<!--          this.isLoading= false;-->
<!--          NotificationUtils.error("Lỗi tải dữ liệu thống kê");-->
<!--        }-->
<!--      },-->
<!--      parseReportData(){-->
<!--        this.parsedReportData = {};-->
<!--        this.parsedReportData.listTotal = this.reportData;-->
<!--        this.parsedReportData.listHasZalo = this.reportData.filter(item => item.customerZaloStatus === 'EXIST');-->
<!--        this.parsedReportData.listNoZalo = this.reportData.filter(item => item.customerZaloStatus === 'NOT_EXIST');-->
<!--        this.parsedReportData.listUnknown = this.reportData.filter(item => item.customerZaloStatus === 'UNKNOWN');-->
<!--      },-->
<!--      showDetail(data){-->
<!--        this.$refs.detailDialog.show(data);-->
<!--      }-->
<!--    }-->
<!--  };-->
<!--</script>-->

<!--<style scoped>-->
<!--  /deep/ .el-card__header {-->
<!--    padding: 0-->
<!--  }-->

<!--  /deep/ .el-card__body {-->
<!--    padding: 0;-->
<!--    line-height: 30px;-->
<!--  }-->
<!--</style>-->
