const mixinData = {
  data() {
    return {
      dialogFormVisible: false,
      isEdit: false,
      isLoading: false,
      timePickerOption: {
        start: '07:00',
        step: '00:30',
        end: '22:00'
      },
      form: {
        guid: null,
        storeCode: null,
        storeName: null,
        storeAddress: null,
        storeImageUrl: null,
        storeStatus: "ACTIVATED",
        storeOwnerName: null,
        storeOwnerPhone: null,
        storeOwnerEmail: null,
        storeTaxCode: null,
        storeOpenHour: null,
        storeCloseHour: null,
      },
      formRules: {
        storeCode: [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 16, message: this.$t("common.entity.validation.maxlength", {max: 16}), trigger: "blur"}
        ],
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
          label: "private.adminStoreManagementPage.storeStatus.activated",
          value: "ACTIVATED"
        },
        {
          label: "private.adminStoreManagementPage.storeStatus.paused",
          value: "PAUSED"
        },
        {
          label: "private.adminStoreManagementPage.storeStatus.deactivated",
          value: "DEACTIVATED"
        }
      ]
    };
  }
};

export default mixinData;
