<template>
  <label class="optional">{{ $t("components.inputLabel.optional") }}</label>
</template>

<script>
export default {
  name: "OptionalLabel"
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
