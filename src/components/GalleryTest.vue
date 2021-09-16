<template>
  <div>
    <gallery :images="imgData" :index="index" @close="index = null"></gallery>
    <div
      class="image"
      v-for="(image, imageIndex) in imgData"
      :key="imageIndex"
      @click="index = imageIndex"
      :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
    ></div>
  </div>
</template>

<script>
import VueGallery from 'vue-gallery';
import { Action as imagenAction } from '../store/imagestest/types'
// import pretendGet from '../scripts/pretendGet'
import store from '../store'
import { Action as progAction } from '../store/prog_bar/types'

export default {
  data: function () {
    return {
      imgData: [],
      imageId: null,
      images: [
        // 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        // 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        // 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
        // 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        // this.$store.getters.getImagen ?? [],
        
      ],
      index: null,
      name: null
    };
  },
  name: 'Gator',
  computed: {

  },
  components: {
    'gallery': VueGallery
  },

  // Component not loaded yet
  async beforeRouteEnter(to, from, next) {
    // pretendGet(next);
    store.dispatch(`${[progAction.LOADING]}`, true)
    let image = await store.dispatch(`${[imagenAction.IMAGEN]}`, to.params.id);
    next((vm) => {
      vm.setImgData(null, store.getters.getImagen, to.params.id)
    });
  },
  // Component already loaded and route changes
  // beforeRouteUpdate(to, from, next) {
  //   this.name = null;
  //   pretendGet((err, name) => {
  //     this.setName(err, name);
  //     next();
  //   });
  // },

  methods: {
    setImgData(err, imgData, id) {
      if (err) {
        console.error(err);
      } else {
        this.imgData = imgData;
        this.$store.dispatch(`${[progAction.LOADING]}`, false)
        this.imageId = id;
      }
    },
  }
}
</script> 

<style scoped>
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
    cursor: pointer;
  }
</style>