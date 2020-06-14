<template>
  <el-dialog
    title="Tạo hoặc cập nhật cửa hàng"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form :model="form" ref="storeForm" :rules="formRules">
      <el-form-item>
        <el-form-item prop="storeName">
          <input-label :label="$t('private.adminStoreManagementPage.store.storeName')" required/>
          <el-input
            ref="storeName"
            v-model="form.storeName"
            maxlength="100"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form-item>

      <el-form-item prop="storeAddress">
        <input-label :label="$t('private.adminStoreManagementPage.store.storeAddress')" required/>
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
            <input-label :label="$t('private.adminStoreManagementPage.store.storeOwnerName')" required/>
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
            <input-label :label="$t('private.adminStoreManagementPage.store.storeOwnerPhone')" required/>
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
            <input-label :label="$t('private.adminStoreManagementPage.store.storeOwnerEmail')" optional/>
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
            <input-label :label="$t('private.adminStoreManagementPage.store.storeTaxCode')" optional/>
            <el-input
              v-model="form.storeTaxCode"
              maxlength="50"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="storeBusinessHours">
        <input-label :label="$t('private.adminStoreManagementPage.store.storeBusinessHours')" optional/>
        <el-input type="textarea" rows="5" v-model="form.storeBusinessHours" maxlength="255"
                  show-word-limit></el-input>
      </el-form-item>


      <el-form-item prop="storeStatus">
        <el-row type="flex" align="bottom">
          <el-col :span="11">
            <input-label :label="$t('private.adminStoreManagementPage.store.storeStatus')" required/>
            <el-select class="full-width" v-model="form.storeStatus">
              <el-option
                v-for="item in storeStatus"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-checkbox v-model="form.storeActivated">
              <span>{{$t('private.adminStoreManagementPage.store.storeActivated')}}</span>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item>
        <input-label :label="$t('private.adminStoreManagementPage.store.storeImageUrl')" optional/>
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
  import mixinData from "@/views/private/admin/store/management/create-or-update-dialog.data";
  import mixinMethod from "@/views/private/admin/store/management/create-or-update-dialog.method";

  export default {
    name: "CreateOrUpdateStoreDialog",
    mixins: [mixinData, mixinMethod],
  };
</script>

<style scoped>

</style>
