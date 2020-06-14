const mixinData = {
  data() {
    return {
      dialogFormVisible: false,
      isEdit: false,
      isLoading: false,
      form: {
        guid: null,
        storeCode: null,
        storeName: null,
        storeAddress: null,
        storeImageUrl: null,
        storeStatus: "OPENING",
        storeOwnerName: null,
        storeOwnerPhone: null,
        storeOwnerEmail: null,
        storeTaxCode: null,
        storeBusinessHours: null,
        storeActivated: true,
      },
      formRules: {
        storeName: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
        ],
        storeAddress: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 255, message: this.$t("common.entity.validation.maxlength", {max: 255}), trigger: "blur"}
        ],
        storeOwnerName: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
        ],
        storeOwnerPhone: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
        ],
        storeOwnerEmail: [
          {type: 'email', message: this.$t("common.entity.validation.email"), trigger: "blur"},
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
        ],
        storeTaxCode: [
          {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
        ],
        storeStatus: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
        ]
      },
      storeStatus: [
        {
          label: "private.adminStoreManagementPage.storeStatus.opening",
          value: "OPENING"
        },
        {
          label: "private.adminStoreManagementPage.storeStatus.closed",
          value: "CLOSED"
        },
      ]
    };
  }
};

export default mixinData;
