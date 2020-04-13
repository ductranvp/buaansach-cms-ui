<template>
  <!--  <label class="optional">{{ $t("components.inputLabel.optional") }}</label>-->
  <el-tag :effect="effect" type="primary" size="mini" class="margin-left-10">
    <span>{{ $t("components.inputLabel.optional") }}</span>
  </el-tag>
</template>

<script>
export default {
  name: "OptionalLabel",
  props: {
    effect: {
      type: String,
      default: "light"
    }
  }
};
</script>

<style scoped>
.optional {
  color: #fff;
  background-color: #026aa7 !important;
  padding: 2px 5px;
  margin-left: 10px;
  border-radius: 3px;
  font-size: 70%;
}
</style>
