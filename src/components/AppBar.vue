<template>
  <v-app-bar
    app
    color="blue-grey darken-1"
    dark
  >
    <v-progress-linear
      :active="isLoading"
      indeterminate
      absolute
      top
      background-color="blue lighten-3"
    ></v-progress-linear>
    <v-app-bar-nav-icon color="black" @click.stop="toggleDrawer"></v-app-bar-nav-icon>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="@/assets/abora_mini_logo.png/"
        transition="scale-transition"
        width="40"
      />

    </div>

    <v-spacer></v-spacer>

    <span v-if="!isLoggedIn">
      <router-link tag="button" to="/register">Signup</router-link> |
      <router-link tag="button" to="/login">Login</router-link> 
    </span>

    <span v-if="isLoggedIn">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
          color="secondary"
          small
          fab
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
        <v-list-item>
          <v-list-item-avatar>
             <v-icon
             large
             >mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>John Doe</v-list-item-title>
            <v-list-item-subtitle>Founder of Helloworld</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item-group
            v-model="group_avatar"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>My Account</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </span>
  </v-app-bar>
</template>

<script>
import { Action as authAction} from '../store/auth/types'
import { Action as drawerAction } from '../store/drawer/types'


export default {
  name: 'App',
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn },
    isLoading : function(){ return this.$store.getters.isLoading },
    isDrawerActive : function(){ return this.$store.getters.isDrawerActive },
  },
  methods: {
    logout: function () {
      this.$store.dispatch(`${[authAction.LOGOUT]}`)
      .then(() => {
        this.$router.push('/login')
      })
    },
    toggleDrawer() {
      this.$store.dispatch(`${[drawerAction.DRAWER]}`, !this.isDrawerActive)
    }
  },

  data: () => ({
    group_avatar: null,
  })
}
</script>

