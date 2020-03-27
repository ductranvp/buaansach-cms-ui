<template>
  <label class="optional bg-primary">{{
    $t("components.inputLabel.optional")
  }}</label>
</template>

<script>
export default {
  name: "RequireLabel"
};
</script>

<style scoped>
.optional {
  color: #fff;
  padding: 2px 5px;
  margin-left: 10px;
  border-radius: 3px;
  font-size: 70%;
}
</style>
