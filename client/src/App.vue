<template>
  <div id="app">
    <Navbar />
    <Filterbar />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Filterbar from '@/components/FilterBar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Filterbar
  }
}
</script>

<style>
body {
  color: #fcf0f3 !important;
  background-color: #02252f !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
