import {Mutation} from "../types";

export default {
    [Mutation.EDITED_ITEM](state, edited_item) {
        state.edited_item = edited_item
    },
    [Mutation.IS_UBICACION_NEW_ITEM](state, new_item) {
        state.is_ubicacion_new_item = new_item
    }
}