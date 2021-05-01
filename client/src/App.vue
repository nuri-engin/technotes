<template>
  <div id="app">
    <Navbar />
    <Filterbar />
    <div class="card-area-wrapper">
      <Card />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Filterbar from '@/components/FilterBar.vue'
import Card from '@/components/Card.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Filterbar,
    Card
  }
}
</script>

<style>
body {
  color: #fcf0f3 !important;
  background-color: #02252f !important;
}
.card-area-wrapper {
  margin-top: 40px;
  padding: 20px 40px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
