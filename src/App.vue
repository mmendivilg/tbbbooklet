<template>
  <v-app>
    <navigation-drawer/>
    <app-bar/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { Action as authAction } from './store/auth/types'
import NavigationDrawer from './components/NavigationDrawer.vue'
import AppBar from './components/AppBar.vue'

export default {
  name: 'App',
  components: {
    NavigationDrawer,
    AppBar,
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(`${[authAction.LOGOUT]}`)
        }
        throw err;
      });
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.v-navigation-drawer {
z-index: 999999 !important;
}
.v-menu {
z-index: 999999 !important;
}
</style>
