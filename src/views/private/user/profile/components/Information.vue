<template>
  <el-row>
    <el-form ref="userForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="firstName">
            <input-label label="Tên" required/>
            <el-input v-model="form.firstName" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="lastName">
            <input-label label="Họ" required/>
            <el-input v-model="form.lastName" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="email">
            <input-label label="Email" required/>
            <el-input v-model="form.email" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="phone">
            <input-label label="SĐT" optional/>
            <el-input v-model="form.phone" maxlength="10" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="gender">
            <input-label label="Giới tính" required/>
            <el-select class="full-width" v-model="form.gender">
              <el-option v-for="item in gender" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="birthday">
            <input-label label="Ngày sinh" optional/>
            <el-date-picker class="full-width" format="dd/MM/yyyy" v-model="form.birthday"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-form-item prop="address">
          <input-label label="Địa chỉ" optional/>
          <el-input v-model="form.address" maxlength="255" show-word-limit></el-input>
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
  import {mapState} from "vuex";
  import AccountService from "@/service/account.service";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "Information",
    computed: {
      ...mapState({
        currentUser: state => state.user.info
      })
    },
    data() {
      return {
        isLoading: false,
        form: {
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
          gender: null,
          birthday: null,
          address: null,
          langKey: "vi"
        },
        gender: [
          {label: 'Nam', value: 'MALE'},
          {label: 'Nữ', value: 'FEMALE'},
          {label: 'Không xác định', value: 'UNDEFINED'},
        ],
        formRules: {
          firstName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"},
          ],
          lastName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"},
          ],
          gender: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ],
          phone: [
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: this.$t("common.entity.validation.pattern", {pattern: "^(09|03|07|08|05)+([0-9]{8})$"}),
              trigger: "blur"
            },
          ],
          email: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'email', message: this.$t("common.entity.validation.email"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
          ],
          address: [
            {max: 255, message: this.$t("common.entity.validation.maxlength", {max: 255}), trigger: "blur"},
          ]
        }
      };
    },
    created() {
      this.form.firstName = this.currentUser.firstName;
      this.form.lastName = this.currentUser.lastName;
      this.form.email = this.currentUser.email;
      this.form.phone = this.currentUser.phone;
      this.form.gender = this.currentUser.gender;
      this.form.birthday = this.currentUser.birthday;
      this.form.address = this.currentUser.address;
    },
    methods: {
      submit() {
        const vm = this;
        this.$refs.userForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              await AccountService.updateAccount(this.form, null);
              MessageUtils.success("Cập nhật thành công!");
              vm.isLoading = false;
            } catch (e) {
              vm.isLoading = false;
              MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
          }
        });
      }
    }
  };
</script>

<style scoped></style>
