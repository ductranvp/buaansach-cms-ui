<template>
  <div style="width: 0; height: 0; visibility: hidden">
    <iframe id="check_printer_frame" width="0" height="0" frameborder="0">
    </iframe>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "CheckPrinter",
    computed: {
      ...mapState({
        currentStore: state => state.posMachine.currentStore,
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    methods: {
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
        style += "table {font-size: 8pt;width: 100%;}";
        style += "th {text-align: left;}";
        style += "h1,h2,h3,h4 {margin: 10px 0px;}";
        style += "</style>";
        return style;
      },
      getDate() {
        return this.$moment().format("DD/MM/YYYY HH:mm");
      },
      getBillMeta() {
        let meta = "<table>";
        meta += "<tr><td>Mã đơn: 123456789</td></tr>";
        meta += "<tr><td>Ngày bán: " + this.getDate() + "</td></tr>";
        meta += "</table>";
        return meta;
      },
      getHead() {
        let head = "<head>";
        head += "<meta charset='UTF-8'>";
        head += "<title>IN_THU_HOA_DON</title>";
        head += this.getStyle();
        head += "</head>";
        return head;
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
      getBillProduct() {
        let thead = "<thead><tr>";
        thead += "<th>Mặt hàng</th>";
        thead += "<th>Đơn giá</th>";
        thead += "<th>SL</th>";
        thead += "<th class='text-right'>T.Tiền</th>";
        thead += "</tr></thead>";

        let tbody = "<tbody>";
        tbody += "</tbody>";

        let tableContent = "<table>";
        tableContent += thead;
        tableContent += tbody;
        tableContent += "</table>";
        return tableContent;
      },
      getBody() {
        let body = "<body>";
        body += this.getBasicInfo();
        body += "<div class='divider'></div>";
        body += this.getBillProduct();
        body += "<div style='height: 10px'></div>";
        body += "<div>Kết nối máy in</div>";
        body += "<div>Thành công!</div>";
        body += "<div style='height: 10px'></div>";
        body += "<div class='divider'></div>";
        body += "</body>";
        return body;
      },
      getHtmlContent() {
        let htmlContent = "<html lang='en'>";
        htmlContent += this.getHead();
        htmlContent += this.getBody();
        htmlContent += "</html>";
        return htmlContent;
      },
      printTest() {
        let html = this.getHtmlContent();
        let billFrame = document.getElementById('check_printer_frame');
        let doc = billFrame.contentWindow.document;
        billFrame.onload = null;
        billFrame.onload = onLoad;

        function onLoad() {
          document.getElementById("check_printer_frame").contentWindow.print();
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
