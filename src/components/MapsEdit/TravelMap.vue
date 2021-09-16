<template>
  <GoogleMapLoader 
    :mapConfig="mapConfig"
    :apiKey="api_key"
  >
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        :key="'a'"
        :marker="marker"
        :google="google"
        :map="map"
      />
      <GoogleMapKMLFeatures
        :features="features"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";
import GoogleMapKMLFeatures from "./GoogleMapKMLFeatures";

import { mapSettings } from "@/constants/mapSettings";
import { Action as ubicacionesAction } from '../../store/ubicaciones/types'
import defaultMarker from '../../constants/defaultMarker'
const {
  DEFAULT_MARKER,
} = defaultMarker;

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapKMLFeatures
  },
  data() {
    return {
      api_key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      lines: [],
      marker: this.$store.getters.getMarker ?? DEFAULT_MARKER,
      features: this.$store.getters.getFeatures ?? {features:[]},
    };
  },
  computed: {
    mapConfig() {
      return {
        ...mapSettings,
        center: this.mapCenter
      };
    },
    mapCenter() {
      return { lat: this.marker.position.lat, lng:this.marker.position.lng };
    },
  }
};
</script>
