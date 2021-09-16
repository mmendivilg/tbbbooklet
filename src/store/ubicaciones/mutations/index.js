import {Mutation} from "../types";

export default {
  [Mutation.UBICACIONES](state, ubicaciones) {
    if(ubicaciones){
      if(ubicaciones.length > 0){
        ubicaciones.forEach((ubicacion) => {
          if(!ubicacion.kml_features || ubicacion.kml_features.length == 0){
            ubicacion.kml_features = {features: [], geojson: null};
          }
        })
      }
    }
    state.ubicaciones = ubicaciones
  },
  [Mutation.UBICACIONES_ACT](state, ubicacion) {
    let editedIndex = state.ubicaciones.findIndex(x => x.id === ubicacion.id)
    Object.assign(state.ubicaciones[editedIndex], ubicacion)
  },
  [Mutation.UBICACIONES_NEW](state, ubicacion) {
    state.ubicaciones.push(ubicacion)
  },
  [Mutation.UBICACIONES_DELETE](state, id) {
    let itemIndex = state.ubicaciones.findIndex(x => x.id === id)
    state.ubicaciones.splice(itemIndex, 1)
  },
  [Mutation.UBICACIONES_NEW_UPLOAD](state, data) {
    let itemIndex = state.ubicaciones.findIndex(x => x.id === data.id)
    data.file_results.forEach(element => {
      state.ubicaciones[itemIndex].archivos.push(element)
    });
  },
  [Mutation.UBICACIONES_DELETE_UPLOAD](state, data) {
    let itemIndex = state.ubicaciones.findIndex(x => x.id === data.id_ubicacion)
    let archivoIndex = state.ubicaciones[itemIndex].archivos.findIndex(x => x.id === data.id_archivo)
    state.ubicaciones[itemIndex].archivos.splice(archivoIndex, 1)
  },
}