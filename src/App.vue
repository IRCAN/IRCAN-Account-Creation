<template>
<q-layout view="lHh Lpr lFf">
  <navbar />
  <q-page-container>
    <router-view />
  </q-page-container>
  </q-layout>
</template>

<script>
import Navbar from './layouts/default'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
</style>
