import {Action, Mutation} from '../types'

export default {
  [Action.FILE_RECORDS]({state, commit, rootState}, archivos) {
    return new Promise((resolve) => {
      commit(`${[Mutation.FILE_RECORDS]}`, archivos)
      resolve()
    })
  },
}