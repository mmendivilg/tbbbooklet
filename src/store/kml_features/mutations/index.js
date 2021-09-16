import {Mutation} from "../types";
import defaultPolygonStyle from '../../../constants/defaultPolygonStyle'
import { v4 as uuidv4 } from 'uuid';
const {
  DEFAULT_POLYGON_STYLE,
} = defaultPolygonStyle;

export default {
  [Mutation.KML_FEATURES](state, geojson) {
    if(!geojson){
      return;
    }
    var features = [];
    geojson.features.forEach(feature => {
      if(feature.geometry.type == "Polygon") {
        var paths = [];
        if(feature.geometry.coordinates[0]){
          feature.geometry.coordinates[0].forEach(coordinate => {
            paths.push({
              lat: coordinate[1],
              lng: coordinate[0],
            })
          })
          features.push({
            paths: paths,
            uuid: uuidv4(),
            visible: true,
            title: feature.properties.name ?? "",
            color: feature.properties.fill ?? "#289e20",
            strokeColor: feature.properties.stroke ?? DEFAULT_POLYGON_STYLE.strokeColor,
            strokeOpacity: feature.properties['stroke-opacity']  ?? DEFAULT_POLYGON_STYLE.strokeOpacity,
            strokeWeight: feature.properties['stroke-weight']  ?? DEFAULT_POLYGON_STYLE.strokeWeight,
            fillColor: feature.properties.fill ?? DEFAULT_POLYGON_STYLE.fillColor,
            fillOpacity: feature.properties['fill-opacity'] ?? DEFAULT_POLYGON_STYLE.fillOpacity,
            geojson_feature: feature
          })
        }
      }
    });

    state.kml_features = {
      features: features,
      geojson: geojson,
    }
  },
  [Mutation.FEATURES](state, features) {
    state.features = features
  },
  [Mutation.DELETE_KML_FEATURES](state) {
    state.kml_features = {
      features: [],
      geojson: null
    }
  },
  [Mutation.MAP_CENTER](state, map_center) {
    state.map_center = map_center
  }
}