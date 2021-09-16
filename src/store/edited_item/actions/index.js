import {Action, Mutation} from '../types'

export default {
  [Action.EDITED_ITEM]({commit}, edited_item) {
    commit(`${[Mutation.EDITED_ITEM]}`, edited_item)
  },
  [Action.IS_UBICACION_NEW_ITEM]({commit}, is_new_item) {
    commit(`${[Mutation.IS_UBICACION_NEW_ITEM]}`, is_new_item)
  },
}