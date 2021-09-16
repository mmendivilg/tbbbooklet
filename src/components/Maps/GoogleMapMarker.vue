<script>
import { POINT_MARKER_ICON_CONFIG } from "@/constants/mapSettings";
import infoWindowTemplate from 'raw-loader!../../assets/templates/infowindow.html';

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
    },
    infoWindow: {
      type: Object,
      required: true
    },
    ubicacionId: {
      type: Number,
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
    };
  },

  mounted() {
    const { Marker } = this.google.maps;

    const marker = new Marker({
      position: this.marker.position,
      title: this.marker.title,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    });
    let contentString = infoWindowTemplate.replaceAll('$infoWindow$', this.marker.title);
    contentString = contentString.replace('$ubicacionId$', this.ubicacionId);

    marker.addListener("click", () => {
      this.infoWindow.setContent(contentString);
      this.infoWindow.open(this.map, marker);
    });
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
