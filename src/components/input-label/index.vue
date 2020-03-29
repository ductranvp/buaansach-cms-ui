<template>
  <div style="display: inline-block; width: 100%;">
    <label>{{ label }}</label>
    <required-label v-if="required" />
    <optional-label v-if="optional" />
    <span class="padding-left-20">
      <el-tag v-if="validationTip" type="danger">{{ validationTip }}</el-tag>
    </span>
  </div>
</template>

<script>
import RequiredLabel from "@/components/input-label/modules/RequiredLabel";
import OptionalLabel from "@/components/input-label/modules/OptionalLabel";
export default {
  name: "InputLabel",
  components: { OptionalLabel, RequiredLabel },
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
