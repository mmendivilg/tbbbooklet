<script>
import { mdiScrewFlatTop } from '@mdi/js';
import { Action as kmlFeaturesAction } from '../../store/kml_features/types'

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
    features: {
      type: Object,
      required: true
    }
  },

  data: function() {
    return {
      allFeatures: null,
      infoWindow: null,
    }
  },
  mounted() {
      this.allFeatures = {};
      const { InfoWindow } = this.google.maps;
      this.infoWindow = new InfoWindow();

      // console.log("this.features",this.features)
      if(!this.features.features.length) return;

      this.features.features.forEach(kml_feature => {
        this.allFeatures[kml_feature.uuid] = this.createPolygon(kml_feature, this.map)
      });
  },
  methods: {
    removeFeatures(features){
      if(features && Object.keys(features).length>0){
        Object.keys(features).forEach(uuid => {
          features[uuid].setMap(null)
        });
      }
    },
    createPolygon(kml_feature, map){
      const { Polygon } = this.google.maps;
      var polygon = new Polygon({
            paths: kml_feature.paths,
            strokeColor: kml_feature.strokeColor,
            strokeOpacity: kml_feature.strokeOpacity,
            strokeWeight: kml_feature.strokeWeight,
            fillColor: kml_feature.fillColor,
            fillOpacity: kml_feature.fillOpacity,
        });
      if(kml_feature.visible){
        polygon.setMap(map)
      }
      var area = this.google.maps.geometry.spherical.computeArea(polygon.getPath());
      polygon.addListener("click", (event)=>{
        this.showInfoWindow(event, polygon, kml_feature.title, area)
      });
      return polygon;
    },
    showInfoWindow(event, polygon, title, area){
      // console.log("event", event)
      // console.log("polygon", polygon)
      let contentString =
        "<b>"+title+"</b><br>" +
        "Area: <br>" +
        area.toFixed(2) +
        " sqm<br>"+
        "Clicked location: <br>" +
        event.latLng.lat() +
        "," +
        event.latLng.lng() +
        "<br>";
      this.infoWindow.setContent(contentString);
      this.infoWindow.setPosition(event.latLng);
      this.infoWindow.open(this.map);
    }
  },

  render (h) {
    return h('div', '')
  }
};
</script>
