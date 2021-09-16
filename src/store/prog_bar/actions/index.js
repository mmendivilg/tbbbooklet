import {Action, Mutation} from '../types'

export default {
  [Action.LOADING]({commit}, loading) {
    commit(`${[Mutation.LOADING]}`, loading)
  },
}