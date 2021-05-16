<template>
  <div>
  <div id="app">
    <Navbar />
    <Filterbar />
    <div class="card-area-wrapper">
      <Card />
    </div>
  </div>
    <Login />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Filterbar from '@/components/FilterBar.vue'
import Card from '@/components/Card.vue'
import Login from '@/components/Login.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Filterbar,
    Card, 
    Login
  },
  mounted() {
    if(localStorage.getItem('token')){
      document.getElementById('app').classList.remove('blur');
    } else {
      document.getElementById('app').classList.add('blur')
    }
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
  font-family: 'Heiti-Medium', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.blur {
  filter: blur(5px);
}
</style>
