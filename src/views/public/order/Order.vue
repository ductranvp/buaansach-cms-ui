<template>
  <div>
    <p>{{seat.seatName}}</p>
  </div>
</template>

<script>

  import GuestOrderService from "@/service/guest/guest.order.service";
  import AuthUtils from "@/utils/auth.util";
  import * as SockJS from "sockjs-client";
  import * as Stomp from "webstomp-client";
  import GuestProductService from "@/service/guest/guest.product.service";

  export default {
    name: "Order",
    data() {
      return {
        seat: {},
        products: [],
        stompClient: null
      };
    },
    created() {
      this.getSeat();
      this.getProduct();
    },
    mounted() {
      this.connectSocket();
      const vm = this;
      setTimeout(function () {
        vm.sendActivity();
      }, 2000);
    },
    methods: {
      connectSocket() {
        this.$nextTick(function () {
          let url =
            "http://192.168.2.2/websocket" +
            "?access_token=" +
            AuthUtils.getToken();
          let guestUrl =
            "http://192.168.2.2/guest/websocket";
          const vm = this;
          let socket = new SockJS(guestUrl);
          vm.stompClient = Stomp.over(socket);
          vm.stompClient.connect(
            {},
            function () {
              vm.stompClient.subscribe("/topic/pos/" + vm.seat.storeGuid, function (data) {
                console.log(data);
              });
            },
            function (error) {
              console.log(error);
            }
          );
        });
      },
      sendActivity() {
        if (this.stompClient !== null && this.stompClient.connected) {
          const url = '/app/make-order/' + this.seat.storeGuid + "/" + this.seat.seatGuid;
          console.log(url);
          this.stompClient.send(url, // destination
            "test", // body
            {} // header
          );
        }
      },
      async getProduct() {
        const {data} = await GuestProductService.getProduct();
        this.products = data;
      },
      async getSeat() {
        const {data} = await GuestOrderService.getSeat(this.$route.params.seatGuid);
        this.seat = data;
      }
    }
  };
</script>

<style scoped></style>
