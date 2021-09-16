import {Mutation} from "../types";

export default {
  [Mutation.FILE_RECORDS](state, archivos) {
    let file_records = []
    archivos.forEach(archivo => {
      file_records.push({
        name: archivo.nombre,
        sizeText: archivo.sizeText,
        size: archivo.size,
        type: archivo.type,
        ext: archivo.ext,
        id_archivo: archivo.id_archivo,
        url: archivo.url_resized,
        dimensions: {
          width: archivo.dimensions.width,
          height: archivo.dimensions.height,
        }
      })
    });
    state.file_records = file_records
  }
}