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
      existingFeatures: null,
      kmlFeatures: null,
      allFeatures: null,
      infoWindow: null,
    }
  },
  mounted() {
      this.existingFeatures = {};
      const { InfoWindow } = this.google.maps;
      this.infoWindow = new InfoWindow();

      // console.log("this.features",this.features)
      if(!this.features.features.length) return;

      this.features.features.forEach(kml_feature => {
        this.existingFeatures[kml_feature.uuid] = this.createPolygon(kml_feature, this.map)
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
    },
    centerMap(paths, maps){
      if(paths.length == 0) return;
      const { LatLngBounds, LatLng } = maps;
      var bounds = new LatLngBounds();
      paths.forEach((path)=>{
        bounds.extend(new LatLng(path.lat, path.lng))
      })
      if(this.map){
        this.map.panTo(bounds.getCenter())
        // this.map.setCenter(bounds.getCenter())
      }
    }
  },
  computed: {
    kmlFeaturesSt : function(){ return this.$store.getters.getKMLFeatures ?? [] },
    featuresSt : function(){ return this.$store.getters.getFeatures ?? [] },
    mapCenterSt : function(){ return this.$store.getters.getMapCenter ?? [] },
  },
  watch: {
    featuresSt (newFeatures, oldFeatures) {
      const { Polygon } = this.google.maps;
      
      this.removeFeatures(this.existingFeatures)
      this.existingFeatures = {};
      
      if(!newFeatures.features){
        newFeatures.features = []
      }
      newFeatures.features.forEach(kml_feature => {
        this.existingFeatures[kml_feature.uuid] = this.createPolygon(kml_feature, this.map)
      });
    },
    kmlFeaturesSt (newKmlFeatures, oldKmlFeatures) {
      const { Polygon } = this.google.maps;

      if(!this.existingFeatures){
        this.existingFeatures = {};
      }

      newKmlFeatures.features.forEach(kml_feature => {
        this.existingFeatures[kml_feature.uuid] = this.createPolygon(kml_feature, this.map)
      });
      if(newKmlFeatures.features.length>0){
        var paths = newKmlFeatures.features[0].paths;
        this.centerMap(paths, this.google.maps)
      }
    },
    mapCenterSt(newMapCenter, oldMapCenter){
      if(!newMapCenter) return;
      var paths = newMapCenter.paths;
      this.centerMap(paths, this.google.maps)
    }
  },

  render (h) {
    return h('div', '')
  }
};
</script>
