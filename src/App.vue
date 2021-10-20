<template>
  <v-app>
    
    <v-app-bar app flat>
      <v-toolbar-title class="headline text-uppercase">
        <span>OpenCV </span>
        <span class="font-weight-light">CADREQUEST</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        icon
        to="PdfImage"
      >
       Pdf
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {

  },
  data: () => ({
    //
  }),
};
</script>
