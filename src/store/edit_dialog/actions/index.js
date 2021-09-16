import {Action, Mutation} from '../types'

export default {
  [Action.EDIT_DIALOG]({commit}, edit_dialog) {
    commit(`${[Mutation.EDIT_DIALOG]}`, edit_dialog)
  },
  [Action.UPLOAD_DIALOG]({commit}, upload_dialog) {
    commit(`${[Mutation.UPLOAD_DIALOG]}`, upload_dialog)
  },
}