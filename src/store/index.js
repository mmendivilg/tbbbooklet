import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import localForage from 'localforage';
import axios from '../services/axios-auth'
import VueAxios from 'vue-axios'
import auth from './auth';
import prog_bar from './prog_bar';
import drawer from './drawer';
import ubicaciones from './ubicaciones';
import imagestest from './imagestest';
import marker from './marker';
import edit_dialog from './edit_dialog';
import edited_item from './edited_item';
import file_records from './file_records';
import kml_features from './kml_features';

Vue.use(Vuex)
Vue.use(VueAxios, axios)


const vuexStorage = new VuexPersist({
  key: process.env.VUE_APP_STORAGE_KEY,
  storage: localForage,
  asyncStorage: true,
  modules: ['auth'],
});


export default new Vuex.Store({
  plugins: [vuexStorage.plugin],
  modules: {
    auth,
    prog_bar,
    drawer,
    ubicaciones,
    imagestest,
    marker,
    edit_dialog,
    edited_item,
    file_records,
    kml_features,
  }
});