<template>
  <GoogleMapLoader 
    :mapConfig="mapConfig"
    :apiKey="api_key"
  >
    <template slot-scope="{ google, map, infoWindow }">
      <GoogleMapMarker
        v-for="marker in ubicaciones"
        :key="marker.letter_id"
        :marker="marker"
        :google="google"
        :map="map"
        :infoWindow="infoWindow"
        :ubicacionId="marker.id"
      />
      <GoogleMapLine
        v-for="line in lines"
        :key="line.id"
        :path.sync="line.path"
        :google="google"
        :map="map"
      />
      <GoogleMapKMLFeatures
        :google="google"
        :map="map"
        :features="features"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapKMLFeatures from "./GoogleMapKMLFeatures";
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";
import GoogleMapLine from "./GoogleMapLine";
import { mapSettings } from "@/constants/mapSettings";

export default {
  components: {
    GoogleMapKMLFeatures,
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapLine
  },
  props: {
    ubicaciones: {
      type: Array,
      required: true
    },
    features: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      api_key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      markers: [
        // {
        //   id: "a",
        //   position: { lat: 22.88120024637345, lng: -109.94021165433583 },
        //   title: "Hellooooo"
        // },
        // {
        //   id: "b",
        //   position: { lat: 22.881951475149418, lng: -109.92853868070301 },
        //   title: "Hellooooo2"
        // },
        // {
        //   id: "c",
        //   position: { lat: 22.878867456837, lng: -109.91815316739735 },
        //   title: "Hellooooo3"
        // }
      ],
      lines: [
        // {
        //   id: "1",
        //   path: [{ lat: 22.88120024637345, lng: -109.94021165433583 }, { lat: 22.881951475149418, lng: -109.92853868070301 }, { lat: 22.878867456837, lng: -109.91815316739735 }]
        // },
        // {
        //   id: "1",
        //   path: [{ lat: 22.88120024637345, lng: -109.94021165433583 }, { lat: 22.881951475149418, lng: -109.92853868070301 }]
        // },
        // {
        //   id: "2",
        //   path: [{ lat: 22.881951475149418, lng: -109.92853868070301 }, { lat: 22.878867456837, lng: -109.91815316739735 }]
        // }
      ]
    };
  },
  computed: {
    mapConfig() {
      let positions = []
      this.ubicaciones.forEach(element => {
        positions.push(element.position)
      })
      return {
        ...mapSettings,
        positions: positions
      };
    }
  }
};
</script>
