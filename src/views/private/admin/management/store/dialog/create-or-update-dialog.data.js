const mixinData = {
  data() {
    return {
      dialogTitle: this.$t("common.entity.dialog.title", {
        entityName: this.$t("private.adminStorePage.entityName")
      }),
      dialogFormVisible: false,
      isSaving: false,
      previousUpdateReason: null,
      storeEntity: {
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
        lastUpdateReason: null,
        storeOwnerLogin: null,
        createdDate: null,
        createdBy: null,
        lastModifiedDate: null,
        lastModifiedBy: null
      },
      storeStatus: [
        {
          label: "private.adminStorePage.storeStatus.activated",
          value: "ACTIVATED"
        },
        { label: "private.adminStorePage.storeStatus.paused", value: "PAUSED" },
        {
          label: "private.adminStorePage.storeStatus.deactivated",
          value: "DEACTIVATED"
        }
      ],
      storeEntityRules: {
        storeCode: [
          {
            required: true,
            message: this.$t("common.entity.validation.required"),
            trigger: "blur"
          },
          {
            max: 20,
            message: this.$t("common.entity.validation.maxlength", { max: 20 }),
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
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
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
            message: this.$t("common.entity.validation.maxlength", {
              max: 255
            }),
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
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
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
            message: this.$t("common.entity.validation.maxlength", { max: 50 }),
            trigger: "blur"
          }
        ],
        storeOwnerEmail: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
            trigger: "blur"
          }
        ],
        storeTaxCode: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
            trigger: "blur"
          }
        ],
        lastUpdateReason: [
          {
            max: 500,
            message: this.$t("common.entity.validation.maxlength", {
              max: 500
            }),
            trigger: "blur"
          }
        ]
      }
    };
  }
};

export default mixinData;
