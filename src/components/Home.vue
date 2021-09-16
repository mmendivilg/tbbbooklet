<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
          <router-link to="/maps">
            <v-img
            alt="Abora Project"
            contain
            src="@/assets/abora_logo.png/"
            max-width="450"
            />
          </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'Home',
    // data: function () {
    //   return {
    //     text:''
    //   }
    // },
  }
</script>
