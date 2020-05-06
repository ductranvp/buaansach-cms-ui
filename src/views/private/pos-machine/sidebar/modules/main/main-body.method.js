import MessageUtils from "@/utils/message.util";

const mixinMethod = {
    methods: {
        createOrder() {
          const vm = this;
            this.$refs.createOrderForm.validate(async valid => {
                if (valid) {
                  vm.isLoading = true;
                  await this.$store.dispatch("posMachine/createOrder", this.form);
                  vm.isLoading = false;
                }
            });
        },
        serveOrderProduct(product) {
            const vm = this;
            if (vm.$route.params.storeGuid)
                vm.$store.dispatch("posMachine/serveOrderProduct",
                    {orderProduct: product, storeGuid: vm.$route.params.storeGuid});
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
            console.log(this.orderProductQuantity);
            this.$store.dispatch("posMachine/updateOrderProductQuantity", {
                orderProduct: item,
                quantity: this.orderProductQuantity,
            });
            this.$set(item, 'popoverVisible', false);
        }
    }
};

export default mixinMethod;
