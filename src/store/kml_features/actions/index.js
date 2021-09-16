import {Action, Mutation} from '../types'

export default {
  [Action.KML_FEATURES]({commit}, kml_features) {
    commit(`${[Mutation.KML_FEATURES]}`, kml_features)
  },
  [Action.FEATURES]({commit}, features) {
    commit(`${[Mutation.FEATURES]}`, features)
  },
  [Action.DELETE_KML_FEATURES]({commit}) {
    commit(`${[Mutation.DELETE_KML_FEATURES]}`)
  },
  [Action.MAP_CENTER]({commit}, map_center) {
    commit(`${[Mutation.MAP_CENTER]}`, map_center)
  }
}