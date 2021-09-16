import {Mutation} from "../types";

export default {
    [Mutation.LOADING](state, loading) {
        state.loading = loading
    }
}