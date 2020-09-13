<template>
  <el-container>
    <create-or-update-banner-dialog @saved="getAllBanner" ref="bannerDialog"/>
    <el-header>
      <el-row class="text-right">
        <el-button type="primary" @click="createBanner">Tạo Mới</el-button>
      </el-row>
    </el-header>
    <el-main v-loading="isLoading">
      <raw-data-table :data="banners" show-index :default-sort="{prop: 'bannerOrder', order: 'ascending'}">
        <el-table-column label="Hình ảnh">
          <template slot-scope="{row}">
            <el-image style="width: 160px; height: 90px" fit="cover" :src="getMediaUrl(row.bannerImageUrl)"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="bannerType" label="Loại Banner" sortable>
          <template slot-scope="{row}">
            <el-tag>{{bannerTypeLabels[row.bannerType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bannerOrder" label="Thứ tự" sortable></el-table-column>
        <el-table-column label="Kích hoạt">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.bannerActivated">Bật</el-tag>
            <el-tag type="danger" v-else>Tắt</el-tag>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác">
            <template slot-scope="{ row }">
              <el-button size="mini" type="warning" plain @click="editBanner(row)">
                <span>Sửa</span>
              </el-button>
              <el-button size="mini" type="danger" plain @click="deleteBanner(row)">
                <span>Xóa</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import NotificationUtils from '@/utils/notification.util';
  import AdminBannerService from '@/service/admin/admin.banner.service';
  import MessageBoxUtils from '@/utils/message-box.util';
  import BannerType from '@/enum/BannerType';
  import CreateOrUpdateBannerDialog from '@/views/private/admin/banner/CreateOrUpdateBannerDialog';

  export default {
    name: 'AdminBanner',
    components: {CreateOrUpdateBannerDialog, RawDataTable},
    data() {
      return {
        isLoading: false,
        banners: [],
        bannerTypeLabels: BannerType.label,
      };
    },
    created() {
      this.getAllBanner();
    },
    methods: {
      async getAllBanner() {
        try {
          this.isLoading = true;
          const {data} = await AdminBannerService.getAllBanner();
          this.banners = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        } finally {
          this.isLoading = false;
        }
      },
      createBanner() {
        this.$refs.bannerDialog.create();
      },
      editBanner(banner) {
        this.$refs.bannerDialog.edit(banner);
      },
      async deleteBanner(banner) {
        await MessageBoxUtils.confirmPromise('Xóa banner?');
        try {
          await AdminBannerService.deleteBanner(banner.guid);
          this.getAllBanner();
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
    },
  };
</script>

<style scoped>

</style>
