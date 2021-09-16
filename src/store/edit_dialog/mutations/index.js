import {Mutation} from "../types";

export default {
    [Mutation.EDIT_DIALOG](state, edit_dialog) {
        state.edit_dialog = edit_dialog
    },
    [Mutation.UPLOAD_DIALOG](state, upload_dialog) {
        state.upload_dialog = upload_dialog
    }
}