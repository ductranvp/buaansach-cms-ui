<template>
  <div style="width: 0; height: 0; visibility: hidden">
    <iframe id="bill_frame" width="0" height="0" frameborder="0">

    </iframe>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "Bill",
    computed: {
      ...mapState({
        currentStore: state => state.posMachine.currentStore,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        orderDiscount: state => state.posMachine.orderDiscount,
        totalCharge: state => {
          return state.posMachine.savedOrderProduct
            .filter(item => item.orderProductStatus.indexOf("CANCELLED") === -1)
            .map(item => item.orderProductPrice * item.orderProductQuantity)
            .reduce((prev, curr) => prev + curr, 0);
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
        style += ".divider {border-top: 1px dashed black}";
        style += "table {font-size: 8pt;width: 100%;}";
        style += "th {text-align: left;}";
        style += "h1,h2,h3,h4 {margin: 10px 0px;}";
        style += "</style>";
        return style;
      },
      getBasicInfo() {
        const store = this.currentStore;
        let info = "";
        info += "<h4 class='text-center' style='margin-bottom: 0px !important;'>BỮA ĂN SẠCH</h4>";
        info += "<div class='text-center' style='margin-bottom: 5px'><em>buaansach.com.vn</em></div>";
        info += "<div><b>Cửa hàng: </b>" + store.storeName + "</div>";
        info += "<div><b>Địa chỉ: </b>" + store.storeAddress + "</div>";
        info += "<div><b>Điện thoại: </b>" + store.storeOwnerPhone + "</div>";
        info += "<h4 class='text-center'>HÓA ĐƠN BÁN HÀNG</h4>";
        return info;
      },
      getDate() {
        // const date = new Date();
        // return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        return this.$moment().format("DD/MM/YYYY HH:mm");
      },
      getBillMeta() {
        const order = this.currentOrder;
        const date = new Date();
        let meta = "<table>";
        meta += "<tr><td>Mã đơn: " + order.orderCode + "</td></tr>";
        meta += "<tr><td>Ngày bán: " + this.getDate() + "</td></tr>";
        meta += "</table>";
        return meta;
      },
      getBillProduct() {
        const orderProduct = this.savedOrderProduct.filter(od => !od.orderProductStatus.includes('CANCELLED'));
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
          tbody += "<td class='text-right'>" + this.formatPrice(distinctProduct[key].orderProductPrice * distinctProduct[key].orderProductQuantity) + "</td>";
          tbody += "</tr>";
        });
        tbody += "</tbody>";

        let tableContent = "<table>";
        tableContent += thead;
        tableContent += tbody;
        tableContent += "</table>";
        return tableContent;
      },
      getBillSummary(customerCharge) {
        const payAmount = this.totalCharge - this.orderDiscount;
        let tableContent = "<table>";
        tableContent += "<tr><th>TỔNG TIỀN</th><td class='text-right'>" + this.formatPrice(this.totalCharge) + "</td></tr>";
        tableContent += "<tr><th>GIẢM GIÁ</th><td class='text-right'>" + this.formatPrice(this.orderDiscount) + "</td></tr>";
        tableContent += "</table>";
        tableContent += "<div class='divider'></div>";
        tableContent += "<table>";
        tableContent += "<tr><th>THANH TOÁN</th><td class='text-right'>" + this.formatPrice(payAmount) + "</td></tr>";
        tableContent += "<tr><th>TIỀN KHÁCH ĐƯA</th><td class='text-right'>" + this.formatPrice(customerCharge) + "</td></tr>";
        tableContent += "<tr><th>TIỀN TRẢ LẠI</th><td class='text-right'>" + this.formatPrice(customerCharge - payAmount) + "</td></tr>";
        tableContent += "<tr><td colspan='2'><div class='text-center'>(Giá đã bao gồm thuế GTGT)</div></td></tr>";
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
      getBillBody(customerCharge) {
        let body = "<body onload='window.print()'>";
        body += this.getBasicInfo();
        body += this.getBillMeta();
        body += "<div class='divider'></div>";
        body += this.getBillProduct();
        body += "<div class='divider'></div>";
        body += this.getBillSummary(customerCharge);
        body += "<div class='divider'></div>";
        body += "<h4 class='text-center' style='padding-bottom:8px'>CẢM ƠN QUÝ KHÁCH!</h4>";
        body += "</body>";
        return body;
      },
      getHtmlContent(customerCharge) {
        let htmlContent = "<html lang='en'>";
        htmlContent += this.getBillHead();
        htmlContent += this.getBillBody(customerCharge);
        htmlContent += "</html>";
        return htmlContent;
      },
      printBill(customerCharge) {
        let html = this.getHtmlContent(customerCharge);
        let doc = document.getElementById('bill_frame').contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
      },
    }
  };
</script>

<style scoped>

</style>
