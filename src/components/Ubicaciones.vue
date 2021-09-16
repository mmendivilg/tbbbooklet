<template>
  <v-data-table
    :headers="headers"
    :items="ubicaciones"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:top>
    <v-toolbar
          flat
        >
      <v-toolbar-title>Ubicaciones</v-toolbar-title>
      <v-divider
        class="mx-4"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-btn
        color="blue-grey darken-1"
        dark
        class="mb-2"
        @click="newItem()"
      >
        New Item
      </v-btn>
      <template>
        <editar-ubicacion />
      </template>
      <template>
        <ubicacion-upload/>
      </template>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
            <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    </template>
    <template  v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
          v-model="item.action"
          @click="editItem(item)"
          v-bind="attrs"
          v-on="on"
          >
            {{ icons.mdiPencil }}
          </v-icon>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
          @click="uploadItem(item)"
          v-bind="attrs"
          v-on="on"
          >
            {{ icons.mdiImagePlus }}
          </v-icon>
        </template>
        <span>Upload Image</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
          @click="openGalleryNewTab(item)"
          v-bind="attrs"
          v-on="on"
          >
            {{ icons.mdiImageMultiple }}
          </v-icon>
        </template>
        <span>View Images</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
          @click="deleteItem(item)"
          v-bind="attrs"
          v-on="on"
          >
            {{ icons.mdiTrashCan }}
          </v-icon>
        </template>
        <span>Remove</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { Action as ubicacionesAction } from '../store/ubicaciones/types'
import { Action as markerAction } from '../store/marker/types'
import { Action as editDialogAction } from '../store/edit_dialog/types'
import { Action as editedItemAction } from '../store/edited_item/types'
import { Action as kmlFeaturesAction } from '../store/kml_features/types'
import { Action as fileRecordsAction } from '../store/file_records/types'
import { Action as progAction } from '../store/prog_bar/types'
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
    mdiImagePlus,
    mdiImageMultiple,
    mdiTrashCan
  } from '@mdi/js'
import EditarUbicacion from './EditarUbicacion.vue'
import UbicacionUpload from './UbicacionUpload.vue'
import defaultMarker from '../constants/defaultMarker'
const {
  DEFAULT_MARKER,
} = defaultMarker;


export default {
  components: {
    EditarUbicacion,
    UbicacionUpload
  },
  data () {
    return {
      dialogDelete: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Latitud', value: 'lat' },
        { text: 'Longitud', value: 'lng' },
        { text: 'Actions', value: 'actions', sortable: false},
      ],
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiImagePlus,
        mdiImageMultiple,
        mdiTrashCan
      },
      toDeleteItem: null,
      marcador: {},
    }
  },
  computed: {
    ubicaciones : function(){ 
      return this.$store.getters.getUbicaciones ?? [] },
  },
  created: function(){
    this.$store.dispatch(`${[ubicacionesAction.UBICACIONES]}`)
  },
  methods: {
    editItem (item) {
      // console.log("edit item", item)
      this.marcador = Object.assign({}, item); 
      if(!item.features_list_selected){
        item.features_list_selected =  [...item.kml_features.features] ?? []
      }
      this.$store.dispatch(`${[editedItemAction.IS_UBICACION_NEW_ITEM]}`, false)
      this.$store.dispatch(`${[editedItemAction.EDITED_ITEM]}`, item)
      this.$store.dispatch(`${[editDialogAction.EDIT_DIALOG]}`, true)
    },
    newItem () {
      var defaultItem = {
        id: null,
        nombre: DEFAULT_MARKER.nombre,
        position: { lat: DEFAULT_MARKER.position.lat, lng: DEFAULT_MARKER.position.lng },
        kml_features: {
          features: [],
          geojson: null
        },
        features_list_selected: []
      };
      // this.marcador = Object.assign( {}, this.defaultItem )
      // // console.log("I activated", this.marcador)
      // console.log("defaultItem", this.defaultItem())
      // this.$store.dispatch(`${[markerAction.MARKER]}`, Object.assign({}, defaultItem))
      this.$store.dispatch(`${[editedItemAction.EDITED_ITEM]}`, defaultItem)
      this.$store.dispatch(`${[editedItemAction.IS_UBICACION_NEW_ITEM]}`, true)
      this.$store.dispatch(`${[editDialogAction.EDIT_DIALOG]}`, true)
    },
    uploadItem (item) {
      this.$store.dispatch(`${[editDialogAction.UPLOAD_DIALOG]}`, true)
      this.$store.dispatch(`${[fileRecordsAction.FILE_RECORDS]}`, item.archivos)
      this.$store.dispatch(`${[editedItemAction.EDITED_ITEM]}`, item)
    },
    deleteItem (item) {
      this.toDeleteItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.dialogDelete = false
      this.$store.dispatch(`${[progAction.LOADING]}`, true)
      this.$store.dispatch(`${[ubicacionesAction.UBICACIONES_DELETE]}`, this.toDeleteItem)
      .then(() => {
        this.$store.dispatch(`${[progAction.LOADING]}`, false)
      })
    },
    openGalleryNewTab (item) {
      let routeData = this.$router.resolve({
        name: 'gallery', 
        params: { id: item.id },
      })
      window.open(routeData.href, '_blank');
    },
    defaultItem() {
      return Object.assign({}, this.defaultObItem) 
    }
  }
}
</script>