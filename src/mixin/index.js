import Vue from 'vue';
import filters from '@/mixin/filters';
import methods from "@/mixin/methods";
import computed from "@/mixin/computed";
import defaultStoreImage from "@/assets/images/banner_success.jpg";

Vue.mixin({
  filters,
  data(){
    return {
      defaultStoreImage
    };
  },
  computed,
  methods
});
