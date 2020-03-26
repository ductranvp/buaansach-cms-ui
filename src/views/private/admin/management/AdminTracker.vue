<template>
  <p>AdminTracker</p>
</template>

<script>
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import AuthUtils from "@/utils/auth.util";
export default {
  name: "AdminTracker",
  mounted() {
    this.$nextTick(function() {
      let url =
        "http://192.168.2.4:8080/websocket" +
        "?access_token=" +
        AuthUtils.getToken();
      let socket = new SockJS(url);
      let stompClient = Stomp.over(socket);
      stompClient.connect(
        {},
        function() {
          stompClient.subscribe("/info/notification", function() {
            setTimeout(function() {
              console.log("received");
            }, 200);
          });
        },
        function(error) {
          console.log(error);
        }
      );
    });
  }
};
</script>

<style scoped></style>
