import {Mutation} from "../types";

export default {
    [Mutation.DRAWER](state, drawer) {
        state.drawer = drawer
    }
}