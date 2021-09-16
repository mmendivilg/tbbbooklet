import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from './services/axios-auth'
import vuetify from './plugins/vuetify';
import * as VeeValidate from 'vee-validate';
import VueFileAgent from 'vue-file-agent';

// var Rollbar = require('vue-rollbar');
Vue.use(VeeValidate);
Vue.use(VueFileAgent);
// Vue.use(Rollbar, {
//   accessToken: 'c95eea863f884766827316ccd2ced6bc',
//   captureUncaught: true,
//   captureUnhandledRejections: true,
//   enabled: true,
//   source_map_enabled: true,
//   environment: 'production',
//   payload: {
//     client: {
//          javascript: {
//             code_version: '1.0'
//          }
//     }
//   }
// });

Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

