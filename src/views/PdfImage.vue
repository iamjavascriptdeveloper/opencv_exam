<template>
  <v-container>

    <v-row>
      <v-col cols="3">
        <v-file-input
          v-model="file"
          placeholder="Upload your documents"
          label="File input" 
          accept=".pdf"
          show-size
          prepend-icon="mdi-paperclip"
          :disabled="!opencvReady"
        >
          <template v-slot:selection="{ text }">
            <v-chip
              small
              label
              color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>

      <v-col cols="3">
        <v-btn @click="imageprocess()" :disabled="file === null">Check OpenCV</v-btn>
        <v-btn @click="dialog=true" :disabled="!opencvGen">Show Result</v-btn>
      </v-col>

      <template v-if="spinner">
        <v-progress-circular
          v-model="spinner"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </template>
      <template v-else>
        

        <v-col cols="12">
            <canvas id="canvasInput" width="1500"></canvas>
        </v-col>

        <v-col cols="12">
            <canvas id="canvasOutput" width="1500"></canvas>
        </v-col>
      </template>
      

    </v-row>

    <v-overlay :value="overlay">
      <v-btn
        loading
        icon
      >
      </v-btn>
    </v-overlay>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Specifications</v-card-title>

        <v-card-text>
          <h1> Checked</h1>
          <template v-for="(item, i) in checked">
            <p :key="i">item</p>
          </template>

          <p>{{checked.length}}</p>
        </v-card-text>

        <v-card-actions>
        
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

import { Utils } from '@/assets/opencv/utils.js'

import { houseTypeChecklist } from "@/assets/checklist/housetype.js";
import { houseSpecChecklist } from "@/assets/checklist/housespec.js";
import {powerCompanyChecklist} from "@/assets/checklist/powercomp.js";
import { answersheet } from "@/assets/checklist/answersheet.js";

let utils = new Utils();

let
  __CANVAS,
  __CANVAS_CTX,
  __PDF_DOC,
  __CURRENT_PAGE,
  __TOTAL_PAGES,
  __PAGE_RENDERING_IN_PROGRESS = 0;
  
const 

  init = () => {
    __CANVAS = document.getElementById('canvasInput');
    __CANVAS_CTX = __CANVAS.getContext('2d');
  },
 
  showPDF = (pdf_url) => {
    PDFJS.getDocument({ url: pdf_url })
    .then((pdf_doc) => {
      __PDF_DOC = pdf_doc;
      __TOTAL_PAGES = __PDF_DOC.numPages;
      
      // Show the first page
      showPage(1);
    })
    
    .catch(function(error) {
      alert(error.message);
    });
  },
  
  showPage = (page_no) => {
    __PAGE_RENDERING_IN_PROGRESS = 1;
    __CURRENT_PAGE = page_no;

    // Fetch the page
    __PDF_DOC.getPage(page_no).then( (page) => {
      // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
      var scale_required = __CANVAS.width / page.getViewport(1).width;

      // Get viewport of the page at required scale
      var viewport = page.getViewport(scale_required);

      // Set canvas height
      __CANVAS.height = viewport.height;

      var renderContext = {
        canvasContext: __CANVAS_CTX,
        viewport: viewport
      };
      
      // Render the page contents in the canvas
      page.render(renderContext).then(() => {
        __PAGE_RENDERING_IN_PROGRESS = 0;
      });
    });
  }

export default {
  data: () => ({
    overlay: false,
    file: null,
    opencvReady: false,
    opencvGen: false,
    dialog: false,
    checked: [],
    spinner: false
  }),

  created() {
    utils.loadOpenCv( () => {
      this.opencvReady = true; 
    });
  },

  mounted() {
    init();
  },

  methods: {
    imageprocess(){
      // this.spinner = true;
      utils.executeCode(__CANVAS);

      answersheet.loadAnswers();
      this.checked = answersheet.checkAnswer().getCheck()


      this.opencvGen = true;
      this.dialog = true
    }
  },

  watch:{
    file: (newVal)=>{
      if (newVal){
        showPDF( URL.createObjectURL(newVal) );
      }
    }
  }
}

</script>
