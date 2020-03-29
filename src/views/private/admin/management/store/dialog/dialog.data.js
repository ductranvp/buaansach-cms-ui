const mixinData = {
  data() {
    return {
      dialogTitle: this.$t("common.entity.dialog.title", {
        entityName: this.$t("private.adminStorePage.entityName")
      }),
      dialogFormVisible: false,
      isSaving: false,
      storeEntity: {
        id: null,
        code: null,
        name: null,
        address: null,
        imageUrl: null,
        status: "ACTIVATED",
        ownerName: null,
        ownerPhone: null,
        ownerEmail: null,
        taxCode: null,
        updateReason: null,
        numberOfFloors: 0,
        numberOfSeats: 0,
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
        code: [
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
        name: [
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
        address: [
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
        ownerName: [
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
        ownerPhone: [
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
        ownerEmail: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
            trigger: "blur"
          }
        ],
        taxCode: [
          {
            max: 100,
            message: this.$t("common.entity.validation.maxlength", {
              max: 100
            }),
            trigger: "blur"
          }
        ],
        updateReason: [
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
