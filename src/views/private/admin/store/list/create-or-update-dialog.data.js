const mixinData = {
  data() {
    return {
      dialogTitle: "Tạo hoặc cập nhật cửa hàng",
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
        createdDate: null,
        createdBy: null,
        lastModifiedDate: null,
        lastModifiedBy: null
      },
      formRules: {
        storeCode: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 20,
            message: this.$t("common.entity.validation.maxlength", {max: 20}),
            trigger: "blur"
          }
        ],
        storeName: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {max: 100}),
            trigger: "blur"
          }
        ],
        storeAddress: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 255,
            message: this.$t("common.entity.validation.maxlength", {max: 255}),
            trigger: "blur"
          }
        ],
        storeOwnerName: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {max: 100}),
            trigger: "blur"
          }
        ],
        storeOwnerPhone: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 50,
            message: this.$t("common.entity.validation.maxlength", {max: 50}),
            trigger: "blur"
          }
        ],
        storeOwnerEmail: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {max: 100}),
            trigger: "blur"
          }
        ],
        storeTaxCode: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {max: 100}),
            trigger: "blur"
          }
        ],
        storeStatus: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
        ]
      },
      storeStatus: [
        {
          label: "private.adminStoreListPage.storeStatus.activated",
          value: "ACTIVATED"
        },
        {
          label: "private.adminStoreListPage.storeStatus.paused",
          value: "PAUSED"
        },
        {
          label: "private.adminStoreListPage.storeStatus.deactivated",
          value: "DEACTIVATED"
        }
      ]
    };
  }
};

export default mixinData;
