<template>
  <div style="display: inline-block; width: 100%;">
    <label>{{ label }}</label>
    <RequiredLabel v-if="required" />
    <OptionalLabel v-if="optional" />
    <span class="padding-left-20">
      <el-tag v-if="validationTip" type="danger">{{ validationTip }}</el-tag>
    </span>
  </div>
</template>

<script>
export default {
  name: "InputLabel",
  props: {
    label: {
      type: String,
      required: true
    },
    validationTip: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    optional: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style scoped></style>
