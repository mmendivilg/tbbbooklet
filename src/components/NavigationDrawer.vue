<template>
  <v-navigation-drawer
      v-model="isDrawerActive"
      mobile-breakpoint="960"
      absolute
      temporary
    >
     <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Aplicación
          </v-list-item-title>
          <v-list-item-subtitle>
            descripción
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item-group
            v-model="group_menu"
          >
          <v-list-item
          key="1"
          link
          @click="$router.push({ path: '/' })"
          >
            <v-list-item-icon>
              <v-icon>mdi-home-variant-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
          key="2"
          link
          @click="$router.push({ path: '/maps' })"
          >
            <v-list-item-icon>
              <v-icon>mdi-map-search</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Mapa</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
          key="3"
          link
          @click="$router.push({ path: '/ubicaciones' })"
          >
            <v-list-item-icon>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Ubicaciones</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import { Action as drawerAction } from '../store/drawer/types'

export default {
  data: () => ({
    group_menu: null,
  }),
  watch: {
    group_menu: function () {
      this.$store.dispatch(`${[drawerAction.DRAWER]}`, false)
    },
  },
  computed : {
    isDrawerActive : {
      get: function(){ return this.$store.getters.isDrawerActive },
      set: function(val) {
        this.$store.dispatch(`${[drawerAction.DRAWER]}`, val)
      }
    }
  }
}
</script>

<style>
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}
#nav a:hover {
  text-decoration: underline;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>