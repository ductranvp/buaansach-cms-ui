<template>
  <!--  <label class="required">{{ $t("components.inputLabel.required") }}</label>-->
  <el-tag :effect="effect" type="danger" size="mini" class="margin-left-10">
    <span>{{ $t("components.inputLabel.required") }}</span>
  </el-tag>
</template>

<script>
export default {
  name: "RequiredLabel",
  props: {
    effect: {
      type: String,
      default: "light"
    }
  }
};
</script>

<style scoped>
.required {
  color: #fff;
  background-color: #fb4040;
  padding: 2px 5px;
  margin-left: 10px;
  border-radius: 3px;
  font-size: 70%;
}
</style>
