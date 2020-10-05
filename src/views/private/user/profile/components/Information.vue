<template>
  <el-row>
    <el-form ref="userForm" :model="form" :rules="formRules">
      <el-form-item prop="fullName">
        <input-label label="Tên" required/>
        <el-input v-model="form.fullName" maxlength="50" show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="userEmail">
            <input-label label="Email" required/>
            <el-input v-model="form.userEmail" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="userPhone">
            <input-label label="SĐT"/>
            <el-input disabled v-model="form.userPhone" maxlength="10" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="userGender">
            <input-label label="Giới tính"/>
            <el-select class="full-width" v-model="form.userGender">
              <el-option v-for="item in gender" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="userBirthday">
            <input-label label="Ngày sinh" optional/>
            <el-date-picker class="full-width" format="dd/MM/yyyy" v-model="form.userBirthday"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-form-item prop="userAddress">
          <input-label label="Địa chỉ"/>
          <el-input v-model="form.userAddress" maxlength="255" show-word-limit></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="isLoading"
          @click="submit"
          type="success"
        >
          <span>Cập nhật</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import UserService from '@/service/shared/user.service';
  import MessageUtils from '@/utils/message.util';
  import Gender from '@/enum/Gender';
  import Constants from '@/utils/constants';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'Information',
    data() {
      return {
        isLoading: false,
        form: {
          fullName: null,
          userEmail: null,
          userPhone: null,
          userGender: null,
          userBirthday: null,
          userAddress: null,
          langKey: null,
        },
        gender: Gender.optionArray,
        formRules: {
          fullName: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
          ],
          // userGender: [
          //   {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          // ],
          // userPhone: [
          //   {
          //     pattern: Constants.PHONE_REGEX,
          //     message: this.$t('common.entity.validation.pattern', {pattern: Constants.PHONE_REGEX}),
          //     trigger: 'blur',
          //   },
          // ],
          userEmail: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {type: 'email', message: this.$t('common.entity.validation.email'), trigger: 'blur'},
            {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
          ],
          userAddress: [
            {max: 255, message: this.$t('common.entity.validation.maxlength', {max: 255}), trigger: 'blur'},
          ],
        },
      };
    },
    created() {
      this.form = this.currentUser;
    },
    methods: {
      submit() {
        const vm = this;
        this.$refs.userForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              await UserService.updateUser(this.form, null);
              MessageUtils.success('Cập nhật thành công!');
              vm.isLoading = false;
            } catch (error) {
              vm.isLoading = false;
              ErrorUtils.showActionErrorMessage(error);
            }
          }
          await vm.$store.dispatch('user/getAccount');
        });
      },
    },
  };
</script>

<style scoped></style>
