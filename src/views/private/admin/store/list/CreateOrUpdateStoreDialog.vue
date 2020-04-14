<template>
  <el-dialog
    :title="dialogTitle"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form :model="form" ref="storeForm" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeCode">
            <input-label :label="$t('private.adminStoreListPage.store.storeCode')" required/>
            <el-input
              ref="storeCode"
              v-model="form.storeCode"
              maxlength="20"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="storeName">
            <input-label :label="$t('private.adminStoreListPage.store.storeName')" required/>
            <el-input
              v-model="form.storeName"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="storeAddress">
        <input-label :label="$t('private.adminStoreListPage.store.storeAddress')" required/>
        <el-input
          v-model="form.storeAddress"
          maxlength="255"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeOwnerName">
            <input-label :label="$t('private.adminStoreListPage.store.storeOwnerName')" required/>
            <el-input
              v-model="form.storeOwnerName"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="storeOwnerPhone">
            <input-label :label="$t('private.adminStoreListPage.store.storeOwnerPhone')" required/>
            <el-input
              v-model="form.storeOwnerPhone"
              maxlength="50"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeOwnerEmail">
            <input-label :label="$t('private.adminStoreListPage.store.storeOwnerEmail')" optional/>
            <el-input
              v-model="form.storeOwnerEmail"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="storeTaxCode">
            <input-label :label="$t('private.adminStoreListPage.store.storeTaxCode')" optional/>
            <el-input
              v-model="form.storeTaxCode"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeOpenHour">
            <input-label :label="$t('private.adminStoreListPage.store.storeOpenHour')" optional/>
            <el-time-select
              class="full-width"
              v-model="form.storeOpenHour"
              :picker-options="timePickerOption">
            </el-time-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="storeCloseHour">
            <input-label :label="$t('private.adminStoreListPage.store.storeCloseHour')" optional/>
            <el-time-select
              class="full-width"
              :disabled="!form.storeOpenHour"
              v-model="form.storeCloseHour"
              :picker-options="{...timePickerOption, minTime: form.storeOpenHour}">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="storeStatus">
        <el-col :span="11">
          <input-label :label="$t('private.adminStoreListPage.store.storeStatus')" required/>
          <el-select class="full-width" v-model="form.storeStatus">
            <el-option
              v-for="item in storeStatus"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>


      <el-form-item>
        <input-label :label="$t('private.adminStoreListPage.store.storeImageUrl')" optional/>
        <single-image-uploader
          ref="singleImageUploader"
          @imageCleared="onImageCleared"
          :image-url-prop.sync="form.storeImageUrl"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixinData from "@/views/private/admin/store/list/create-or-update-dialog.data";
  import mixinMethod from "@/views/private/admin/store/list/create-or-update-dialog.method";

  export default {
    name: "CreateOrUpdateStoreDialog",
    mixins: [mixinData, mixinMethod],
  };
</script>

<style scoped>

</style>
