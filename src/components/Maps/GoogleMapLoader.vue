<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map) && Boolean(this.infoWindow)">
      <slot
        :google="google"
        :map="map"
        :infoWindow="infoWindow"
      />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null,
      infoWindow: null,
    };
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      libraries: ['geometry'],
      apiKey: this.apiKey,
    });
    this.google = googleMapApi;
    const { InfoWindow } = googleMapApi.maps;
    this.infoWindow = new InfoWindow();
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      let bounds = new this.google.maps.LatLngBounds();
      this.mapConfig.positions.forEach(position => {
        var latlng = new this.google.maps.LatLng( position.lat, position.lng );
        bounds.extend( latlng );
      });
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
      if( this.mapConfig.positions.length == 1 ){
        this.map.setCenter( bounds.getCenter() );
        this.map.setZoom( 16 );
      } else {
        this.map.fitBounds( bounds );
      }
      this.map.addListener("click", (e) => {
        // console.log(e.latLng.toJSON())
      })
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
