<template>
  <ValidationObserver ref="obs">
    <v-container
      id="signup"
      fluid
    >
      <form>
        <v-row>
          <v-col cols="12">
            <ValidationProvider name="name" rules="required|max:80" v-slot="{ errors }">
              <v-text-field
                v-model="var_name"
                label="Your Name"
                :error-messages="errors"
                prepend-icon="mdi-mail"
                :error-count=4
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
              <v-text-field
                v-model="var_email"
                label="Email"
                :error-messages="errors"
                prepend-icon="mdi-mail"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="password" rules="required" v-slot="{ errors }">
              <v-text-field
                v-model="var_password"
                :error-messages="errors"
                label="Password"
                type="password"
              ></v-text-field>
            </ValidationProvider>
            <v-btn
              @click="submit"
            >
            submit
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-container>
  </ValidationObserver>
</template>

<script>
import { required, email, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import {Action} from '../store/auth/types'

setInteractionMode('eager')
  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver
    },
    data(){
      return {
        var_name : "John Doe",
        var_email : "john@doe.com",
        var_password : "johnd123",
        errors: null
      }
    },
    methods: {
      submit() {
        this.$refs.obs.validate().then(res => {
          if(res){
            let data = {
              name: this.var_name,
              email: this.var_email,
              password: this.var_password
            }
            this.$store.dispatch(`${[Action.REGISTER]}`, data)
            .then(() => this.$router.push('/'))
            .catch(err => {
              this.$refs.obs.setErrors(err.response.data.errors);
            })
          }
        })
      }
    }
  }
</script>