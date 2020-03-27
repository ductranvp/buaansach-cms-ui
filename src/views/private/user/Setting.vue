<template>
  <el-row>
    <el-card shadow="never">
      <el-radio v-model="userLanguage" label="en" @change="setLanguage" border>English</el-radio>
      <el-radio v-model="userLanguage" label="vi" @change="setLanguage" border>Tiếng Việt</el-radio>
    </el-card>
  </el-row>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
export default {
  name: "Setting",
  computed: {
    ...mapState({
      userLanguage: state => state.user.info.langKey
    })
  },
  methods: {
    setLanguage(value){

    }
  };

};
</script>

<style scoped></style>
