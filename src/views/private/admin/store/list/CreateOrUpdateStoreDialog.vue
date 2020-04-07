<template>
  <el-dialog
    :title="dialogTitle"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form :model="storeEntity" ref="storeForm" :rules="storeEntityRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeCode">
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeCode')" required/>
            <el-input
              ref="storeCode"
              v-model="storeEntity.storeCode"
              maxlength="20"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <input-label label=""/>
        </el-col>

        <el-col :span="11">
          <el-form-item prop="storeName">
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeName')" required/>
            <el-input
              v-model="storeEntity.storeName"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="storeAddress">
        <input-label :label="$t('private.adminStoreListPage.storeEntity.storeAddress')" required/>
        <el-input
          v-model="storeEntity.storeAddress"
          maxlength="255"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeOwnerName">
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeOwnerName')" required/>
            <el-input
              v-model="storeEntity.storeOwnerName"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <input-label label=""/>
        </el-col>

        <el-col :span="11">
          <el-form-item prop="storeOwnerPhone">
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeOwnerPhone')" required/>
            <el-input
              v-model="storeEntity.storeOwnerPhone"
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
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeOwnerEmail')" optional/>
            <el-input
              v-model="storeEntity.storeOwnerEmail"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <input-label label=""/>
        </el-col>

        <el-col :span="11">
          <el-form-item prop="storeTaxCode">
            <input-label :label="$t('private.adminStoreListPage.storeEntity.storeTaxCode')" optional/>
            <el-input
              v-model="storeEntity.storeTaxCode"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <input-label :label="$t('private.adminStoreListPage.storeEntity.storeStatus')" required/>
          <el-select class="full-width" v-model="storeEntity.storeStatus">
            <el-option
              v-for="item in storeStatus"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item v-if="storeEntity.guid">
        <input-label :label="$t('private.adminStoreListPage.storeEntity.lastUpdateReason')" optional/>
        <div v-if="previousUpdateReason">
          <em>{{$t("private.adminStoreListPage.storeEntity.previousUpdateReason")}}:
            <b>{{ previousUpdateReason }}</b>
          </em>
        </div>
        <el-input
          type="textarea"
          v-model="storeEntity.lastUpdateReason"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item>
        <input-label :label="$t('private.adminStoreListPage.storeEntity.storeImageUrl')" optional/>
        <single-image-uploader
          ref="singleImageUploader"
          @imageCleared="onImageCleared"
          :image-url-prop.sync="storeEntity.storeImageUrl"
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
