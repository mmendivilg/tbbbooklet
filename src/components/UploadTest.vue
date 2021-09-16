<template>
  <div>
    <VueFileAgent
      ref="vueFileAgent"
      :theme="'list'"
      :multiple="true"
      :deletable="true"
      :meta="true"
      :accept="'image/*'"
      :maxSize="'10MB'"
      :maxFiles="14"
      :helpText="'Choose images or zip files'"
      :errorText="{
        type: 'Invalid file type. Only images or zip Allowed',
        size: 'Files should not exceed 10MB in size',
      }"
      @select="filesSelected($event)"
      @beforedelete="onBeforeDelete($event)"
      @delete="fileDeleted($event)"
      :disabled="isDisabled"
      v-model="fileRecords"
    ></VueFileAgent>
    <v-btn :disabled="!fileRecordsForUpload.length || isDisabled" @click="uploadFiles()" color="primary">
      Upload {{ fileRecordsForUpload.length }} files
    </v-btn>
  </div>
</template>

<script>
require('vue-file-agent/dist/vue-file-agent.css')

import { Action as progAction } from '../store/prog_bar/types'
import { Action as imageAction } from '../store/imagestest/types'
export default {

  data: function () {
    return {
      fileRecords: [],
      fileRecordsForUpload: [], // maintain an upload queue
      isDisabled: false,
      id: null,
    };
  },
  components: {
  },
  computed: {
    // imgData : function(){ 
    // },
  },
  created: function(){
  },
  async beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setId(to.params.id)
    });
  },
  methods: {
    setId(id) {
      this.id = id;
    },
    uploadFiles() {
      // if( this.fileRecordsForUpload.length > 0 ) {
      //   this.$store.dispatch(`${[progAction.LOADING]}`, true)
      //   this.isDisabled = true
      //   let data = { id: this.id, fileRecordsForUpload: this.fileRecordsForUpload }
      //   this.$store.dispatch(`${[imageAction.UPLOAD_IMAGEN]}`, data).then(()=>{
      //     this.fileRecordsForUpload = [];
      //     this.fileRecords = [];
      //     this.isDisabled = false
      //     this.$store.dispatch(`${[progAction.LOADING]}`, false)
      //   })
      // }

      if( this.fileRecords.length > 0 ) {
        this.fileRecords.forEach(element => {
          element.progress(101)
        });
        console.log(this.fileRecords)
      }
    },
    deleteUploadedFile(fileRecord) {
      // this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
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
          if (confirm('Are you sure you want to delete?')) {
            this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
          }
        }
    },
    filesSelected(fileRecordsNewlySelected) {
      var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
    }
  },
  // mounted() {
  //   console.log('finished?')
  // }
}
</script> 
