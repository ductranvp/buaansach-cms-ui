<template>
  <div style="width: 0; height: 0; visibility: hidden">
    <iframe id="bill_group_frame" width="0" height="0" frameborder="0">
    </iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PriceUtils from "@/utils/price.util";
import AreaType from "@/enum/AreaType";
import DiscountType from "@/enum/DiscountType";

export default {
  name: "BillGroup",
  computed: {
    ...mapState({
      currentStore: state => state.posMachine.currentStore
    })
  },
  data() {
    return {
      listOrder: [],
      customerPay: null
    };
  },
  methods: {
    formatPrice(value, unit) {
      if (unit) unit = " " + unit;
      else unit = "";
      if (value === undefined || value == null) return value;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
    },
    getDate() {
      return this.$moment().format("DD/MM/YYYY HH:mm");
    },
    getOrderProductPrice(orderProduct) {
      const {
        orderProductPrice,
        orderProductDiscount,
        orderProductDiscountType
      } = orderProduct;
      return PriceUtils.getProductPrice(
        orderProductPrice,
        orderProductDiscount,
        orderProductDiscountType
      );
    },
    getOrderDiscount(order) {
      const { orderTotalAmount, orderDiscount, orderDiscountType } = order;
      return PriceUtils.getDiscountAmount(
        orderTotalAmount,
        orderDiscount,
        orderDiscountType
      );
    },
    getOrderPayAmount(order) {
      const {
        orderTotalAmount,
        orderDiscount,
        orderDiscountType,
        orderPointValue
      } = order;
      return PriceUtils.getPayAmount(
        orderTotalAmount,
        orderDiscount,
        orderDiscountType,
        orderPointValue
      );
    },
    getListOrderPayAmount(listOrder) {
      let total = 0;
      listOrder.forEach(order => {
        total += this.getOrderPayAmount(order);
      });
      return total;
    },
    getStyle() {
      let style = "<style>";
      style +=
        "html,body {margin: 0;padding: 0;width: 168px;height: auto;font-size: 8pt;font-family: Arial, Helvetica, sans-serif;}";
      style += ".text-center {text-align: center;}";
      style += ".text-left {text-align: center;}";
      style += ".text-right {text-align: right;}";
      style += ".pl-2 {padding-left: 2px;}";
      style += ".logo {width: 42px; height: 34px; padding-right: 5px}";
      style +=
        ".flex-center {display:flex; flex-direction: row; align-items: center; justify-content: center}";
      style += ".divider {border-top: 1px dashed black}";
      style += ".double-divider {border-top: 2px solid black}";
      style += "table {font-size: 8pt;width: 100%;}";
      style += "th {text-align: left;}";
      style += "h1,h2,h3,h4 {margin: 10px 0px;}";
      style += "</style>";
      return style;
    },
    getBasicInfo() {
      const store = this.currentStore;
      let info = "";
      info += "<div class='flex-center'>";
      info += "<img class='logo' src='/logo_print.svg' >";
      info += "<div>";
      info +=
        "<h4 class='text-center' style='margin-bottom: 0 !important;'>BỮA ĂN SẠCH</h4>";
      info +=
        "<div class='text-center' style='margin-bottom: 5px'><em>buaansach.com.vn</em></div>";
      info += "</div>";
      info += "</div>";

      info +=
        "<div class='pl-2'><b>Mã cửa hàng: </b>" + store.storeCode + "</div>";
      info +=
        "<div class='pl-2'><b>Địa chỉ: </b>" + store.storeAddress + "</div>";
      info +=
        "<div class='pl-2'><b>Điện thoại: </b>" +
        store.storeOwnerPhone +
        "</div>";
      info += "<h4 class='text-center'>HÓA ĐƠN BÁN HÀNG</h4>";
      return info;
    },
    getBillMeta(order) {
      let meta = "<table>";
      meta += "<tr><td>Mã đơn: " + order.orderCode + "</td></tr>";
      meta += "<tr><td>Ngày bán: " + this.getDate() + "</td></tr>";
      switch (order.seat.areaType) {
        case AreaType.value.IN_STORE:
          meta +=
            "<tr><td>Vị trí: " +
            order.seat.seatName +
            " - " +
            order.seat.areaName +
            "</td></tr>";
          break;
        case AreaType.value.TAKE_AWAY:
          meta += "<tr><td>Hình thức: Mang về</td></tr>";
          break;
        case AreaType.value.ONLINE:
          meta += "<tr><td>Hình thức: Đặt online</td></tr>";
          break;
        default:
          break;
      }
      meta += "</table>";
      return meta;
    },
    getBillProduct(order) {
      const listOrderProduct = order.listOrderProduct;
      let listDistinctProduct = {};

      listOrderProduct.forEach(op => {
        if (listDistinctProduct[op.productGuid]) {
          listDistinctProduct[op.productGuid].orderProductQuantity +=
            op.orderProductQuantity;
        } else {
          listDistinctProduct[op.productGuid] = JSON.parse(JSON.stringify(op));
        }
      });

      let thead = "<thead><tr>";
      thead += "<th>Mặt hàng</th>";
      thead += "<th>Đơn giá</th>";
      thead += "<th>SL</th>";
      thead += "<th class='text-right'>T.Tiền</th>";
      thead += "</tr></thead>";

      let tbody = "<tbody>";
      Object.keys(listDistinctProduct).forEach(key => {
        tbody +=
          "<tr><td colspan='4'>" +
          listDistinctProduct[key].productName +
          "</td></tr>";
        tbody += "<tr>";
        tbody += "<td>" + listDistinctProduct[key].productCode + "</td>";
        tbody +=
          "<td>" +
          this.formatPrice(listDistinctProduct[key].orderProductPrice) +
          "</td>";
        tbody +=
          "<td>" + listDistinctProduct[key].orderProductQuantity + "</td>";
        tbody +=
          "<td class='text-right'>" +
          this.formatPrice(
            this.getOrderProductPrice(listDistinctProduct[key])
          ) +
          "</td>";
        tbody += "</tr>";
      });
      tbody += "</tbody>";

      let tableContent = "<table>";
      tableContent += thead;
      tableContent += tbody;
      tableContent += "</table>";
      return tableContent;
    },
    getBillSummary(order) {
      let tableContent = "<table>";
      tableContent +=
        "<tr><th>TỔNG TIỀN</th><td class='text-right'>" +
        this.formatPrice(order.orderTotalAmount) +
        "</td></tr>";
      if (order.orderDiscountType === DiscountType.value.PERCENT) {
        tableContent +=
          "<tr><th>GIẢM GIÁ</th><td class='text-right'>" +
          order.orderDiscount +
          "% (" +
          this.formatPrice(this.getOrderDiscount(order)) +
          ")</td></tr>";
      } else {
        tableContent +=
          "<tr><th>GIẢM GIÁ</th><td class='text-right'>" +
          this.formatPrice(this.getOrderDiscount(order)) +
          "</td></tr>";
      }
      tableContent +=
        "<tr><th>DÙNG ĐIỂM</th><td class='text-right'>" +
        order.orderPointValue +
        "</td></tr>";
      tableContent += "</table>";
      tableContent += "<table>";
      tableContent +=
        "<tr><th>THANH TOÁN</th><td class='text-right'><b>" +
        this.formatPrice(this.getOrderPayAmount(order)) +
        "</b></td></tr>";
      tableContent += "</table>";
      return tableContent;
    },
    getTotalBillSummary() {
      let tableContent = "<table>";
      tableContent +=
        "<tr><th>TỔNG THANH TOÁN</th><td class='text-right'><b>" +
        this.formatPrice(this.getListOrderPayAmount(this.listOrder)) +
        "</b></td></tr>";
      tableContent +=
        "<tr><th>TIỀN KHÁCH ĐƯA</th><td class='text-right'>" +
        this.formatPrice(this.customerPay) +
        "</td></tr>";
      tableContent +=
        "<tr><th>TIỀN TRẢ LẠI</th><td class='text-right'>" +
        this.formatPrice(
          this.customerPay - this.getListOrderPayAmount(this.listOrder)
        ) +
        "</td></tr>";
      tableContent += "</table>";
      return tableContent;
    },
    getBillHead() {
      let head = "<head>";
      head += "<meta charset='UTF-8'>";
      head += "<title>HOA_DON</title>";
      head += this.getStyle();
      head += "</head>";
      return head;
    },
    getBillBody() {
      let body = "<body>";
      body += this.getBasicInfo();
      body += "<div class='double-divider'></div>";
      this.listOrder.forEach(order => {
        body += this.getBillMeta(order);
        body += "<div class='divider'></div>";
        body += this.getBillProduct(order);
        body += "<div class='divider'></div>";
        body += this.getBillSummary(order);
        body += "<div class='double-divider'></div>";
      });
      body += this.getTotalBillSummary();
      body += "<div class='divider'></div>";
      body +=
        "<h4 class='text-center'>" +
        "<span>QUÁN ĐANG CHẠY THỬ,</span>" +
        "<br>" +
        "<span>RẤT MONG QUÝ KHÁCH</span>" +
        "<br>" +
        "<span>THÔNG CẢM VÀ GÓP Ý</span>" +
        "</h4>";
      body += "</body>";
      return body;
    },
    getHtmlContent() {
      let htmlContent = "<html lang='en'>";
      htmlContent += this.getBillHead();
      htmlContent += this.getBillBody();
      htmlContent += "</html>";
      return htmlContent;
    },
    printBill(data, callback) {
      this.listOrder = data.listOrder;
      this.customerPay = data.customerPay;
      let html = this.getHtmlContent();
      let billGroupFrame = document.getElementById("bill_group_frame");
      let doc = billGroupFrame.contentWindow.document;
      billGroupFrame.onload = null;
      billGroupFrame.onload = onLoad;

      function onLoad() {
        document.getElementById("bill_group_frame").contentWindow.print();
        if (callback) callback();
      }

      doc.open();
      doc.write(html);
      doc.close();
    }
  }
};
</script>

<style scoped></style>
