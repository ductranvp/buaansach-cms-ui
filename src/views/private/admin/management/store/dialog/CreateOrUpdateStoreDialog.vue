<template>
  <el-dialog
    :title="dialogTitle"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
  >
    <el-form :model="storeEntity" ref="storeForm" :rules="storeEntityRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeCode">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeCode')"
              required
            />
            <el-input
              v-model="storeEntity.storeCode"
              maxlength="20"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <input-label label="" />
        </el-col>
        <el-col :span="11">
          <el-form-item prop="storeName">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeName')"
              required
            />
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
        <input-label
          :label="$t('private.adminStorePage.storeEntity.storeAddress')"
          required
        />
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
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeOwnerName')"
              required
            />
            <el-input
              v-model="storeEntity.storeOwnerName"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <input-label label="" />
        </el-col>
        <el-col :span="11">
          <el-form-item prop="storeOwnerPhone">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeOwnerPhone')"
              required
            />
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
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeOwnerEmail')"
              optional
            />
            <el-input
              v-model="storeEntity.storeOwnerEmail"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <input-label label="" />
        </el-col>
        <el-col :span="11">
          <el-form-item prop="storeTaxCode">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.storeTaxCode')"
              optional
            />
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
          <input-label
            :label="$t('private.adminStorePage.storeEntity.storeStatus')"
            required
          />
          <el-select class="full-width" v-model="storeEntity.storeStatus">
            <el-option
              v-for="item in storeStatus"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item v-if="storeEntity.guid">
        <input-label
          :label="$t('private.adminStorePage.storeEntity.lastUpdateReason')"
          optional
        />
        <div v-if="previousUpdateReason">
          <em
            >{{
              $t("private.adminStorePage.storeEntity.previousUpdateReason")
            }}: <b>{{ previousUpdateReason }}</b></em
          >
        </div>
        <el-input
          type="textarea"
          v-model="storeEntity.lastUpdateReason"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item>
        <input-label
          optional
          :label="$t('private.adminStorePage.storeEntity.storeImageUrl')"
        />
        <single-image-uploader
          ref="singleImageUploader"
          @imageCleared="onImageCleared"
          :image-url-prop.sync="storeEntity.storeImageUrl"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide($event)">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isSaving">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import mixinData from "@/views/private/admin/management/store/dialog/create-or-update-dialog.data";
import mixinMethod from "@/views/private/admin/management/store/dialog/create-or-update-dialog.method";

export default {
  name: "CreateOrUpdateStoreDialog",
  mixins: [mixinData, mixinMethod]
};
</script>

<style scoped>
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>
