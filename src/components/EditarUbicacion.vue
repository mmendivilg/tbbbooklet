<template>
  <v-dialog
    v-model="isDialogActive"
    @keydown.esc="isDialogActive = false"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="blue-grey darken-3"

      >
        <v-btn
          icon
          dark
          @click="closeDialog = !closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Edit</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            :loading="loading"
            :disabled="loading" 
            @click="submit"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list
        three-line
        subheader
        justify="center"
      >
        <template>
          <ValidationObserver ref="ubObs">
            <v-container
              id="ubicacion"
            >
              <form>
                <ValidationProvider name="Title" rules="required|max:80" v-slot="{ errors }">
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Title"
                    :error-messages="errors"
                    prepend-icon="mdi-comment-text"
                    :error-count=4
                    @keydown.enter="textFieldEnter"
                  ></v-text-field>
                </ValidationProvider>
              </form>
            </v-container>
          </ValidationObserver>
        </template>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Latitude</v-list-item-title>
            <v-list-item-subtitle>{{ editedItem.position.lat }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Longitude</v-list-item-title>
            <v-list-item-subtitle>{{ editedItem.position.lng }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
        <v-file-input 
        v-model="kmlFileInput" 
        @change="selectedFile"
        label="Select a Google Earth (KML) file"
        ></v-file-input>
      <v-divider></v-divider>
          <v-select
            v-model="editedItem.features_list_selected"
            :items="editedItem.kml_features.features"
            attach
            chips
            label="Marked Areas"
            multiple
            deletable-chips
            item-text="title"
            readonly
          >
            <template v-slot:selection="{ item }">
              <v-chip 
                close 
                @click:close="test_remove_chip(item, $event)"
                @click.stop="test_click_chip(item, $event)"
                :color="item.color"
                >
                <span>{{ item.title }}</span>
              </v-chip>
            </template>
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                <v-list-item-action>
                <v-checkbox :input-value="active" @click="test(item, $event)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                    <span>{{ item.title }}</span>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:prepend-item>
              <v-list-item
                ripple
                @click="toggle"
              >
                <v-list-item-action>
                  <v-icon>
                    {{ icon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Select All
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-select>
      <v-divider></v-divider>
      <template>
        <maps-test/>
      </template>
    </v-card>
  </v-dialog>
</template>


<script>
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { Action as kmlFeaturesAction } from '../store/kml_features/types'
import { Action as ubicacionesAction } from '../store/ubicaciones/types'
import { Action as editDialogAction } from '../store/edit_dialog/types'
import { Action as editedItemAction } from '../store/edited_item/types'
import { Action as markerAction } from '../store/marker/types'
import MapsTest from './MapsEdit/MapsTest.vue'
import { required, max } from 'vee-validate/dist/rules'
import defaultMarker from '../constants/defaultMarker'
const togeojson = require('togeojson');
const {
  DEFAULT_MARKER,
} = defaultMarker;
setInteractionMode('eager')
extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})
export default {
  components: {
    MapsTest,
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      loader: null,
      loading: false,
      closeDialog: false,
      kmlFileInput: null,
      editedItem: {
        id: null,
        nombre: '',
        position:{
          lat:0,
          lng:0
        },
        kml_features: {
          features: []
        },
        features_list_selected: [],
      },
    }
  },
  computed: {
    marcadorSt : function(){ return this.$store.getters.getMarker ?? [] },
    kmlFeaturesSt : function(){ return this.$store.getters.getKMLFeatures ?? [] },
    editedItemSt : function(){ return this.$store.getters.getEditedItem ?? [] },
    isNewItemSt : function(){ return this.$store.getters.isUbicacionNewItem ?? [] },
    isDialogActive : {
      get: function(){ return this.$store.getters.isEditDialogActive },
      set: function(val) {
        this.$store.dispatch(`${[editDialogAction.EDIT_DIALOG]}`, val)
      }
    },
    allChipsSelected (){
      return this.editedItem.features_list_selected.length === this.editedItem.kml_features.features.length
    },
    someChipsSelected () {
      return this.editedItem.features_list_selected.length > 0 && !this.allChipsSelected
    },
    icon () {
      if (this.allChipsSelected) return 'mdi-close-box'
      if (this.someChipsSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  watch: {
    marcadorSt (newMarcador, oldMarcador) {
      this.editedItem.position.lat = newMarcador.position.lat
      this.editedItem.position.lng = newMarcador.position.lng
    },
    kmlFeaturesSt(newKmlFeatures, oldKmlFeatures){
      // console.log("this.editedItem.kml_features", this.editedItem.kml_features)

      if(!this.editedItem.kml_features.features){
        this.editedItem.kml_features.features = [];
      }
      // console.log("newKmlFeatures", newKmlFeatures)
      // console.log("this.editedItem.kml_features", this.editedItem.kml_features)
      newKmlFeatures.features.forEach((feature) => {
        this.editedItem.kml_features.features.push(feature)
        this.editedItem.features_list_selected.push(feature)
      })
      // console.log("this.editedItem.features_list_selected", this.editedItem.features_list_selected)

    },
    isNewItemSt () {
      // this.editedItem = Object.assign({}, this.defaultMarkerData)
      var defaultMarkerData = Object.assign({}, DEFAULT_MARKER)
      this.$store.dispatch(`${[markerAction.MARKER]}`, defaultMarkerData)
    },
    editedItemSt (editedItem) {
      this.editedItem = Object.assign({}, editedItem)
      this.$store.dispatch(`${[markerAction.MARKER]}`, this.editedItem)
      // console.log("this.editedItem.kml_features", this.editedItem.kml_features)
      this.$store.dispatch(`${[kmlFeaturesAction.FEATURES]}`, this.editedItem.kml_features)
      // console.log("here,here", this.editedItem.kml_features)
    },
    loader () { 
      const l = this.loader
      this[l] = !this[l]
    },
    closeDialog: function () {
      this.$store.dispatch(`${[editDialogAction.EDIT_DIALOG]}`, false)
      this.$store.dispatch(`${[editedItemAction.IS_UBICACION_NEW_ITEM]}`, false)
    },
  },
  methods: {
    toggle () {
      this.$nextTick(() => {
        if (this.allChipsSelected) {
          this.features_list_selected = []
        } else {
          this.features_list_selected = this.features_complete_list.slice()
        }
      })
    },
    test_click_chip(item, e){
      this.$store.dispatch(`${[kmlFeaturesAction.MAP_CENTER]}`, {paths: item.paths})
    },
    test_remove_chip(item, e){

      var featureToRemoveIndex = this.editedItem.kml_features.features.findIndex(x => x.uuid === item.uuid)
      if (featureToRemoveIndex > -1) {
        this.editedItem.kml_features.features.splice(featureToRemoveIndex, 1);
      }
      var featuresSelectedToRemoveIndex = this.editedItem.features_list_selected.findIndex(x => x.uuid === item.uuid)
      if (featuresSelectedToRemoveIndex > -1) {
        this.editedItem.features_list_selected.splice(featuresSelectedToRemoveIndex, 1);
      }
      this.$store.dispatch(`${[kmlFeaturesAction.FEATURES]}`, null) // <- so added this 
      this.$store.dispatch(`${[kmlFeaturesAction.FEATURES]}`, this.editedItem.kml_features)// <- this by it self doesn't work /\
    },
    test(item, e){
      //console.log(item, e)
    },
    textFieldEnter(e){
      e.preventDefault();
      this.submit();
    },
    submit() {
      this.$refs.ubObs.validate().then(res => {
        if(res){
          this.loader = 'loading'
          let data = {
            nombre: this.editedItem.nombre,
            lat: this.editedItem.position.lat,
            lng: this.editedItem.position.lng,
            id: this.editedItem.id,
            kml_features: this.editedItem.kml_features
          }
          var ubicacionAction = null
          if(this.isNewItemSt){
            ubicacionAction = ubicacionesAction.UBICACIONES_NEW
          } else {
            ubicacionAction = ubicacionesAction.UBICACIONES_ACT
          }
          this.$store.dispatch(`${[ubicacionAction]}`, data)
          .then((response, request) => {
            this.loader = null
            this.loading = false
            this.closeDialog = !this.closeDialog
            })
          .catch(err => {
            this.$refs.ubObs.setErrors(err.response.data.errors);
          })
        }
      })
    },
    selectedFile(file) {
      // console.log('selected a file');
      if(!file || file.type !== 'application/vnd.google-earth.kml+xml') return;

      let reader = new FileReader();
      const domparser = new DOMParser()
      reader.readAsText(file, "UTF-8");
      
      reader.onload = evt => {
        var xmlparsed = domparser.parseFromString(evt.target.result, "application/xml")
        var geojson = togeojson.kml(xmlparsed)
        this.$store.dispatch(`${[kmlFeaturesAction.KML_FEATURES]}`, geojson)
        this.kmlFileInput = null
      }
      reader.onerror = evt => {
        console.error(evt);
        this.kmlFileInput = null
      }
    }
  }
}
</script>