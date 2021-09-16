import {Mutation} from "../types";

export default {
  [Mutation.MARKER](state, marcador) {
    var marker = {
      id: marcador.id,
      title: marcador.nombre,
      position: { lat: marcador.position.lat, lng: marcador.position.lng },
    };
    if (typeof marcador.title !== 'undefined') {
      marker.title = marcador.title;
    }
    state.marker = marker
  }
}