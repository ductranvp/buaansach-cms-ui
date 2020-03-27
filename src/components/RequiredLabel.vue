<template>
  <label class="required">{{ $t("components.inputLabel.required") }}</label>
</template>

<script>
export default {
  name: "RequiredLabel"
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
