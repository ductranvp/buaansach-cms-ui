<template>
  <div id="bill">

  </div>
</template>

<script>
  export default {
    name: "Bill",
    methods: {
      printBill() {
        let html = "<!DOCTYPE html>\n" +
          "<html lang=\"en\">\n" +
          "<head>\n" +
          "  <meta charset=\"UTF-8\">\n" +
          "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
          "  <title>HOADON</title>\n" +
          "  <style>\n" +
          "    html,\n" +
          "    body {\n" +
          "      margin: 0;\n" +
          "      padding: 0;\n" +
          "      width: 168px;\n" +
          "      height: auto;\n" +
          "    }\n" +
          "\n" +
          "    #print {\n" +
          "      font-size: 9pt;\n" +
          "    }\n" +
          "\n" +
          "    .text-center {\n" +
          "      text-align: center;\n" +
          "    }\n" +
          "\n" +
          "    .divider {\n" +
          "      border-top: 1px dashed black\n" +
          "    }\n" +
          "\n" +
          "    table {\n" +
          "      width: 100%;\n" +
          "    }\n" +
          "\n" +
          "    th {\n" +
          "      text-align: left;\n" +
          "    }\n" +
          "\n" +
          "    .text-left {\n" +
          "      text-align: center;\n" +
          "    }\n" +
          "\n" +
          "    .text-right {\n" +
          "      text-align: right;\n" +
          "    }\n" +
          "\n" +
          "    h4 {\n" +
          "      margin: 10px 0px;\n" +
          "    }\n" +
          "  </style>\n" +
          "</head>\n" +
          "\n" +
          "<body>\n" +
          "<div id=\"print\">\n" +
          "  <div><b>BAS001 - Bữa Ăn Sạch</b></div>\n" +
          "  <div>ĐC: Số 6 ngõ 46 Vĩnh Phúc, Ba Đình, Hà Nội</div>\n" +
          "  <div>Điện thoại: 0966601617</div>\n" +
          "  <div>Website: buaansach.com.vn</div>\n" +
          "  <div>\n" +
          "    <h4 class=\"text-center\">HÓA ĐƠN BÁN HÀNG</h4>\n" +
          "  </div>\n" +
          "  <table>\n" +
          "    <tr>\n" +
          "      <td>Mã đơn: 1588585480432</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td>Ngày bán: 04/05/2020 10:25</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td>Nhân viên: NV0001</td>\n" +
          "    </tr>\n" +
          "  </table>\n" +
          "  <div class=\"divider\"></div>\n" +
          "  <table>\n" +
          "    <tr>\n" +
          "      <td>Khách hàng: A Minh</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td>SĐT: 0961351960</td>\n" +
          "    </tr>\n" +
          "  </table>\n" +
          "  <div class=\"divider\"></div>\n" +
          "  <table>\n" +
          "    <thead>\n" +
          "    <tr>\n" +
          "      <th>Mặt hàng</th>\n" +
          "      <th>Đơn giá</th>\n" +
          "      <th>SL</th>\n" +
          "      <th class=\"text-right\">T.Tiền</th>\n" +
          "    </tr>\n" +
          "    </thead>\n" +
          "    <tbody>\n" +
          "    <tr>\n" +
          "      <td colspan=\"4\">\n" +
          "        <span>Bún Chả</span>\n" +
          "      </td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td>SP0001</td>\n" +
          "      <td>30,000</td>\n" +
          "      <td>2</td>\n" +
          "      <td class=\"text-right\">60,000</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td colspan=\"4\">\n" +
          "        <span>Nem nướng Nha Trang</span>\n" +
          "      </td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <td>SP0003</td>\n" +
          "      <td>30,000</td>\n" +
          "      <td>5</td>\n" +
          "      <td class=\"text-right\">150,000</td>\n" +
          "    </tr>\n" +
          "    </tbody>\n" +
          "  </table>\n" +
          "  <div class=\"divider\"></div>\n" +
          "  <table>\n" +
          "    <tr>\n" +
          "      <th>TỔNG TIỀN</th>\n" +
          "      <td class=\"text-right\">210,000</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <th>GIẢM GIÁ</th>\n" +
          "      <td class=\"text-right\">10,000</td>\n" +
          "    </tr>\n" +
          "  </table>\n" +
          "  <div class=\"divider\"></div>\n" +
          "  <table>\n" +
          "    <tr>\n" +
          "      <th>THANH TOÁN</th>\n" +
          "      <td class=\"text-right\">200,000</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <th>TIỀN KHÁCH TRẢ</th>\n" +
          "      <td class=\"text-right\">500,000</td>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <th>TIỀN TRẢ LẠI</th>\n" +
          "      <td class=\"text-right\">300,000</td>\n" +
          "    </tr>\n" +
          "  </table>\n" +
          "  <div class=\"text-center\">\n" +
          "    <span>(Giá đã bao gồm thuế GTGT)</span>\n" +
          "  </div>\n" +
          "  <div class=\"divider\"></div>\n" +
          "  <h4 class=\"text-center\">CẢM ƠN QUÝ KHÁCH!</h4>\n" +
          "</div>\n" +
          "</body>\n" +
          "</html>";
      }
    }
  };
</script>

<style scoped>

</style>
