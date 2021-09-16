import axios from '../../../services/axios-auth'
import {Action, Mutation} from '../types'

export default {
  [Action.UBICACIONES]({commit}) {
    return new Promise((resolve) => {
      axios.get('/ubicaciones')
      .then(resp => {
        commit(`${[Mutation.UBICACIONES]}`, resp.data)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        // reject(err)
      })
    })
  },
  [Action.UBICACIONES_ACT]({commit}, data){
    return new Promise((resolve, reject) => {
      axios.put(`/ubicaciones/${data.id}`, { 
        nombre: data.nombre, 
        lat: data.lat, 
        lng: data.lng,
        kml_features: data.kml_features,
      })
      .then(resp => {
        commit(`${[Mutation.UBICACIONES_ACT]}`, resp.data)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  [Action.UBICACIONES_NEW]({commit}, data){
    return new Promise((resolve, reject) => {
      axios.post('/ubicaciones', { 
        nombre: data.nombre, 
        lat: data.lat, 
        lng: data.lng,
        kml_features: data.kml_features,
      })
      .then(resp => {
        commit(`${[Mutation.UBICACIONES_NEW]}`, resp.data)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  [Action.UBICACIONES_DELETE]({commit}, data){
    return new Promise((resolve, reject) => {
      axios.delete(`/ubicaciones/${data.id}`)
      .then(resp => {
        commit(`${[Mutation.UBICACIONES_DELETE]}`, data.id)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  [Action.UBICACIONES_NEW_UPLOAD]({commit}, data){
    return new Promise((resolve, reject) => {
      commit(`${[Mutation.UBICACIONES_NEW_UPLOAD]}`, data)
      resolve()
    })
  },
  [Action.UBICACIONES_DELETE_UPLOAD]({commit}, data){
    return new Promise((resolve, reject) => {
      axios.delete(`/archivo/ubicaciones/${data.id_ubicacion}/${data.id_archivo}`)
      .then(resp => {
        commit(`${[Mutation.UBICACIONES_DELETE_UPLOAD]}`, data)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
}
