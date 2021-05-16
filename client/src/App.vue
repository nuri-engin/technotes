<template>
  <div>
  <div id="app">
    <Navbar :logout="logout" :username="username" />
    <Filterbar />
    <div class="card-area-wrapper">
      <div v-for="post in posts" :key="post">
        <Card :post="post" />
      </div>
    </div>
  </div>
    <Login :getPosts="getPosts" :getUserName="getUserName" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Filterbar from '@/components/FilterBar.vue'
import Card from '@/components/Card.vue'
import Login from '@/components/Login.vue'
import service from "@/service"

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
        posts: [],
        username: ''
      }
  },
  mounted() {
    if(localStorage.getItem('token')){
      document.getElementById('app').classList.remove('blur');
      this.getPosts()
    } else {
      document.getElementById('app').classList.add('blur')
    }
  },
  methods: {
      getUserName(data) {
        this.username = data.firstName + ' ' + data.lastName
      },
      getPosts() {
        if(localStorage.getItem('token')){
          service().get('posts', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }).then(response => {
            this.posts = response.data
          })
        }
    },
    logout() {
      localStorage.removeItem('token');
      document.getElementById('app').classList.add('blur');
      this.showLoginModal=true;
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
  justify-content: flex-start;
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
