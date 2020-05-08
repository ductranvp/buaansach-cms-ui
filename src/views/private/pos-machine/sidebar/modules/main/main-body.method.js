import MessageUtils from "@/utils/message.util";
import NotificationUtils from "@/utils/notification.util";

const mixinMethod = {
  methods: {
    createOrder() {
      const vm = this;
      this.$refs.createOrderForm.validate(async valid => {
        if (valid) {
          vm.isLoading = true;
          try {
            await this.$store.dispatch("posMachine/createOrder", this.form.customerPhone);
            NotificationUtils.success("Tạo đơn thành công");
          } catch (error) {
            NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
          }
          vm.isLoading = false;
        }
      });
    },
    async serveOrderProduct(product) {
      const vm = this;
      if (vm.$route.params.storeGuid) {
        try {
          await vm.$store.dispatch("posMachine/serveOrderProduct",
            {orderProduct: product, storeGuid: vm.$route.params.storeGuid});
          NotificationUtils.success("Cập nhật thành công", 1000);
          this.checkOrderProductStatus();
        } catch (error) {
          NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
      }
    },
    checkOrderProductStatus() {
      const temp = this.savedOrderProduct.filter(od => od.orderProductStatus === this.orderProductStatus.CREATED ||
        od.orderProductStatus === this.orderProductStatus.PREPARING);
      if (!temp.length) {
        this.$store.commit("posMachine/CHANGE_SEAT_STATUS", {
          targetSeat: this.selectedSeat,
          seatStatus: this.seatStatus.NON_EMPTY,
          seatServiceStatus: this.seatServiceStatus.FINISHED
        });
      }
    },
    cancelOrderProduct(product) {
      const vm = this;
      this.$prompt("Nhập lí do hủy món (bắt buộc)", "Hủy món", {
        confirmButtonText: 'Hủy món',
        cancelButtonText: 'Đóng',
        inputType: 'textarea'
      }).then(cb => {
        if (cb.value) {
          if (vm.$route.params.storeGuid)
            vm.$store.dispatch("posMachine/cancelOrderProduct",
              {
                orderProduct: product,
                cancelReason: cb.value,
                storeGuid: vm.$route.params.storeGuid
              });
        } else {
          MessageUtils.error("Bạn phải nhập lí do hủy đơn");
        }
      });
    },
    removeUnsavedOrderProduct(product) {
      this.$store.commit("posMachine/REMOVE_UNSAVED_ORDER_PRODUCT", {orderProduct: product});
    },
    onPopoverShow(ref) {
      this.$refs[ref][0].focus();
      this.$refs[ref][0].select();
    },
    setOrderProductQuantity(item) {
      this.orderProductQuantity = item.orderProductQuantity;
    },
    updateOrderProductQuantity(item) {
      this.$store.commit("posMachine/SET_ORDER_PRODUCT_QUANTITY", {
        orderProduct: item,
        quantity: this.orderProductQuantity,
      });
      this.$set(item, 'popoverVisible', false);
    }
  }
};

export default mixinMethod;
