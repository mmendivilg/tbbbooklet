<template>
  <div>
    <TravelMap class="travel-map" :ubicaciones="ubicaciones" :features="features"/>
  </div>
</template>

<script>
import TravelMap from "./TravelMap";
import { Action as ubicacionesAction } from '../../store/ubicaciones/types'
import { Action as progAction } from '../../store/prog_bar/types'
import store from '../../store'

export default {
  components: {
    TravelMap
  },
  data: function () {
    return {
      ubicaciones: [],
      features: {},
    }
  },
  async beforeRouteEnter(to, from, next) {
    store.dispatch(`${[progAction.LOADING]}`, true)
    await store.dispatch(`${[ubicacionesAction.UBICACIONES]}`)
    next((vm) => {
      vm.setUbicaciones(null, store.getters.getUbicaciones)
    });
  },
  methods:{
    setUbicaciones(err, ubicaciones) {
      if (err) {
        console.error(err);
      } else {
        var features = []
        if(ubicaciones && ubicaciones.length>0){
          ubicaciones.forEach((ubicacion) => {
            if(ubicacion.kml_features && ubicacion.kml_features.features.length>0){
              ubicacion.kml_features.features.forEach((feature) => {
                features.push(feature)
              })
            }
          })
        }
        this.ubicaciones = ubicaciones;
        this.features = {features:features}
        this.$store.dispatch(`${[progAction.LOADING]}`, false)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.travel-map {
  height: 700px;
}

@media only screen and (device-height : 667px)
and (orientation : portrait)  {
    .travel-map {height: 450px;}
}
@media only screen and (device-height : 667px)
and (orientation : landscape)  {
    .travel-map {height: 250px;}
}
</style>