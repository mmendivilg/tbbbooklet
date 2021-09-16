import axios from '../../../services/axios-auth'
import localForage from 'localforage';
import {Action, Mutation} from '../types'

export default {
  [Action.LOGIN]({commit}, data) {
    return new Promise((resolve, reject) => {
      commit(`${[Mutation.AUTH_REQUEST]}`)
      axios.post('/login', { email: data.email, password: data.password })
      .then(resp => {
        const token = resp.data.token
        const user = resp.data.user
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        commit(`${[Mutation.LOGIN]}`, {token, user})
        resolve(resp)
      })
      .catch(err => {
        commit(`${[Mutation.AUTH_ERROR]}`)
        // Vue.rollbar.error(err);
        console.log(err)
        reject(err)
      })
    })
  },
  [Action.REGISTER]({commit}, user){
    return new Promise((resolve, reject) => {
      axios.post('/register', { 
        name: user.name, 
        email: user.email, 
        password: user.password,
      })
      .then(resp => {
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  [Action.LOGOUT]({commit}){
    return new Promise((resolve) => {
      commit(`${[Mutation.LOGOUT]}`)
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  },
  [Action.INIT]({commit}){
    return new Promise((resolve, reject) => {
      localForage.getItem(process.env.VUE_APP_STORAGE_KEY).then(function(value) {
        if(value){
          const token = value.auth.token
          const user = value.auth.user
          if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            commit(`${[Mutation.LOGIN]}`, {token, user})
          }
        } else {
          commit(`${[Mutation.LOGOUT]}`)
          delete axios.defaults.headers.common['Authorization']
        }
        resolve()
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
        reject('State of auth not defined')
        // reject(err)
      });
    })
  },
}