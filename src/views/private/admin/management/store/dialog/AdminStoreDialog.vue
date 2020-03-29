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
          <el-form-item prop="code">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.code')"
              required
            />
            <el-input
              v-model="storeEntity.code"
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
          <el-form-item prop="name">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.name')"
              required
            />
            <el-input
              v-model="storeEntity.name"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="address">
        <input-label
          :label="$t('private.adminStorePage.storeEntity.address')"
          required
        />
        <el-input
          v-model="storeEntity.address"
          maxlength="255"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="ownerName">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.ownerName')"
              required
            />
            <el-input
              v-model="storeEntity.ownerName"
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
          <el-form-item prop="ownerPhone">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.ownerPhone')"
              required
            />
            <el-input
              v-model="storeEntity.ownerPhone"
              maxlength="50"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="ownerEmail">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.ownerEmail')"
              optional
            />
            <el-input
              v-model="storeEntity.ownerEmail"
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
          <el-form-item prop="taxCode">
            <input-label
              :label="$t('private.adminStorePage.storeEntity.taxCode')"
              optional
            />
            <el-input
              v-model="storeEntity.taxCode"
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
            :label="$t('private.adminStorePage.storeEntity.status')"
            required
          />
          <el-select class="full-width" v-model="storeEntity.status">
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

      <el-form-item v-if="storeEntity.id">
        <input-label
          :label="$t('private.adminStorePage.storeEntity.updateReason')"
          optional
        />
        <el-input
          type="textarea"
          v-model="storeEntity.updateReason"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item>
        <input-label
          optional
          :label="$t('private.adminStorePage.storeEntity.imageUrl')"
        />
        <single-image-uploader
          ref="singleImageUploader"
          @imageCleared="onImageCleared"
          :image-url-prop.sync="storeEntity.imageUrl"
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
import mixinData from "@/views/private/admin/management/store/dialog/dialog.data";
import mixinMethod from "@/views/private/admin/management/store/dialog/dialog.method";

export default {
  name: "AdminStoreDialog",
  mixins: [mixinData, mixinMethod]
};
</script>

<style scoped>
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>
