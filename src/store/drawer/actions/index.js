import {Action, Mutation} from '../types'

export default {
  [Action.DRAWER]({commit}, drawer) {
    commit(`${[Mutation.DRAWER]}`, drawer)
  },
}