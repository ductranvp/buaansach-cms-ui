import Vue from 'vue';
import filters from '@/mixin/filters';
import methods from "@/mixin/methods";
import defaultStoreImage from "@/assets/images/banner_success.jpg";

Vue.mixin({
  filters,
  data(){
    return {
      defaultStoreImage
    };
  },
  methods
});
