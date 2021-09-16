<script>
import { POINT_MARKER_ICON_CONFIG } from "@/constants/mapSettings";

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  data: function() {
    return {
      // toggleBounce: function() {
        // console.log(this.getPosition())
        // alert(this.getPosition());
        // alert('test')
      // },
      // addMarker() {
        // console.log(this.currentPlace)
          // const marker = {
          //   lat: 4.839207+0.01,
          //   lng: 96.55883789+0.01
          // };
          // console.log(marker)
          // this.markers.push({ position: marker });
          // this.places.push(this.currentPlace)
          // this.center = marker
        // if (this.currentPlace) {
        //   const marker = {
        //     lat: this.currentPlace.geometry.location.lat(),
        //     lng: this.currentPlace.geometry.location.lng()+0.01
        //   };
        //   console.log(marker)
        //   this.markers.push({ position: marker });
        //   this.places.push(this.currentPlace)
        //   this.center = marker
        //   this.currentPlace = null
        // }
      // },
      marcador2: null
    };
  },

  mounted() {
    const { Marker } = this.google.maps;

    this.marcador2 = new Marker({
      position: this.marker.position,
      title: this.marker.title,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    });


    // marker.addListener("click", () => {
    //   this.infoWindow.setContent(contentString);
    //   this.infoWindow.open(this.map, marker);
    // });
  },
  computed: {
    marcador : function(){ return this.$store.getters.getMarker ?? [] },
  },
  watch: {
    marcador (newMarcador, oldMarcador) {
      // console.log('herreeee')

      const { Marker } = this.google.maps;
      this.marcador2.setMap(null)
      this.marcador2 = new Marker({
        position: newMarcador.position,
        title: newMarcador.title,
        marker: newMarcador,
        map: this.map,
        icon: POINT_MARKER_ICON_CONFIG
      });
    }
  },
  // render() {},
  render (h) {
    return h('div', '')
  }
};
</script>

<style>
#firstHeading {
  color: brown;
  text-align: left;
}
</style>
