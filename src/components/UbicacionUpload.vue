<template>
  <div>
    <v-dialog
      v-model="isDialogActive"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      color="blue-grey darken-1"
    >
      <v-card>
        <v-toolbar
          dark
          color="blue-grey darken-1"
        >
          <v-btn
            icon
            dark
            @click="closeDialog = !closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Upload Photos</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <template>
          <VueFileAgent
          ref="vueFileAgent"
          :theme="'list'"
          :multiple="true"
          :deletable="true"
          :meta="true"
          :accept="'image/*'"
          :maxSize="'20MB'"
          :maxFiles="90"
          :helpText="'Choose images files'"
          :errorText="{
              type: 'Invalid file type. Only images allowed',
              size: 'Files should not exceed 20MB in size',
          }"
          @select="filesSelected($event)"
          @beforedelete="onBeforeDelete($event)"
          @delete="fileDeleted($event)"
          :disabled="isDisabled"
          v-model="fileRecords"
          ></VueFileAgent>
        </template>
        <v-btn :disabled="!fileRecordsForUpload.length || isDisabled" @click="uploadFiles()" color="primary">
        Upload {{ fileRecordsForUpload.length }} files
        </v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteUploadConfirm">Yes</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogUploading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please wait...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
            persistent
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
require('vue-file-agent/dist/vue-file-agent.css')

import { Action as progAction } from '../store/prog_bar/types'
import { Action as imageAction } from '../store/imagestest/types'
import { Action as editDialogAction } from '../store/edit_dialog/types'
import { Action as ubicacionesAction } from '../store/ubicaciones/types'
import { FileRecord } from 'vue-file-agent'
export default {

  data: function () {
    return {
      closeDialog: false,
      itemToDelete: null,
      fileRecords: [],
      fileRecordsForUpload: [], // maintain an upload queue
      isDisabled: false,
      dialogDelete: false,
      dialogUploading: false,
      editedItem: {
        id: null,
      },
    };
  },
  components: {
  },
  computed: {
    editedItemSt : function(){ return this.$store.getters.getEditedItem ?? [] },
    fileRecordsSt : function(){ return this.$store.getters.getFileRecords ?? [] },
    isDialogActive : {
      get: function(){ return this.$store.getters.isUploadDialogActive },
      set: function(val) {
        this.$store.dispatch(`${[editDialogAction.UPLOAD_DIALOG]}`, val)
      }
    }
  },
  watch: {
    closeDialog: function () {
      this.$store.dispatch(`${[editDialogAction.UPLOAD_DIALOG]}`, false)
    },
    editedItemSt (editedItem) {
      this.editedItem = Object.assign({}, editedItem)
    },
    fileRecordsSt (fileRecords) {
      this.fileRecords = fileRecords
    },
  },
  methods: {
    uploadFiles() {
      if( this.fileRecordsForUpload.length > 0 ) {
        this.$store.dispatch(`${[progAction.LOADING]}`, true)
        this.dialogUploading = true
        this.isDisabled = true
        let data = { id: this.editedItem.id, fileRecordsForUpload: this.fileRecordsForUpload }
        this.$store.dispatch(`${[imageAction.UPLOAD_IMAGEN]}`, data).then((resp)=>{
          let file_results = []
          resp.data.data.forEach(result => {
            file_results.push({
              id_archivo: result.id_archivo,
              dimensions: {
                width: result.img_data.dimensions.width,
                height: result.img_data.dimensions.height
              },
              ext: result.img_data.ext,
              nombre: result.img_data.nombre,
              size: result.img_data.size,
              sizeText: result.img_data.sizeText,
              type: result.img_data.type,
              url_resized: result.img_data.url_resized,
              uuid: result.uuid,
            })
          });
          let data = {
            id: this.editedItem.id,
            file_results: file_results
          }
          this.$store.dispatch(`${[ubicacionesAction.UBICACIONES_NEW_UPLOAD]}`, data)
          this.fileRecordsForUpload = [];
          this.isDisabled = false
          this.dialogUploading = false
          this.$store.dispatch(`${[progAction.LOADING]}`, false)

          this.fileRecords.forEach(fileRecord => {
            let itemIndex = file_results.findIndex(x => x.nombre === fileRecord.name())
            if(itemIndex != -1) {
              fileRecord.id_archivo = file_results[itemIndex].id_archivo
            }
          });
        })
      }
    },
    deleteUploadedFile(fileRecord) {
      this.$store.dispatch(`${[progAction.LOADING]}`, true)
      this.isDisabled = true
      let data = {
        id_ubicacion: this.editedItem.id,
        id_archivo: fileRecord.id_archivo,
      }
      this.$store.dispatch(`${[ubicacionesAction.UBICACIONES_DELETE_UPLOAD]}`, data).then(() => {
        var i = this.fileRecords.indexOf(fileRecord);
        this.fileRecords.splice(i, 1);

        this.isDisabled = false
        this.$store.dispatch(`${[progAction.LOADING]}`, false)
      })
    },
    fileDeleted(fileRecord) {
      var i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1);
      } else {
        this.deleteUploadedFile(fileRecord);
      }
    },
    onBeforeDelete(fileRecord) {
        var i = this.fileRecordsForUpload.indexOf(fileRecord);
        if (i !== -1) {
          // queued file, not yet uploaded. Just remove from the arrays
          this.fileRecordsForUpload.splice(i, 1);
          var k = this.fileRecords.indexOf(fileRecord);
          if (k !== -1) this.fileRecords.splice(k, 1);
        } else {
          this.itemToDelete = fileRecord
          this.dialogDelete = true
        }
    },

    deleteUploadConfirm() {
      this.dialogDelete = false
      this.fileDeleted(this.itemToDelete)
    },

    filesSelected(fileRecordsNewlySelected) {
      var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
    }
  }
}
</script> 
