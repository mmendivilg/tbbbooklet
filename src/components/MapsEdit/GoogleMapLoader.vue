<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { Action as markerAction } from '../../store/marker/types'

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null,
    };
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      libraries: ['geometry'],
      apiKey: this.apiKey,
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
      this.map.addListener("click", (e) => {
        // console.log(e.latLng.toJSON())
        // console.log(e.latLng.lat)
        let nuevoMarcador = {
          title: this.marcador.title,
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          }
        }
        this.$store.dispatch(`${[markerAction.MARKER]}`, nuevoMarcador)
      })
    }
  },
  computed: {
    marcador : function(){ return this.$store.getters.getMarker ?? [] },
  },
  watch: {
    marcador (newMarcador, oldMarcador) {
      // console.log("I activated", "yeah")
      // console.log(newMarcador)
      if(this.map){
        // this.map.setCenter(newMarcador.position)
        this.map.panTo(newMarcador.position)
      }
    }
  }
};
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>
