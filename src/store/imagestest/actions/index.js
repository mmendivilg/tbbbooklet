import axios from '../../../services/axios-auth'
import {Action, Mutation} from '../types'

export default {
  [Action.IMAGEN]({commit}, id) {
    return new Promise((resolve) => {
      axios({
        method: 'get',
        url: `/archivo/ubicaciones/${id}`
      })
      .then(resp => {
        // let image = 'data:image/jpg;base64,'.concat(resp.data) 
        commit(`${[Mutation.IMAGEN]}`, resp.data)
        resolve(resp.data)
      })
      .catch(err => {
        console.log(err)
        // reject(err)
      })
    })
  },
  [Action.UPLOAD_IMAGEN]({commit}, data){
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('id', data.id);
      data.fileRecordsForUpload.forEach(element => {
        formData.append('archivos[]', element.file, element.file.name);
      });
      axios.post('/archivo/ubicaciones', formData)
      .then(resp => {
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
}