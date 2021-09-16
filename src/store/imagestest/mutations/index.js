import {Mutation} from "../types";

export default {
    [Mutation.IMAGEN](state, imagen) {
        state.imagen = imagen
    }
}