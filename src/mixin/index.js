import Vue from 'vue';
import filters from '@/mixin/filters';
import methods from "@/mixin/methods";
import computed from "@/mixin/computed";
import defaultStoreImage from "@/assets/images/banner_success.png";
import logoImage from "@/assets/images/logo.png";
import logoSquareImage from "@/assets/images/logo_square.png";
import noImage from "@/assets/images/no_image.png";

Vue.mixin({
  filters,
  data(){
    return {
      defaultStoreImage,
      logoImage,
      logoSquareImage,
      noImage
    };
  },
  computed,
  methods
});
