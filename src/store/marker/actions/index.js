import {Action, Mutation} from '../types'

export default {
  [Action.MARKER]({commit}, marker) {
    commit(`${[Mutation.MARKER]}`, marker)
  },
}