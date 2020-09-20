<template>
  <div style="width: 0; height: 0; visibility: hidden">
    <iframe id="bill_frame" width="0" height="0" frameborder="0">
    </iframe>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import PriceUtils from "@/utils/price.util";
  import AreaType from "@/enum/AreaType";
  import OrderProductStatus from "@/enum/OrderProductStatus";

  export default {
    name: "Bill",
    computed: {
      ...mapState({
        currentStore: state => state.posMachine.currentStore,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        orderTotalAmount: state => state.posMachine.currentOrder.orderTotalAmount,
        discountAmount: state => {
          const {orderTotalAmount, orderDiscount, orderDiscountType} = state.posMachine.currentOrder;
          return PriceUtils.getDiscountAmount(orderTotalAmount, orderDiscount, orderDiscountType);
        },
        payAmount: state => {
          const {orderTotalAmount, orderDiscount, orderDiscountType} = state.posMachine.currentOrder;
          return PriceUtils.getPayAmount(orderTotalAmount, orderDiscount, orderDiscountType);
        },
      })
    },
    methods: {
      formatPrice(value, unit) {
        if (unit) unit = " " + unit;
        else unit = "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
      },
      getStyle() {
        let style = "<style>";
        style += "html,body {margin: 0;padding: 0;width: 168px;height: auto;font-size: 8pt;font-family: Arial, Helvetica, sans-serif;}";
        style += ".text-center {text-align: center;}";
        style += ".text-left {text-align: center;}";
        style += ".text-right {text-align: right;}";
        style += ".pl-2 {padding-left: 2px;}";
        style += ".logo {width: 42px; height: 34px; padding-right: 5px}";
        style += ".flex-center {display:flex; flex-direction: row; align-items: center; justify-content: center}";
        style += ".divider {border-top: 1px dashed black}";
        style += '.double-divider {border-top: 2px solid black}';
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
        info += "<h4 class='text-center' style='margin-bottom: 0 !important;'>BỮA ĂN SẠCH</h4>";
        info += "<div class='text-center' style='margin-bottom: 5px'><em>buaansach.com.vn</em></div>";
        info += "</div>";
        info += "</div>";

        info += "<div class='pl-2'><b>Mã cửa hàng: </b>" + store.storeCode + "</div>";
        info += "<div class='pl-2'><b>Địa chỉ: </b>" + store.storeAddress + "</div>";
        info += "<div class='pl-2'><b>Điện thoại: </b>" + store.storeOwnerPhone + "</div>";
        info += "<h4 class='text-center'>HÓA ĐƠN BÁN HÀNG</h4>";
        return info;
      },
      getDate() {
        return this.$moment().format("DD/MM/YYYY HH:mm");
      },
      getOrderProductPrice(orderProduct) {
        const {orderProductPrice, orderProductDiscount, orderProductDiscountType} = orderProduct;
        return PriceUtils.getProductPrice(orderProductPrice, orderProductDiscount, orderProductDiscountType);
      },
      getBillMeta() {
        let meta = "<table>";
        meta += "<tr><td>Mã đơn: " + this.currentOrder.orderCode + "</td></tr>";
        meta += "<tr><td>Ngày bán: " + this.getDate() + "</td></tr>";
        switch (this.selectedSeat.areaType) {
          case AreaType.value.IN_STORE:
            meta += "<tr><td>Vị trí: " + this.selectedSeat.seatName + " - " + this.selectedSeat.areaName + "</td></tr>";
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
      getBillProduct() {
        const orderProduct = this.savedOrderProduct.filter(od => od.orderProductStatus === OrderProductStatus.value.SERVED);
        let distinctProduct = {};

        orderProduct.forEach((op) => {
          if (distinctProduct[op.productGuid]) {
            distinctProduct[op.productGuid].orderProductQuantity += op.orderProductQuantity;
          } else {
            distinctProduct[op.productGuid] = JSON.parse(JSON.stringify(op));
          }
        });

        let thead = "<thead><tr>";
        thead += "<th>Mặt hàng</th>";
        thead += "<th>Đơn giá</th>";
        thead += "<th>SL</th>";
        thead += "<th class='text-right'>T.Tiền</th>";
        thead += "</tr></thead>";

        let tbody = "<tbody>";
        Object.keys(distinctProduct).forEach(key => {
          tbody += "<tr><td colspan='4'>" + distinctProduct[key].productName + "</td></tr>";
          tbody += "<tr>";
          tbody += "<td>" + distinctProduct[key].productCode + "</td>";
          tbody += "<td>" + this.formatPrice(distinctProduct[key].orderProductPrice) + "</td>";
          tbody += "<td>" + distinctProduct[key].orderProductQuantity + "</td>";
          tbody += "<td class='text-right'>" + this.formatPrice(this.getOrderProductPrice(distinctProduct[key])) + "</td>";
          tbody += "</tr>";
        });
        tbody += "</tbody>";

        let tableContent = "<table>";
        tableContent += thead;
        tableContent += tbody;
        tableContent += "</table>";
        return tableContent;
      },
      getBillSummary(customerPay) {
        let tableContent = "<table>";
        tableContent += "<tr><th>TỔNG TIỀN</th><td class='text-right'>" + this.formatPrice(this.orderTotalAmount) + "</td></tr>";
        tableContent += "<tr><th>GIẢM GIÁ</th><td class='text-right'>" + this.formatPrice(this.discountAmount) + "</td></tr>";
        tableContent += "</table>";
        tableContent += "<div class='divider'></div>";
        tableContent += "<table>";
        tableContent += "<tr><th>THANH TOÁN</th><td class='text-right'><b>" + this.formatPrice(this.payAmount) + "</b></td></tr>";
        tableContent += "<tr><th>TIỀN KHÁCH ĐƯA</th><td class='text-right'>" + this.formatPrice(customerPay) + "</td></tr>";
        tableContent += "<tr><th>TIỀN TRẢ LẠI</th><td class='text-right'>" + this.formatPrice(customerPay - this.payAmount) + "</td></tr>";
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
      getBillBody(customerPay) {
        let body = "<body>";
        body += this.getBasicInfo();
        body += this.getBillMeta();
        body += "<div class='divider'></div>";
        body += this.getBillProduct();
        body += "<div class='divider'></div>";
        body += this.getBillSummary(customerPay);
        body += "<div class='divider'></div>";
        body += "<h4 class='text-center'>CẢM ƠN QUÝ KHÁCH!</h4>";
        body += "</body>";
        return body;
      },
      getHtmlContent(customerPay) {
        let htmlContent = "<html lang='en'>";
        htmlContent += this.getBillHead();
        htmlContent += this.getBillBody(customerPay);
        htmlContent += "</html>";
        return htmlContent;
      },
      printBill(customerPay, callback) {
        let html = this.getHtmlContent(customerPay);
        let billFrame = document.getElementById('bill_frame');
        let doc = billFrame.contentWindow.document;
        billFrame.onload = null;
        billFrame.onload = onLoad;

        function onLoad() {
          document.getElementById("bill_frame").contentWindow.print();
          if (callback) callback();
        }

        doc.open();
        doc.write(html);
        doc.close();
      },
    }
  };
</script>

<style scoped>

</style>
