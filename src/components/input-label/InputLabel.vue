<template>
  <el-row class="full-width" type="flex" align="middle">
    <label class="custom-label" :class="effect === 'dark' ? 'text-light' : 'text-dark'">{{ label }}</label>
    <required-label :effect="effect" v-if="required"/>
    <optional-label :effect="effect" v-if="optional"/>
  </el-row>
  <!--  <div style="display: inline-block; width: 100%;">-->
  <!--    -->
  <!--  </div>-->
</template>

<script>
  import RequiredLabel from "@/components/input-label/modules/RequiredLabel";
  import OptionalLabel from "@/components/input-label/modules/OptionalLabel";

  export default {
    name: "InputLabel",
    components: {OptionalLabel, RequiredLabel},
    props: {
      effect: {
        type: String,
        default: 'light'
      },
      label: {
        type: String,
        required: true
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

<style scoped>
  .custom-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
