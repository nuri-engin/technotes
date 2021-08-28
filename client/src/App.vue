<template>
  <div>
  <div id="app">
    <Navbar :logout="logout" :username="currUser && currUser.role" />
    <Filterbar />
    <div class="card-area-wrapper">
      <div v-for="post in posts" :key="post">
        <Card :post="post" />
      </div>
    </div>
  </div>
    <Login :isLoggedIn="isLoggedIn" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Filterbar from '@/components/FilterBar.vue'
import Card from '@/components/Card.vue'
import Login from '@/components/Login.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Navbar,
    Filterbar,
    Card, 
    Login
  },
  data() {
    return { 
        isLoggedIn: false
      }
  },
  mounted() {
    if(localStorage.getItem('token')){
      document.getElementById('app').classList.remove('blur');
      this.isLoggedIn = true
      this.fetchPosts()
    } else {
      document.getElementById('app').classList.add('blur')
      this.isLoggedIn = false
    }
  },
  computed: {
    ...mapGetters(['currUser', 'posts'])
  },
  methods: {
    ...mapActions(['fetchPosts', 'loginState']),
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user')
      document.getElementById('app').classList.add('blur');
      this.loginState(false);
      this.isLoggedIn = false
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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
