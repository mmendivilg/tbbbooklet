<template>
    <div class="container">
      <img :src="imgData"/>
    </div>
</template>

<script>
import { Action as imagenAction } from '../store/imagestest/types'
// import pretendGet from '../scripts/pretendGet'
export default {

  data: function () {
    return {
    };
  },
  components: {
  },
  computed: {
    imgData : function(){ 
        return this.$store.getters.getImagen ?? []
    },
  },
  created: function(){
    this.$store.dispatch(`${[imagenAction.IMAGEN]}`)
  },
  name: 'Gator',
  // Component not loaded yet
  // beforeRouteEnter(to, from, next) {
  //   pretendGet((err, name) => {
  //     next((vm) => {
  //       vm.setName(err, name)
  //     });
  //   });
  // },
  // // Component already loaded and route changes
  // beforeRouteUpdate(to, from, next) {
  //   this.name = null;
  //   pretendGet((err, name) => {
  //     this.setName(err, name);
  //     next();
  //   });
  // },
  // methods: {
  //   setName(err, name) {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       this.name = name;
  //     }
  //   }
  // },
  // mounted() {
  //   console.log('finished?')
  // }
}
</script> 