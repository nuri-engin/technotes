<template>
  <div>
    <div id="app">
      <Navbar :logout="logout" :username="currUser && currUser.userName" />
      <Filterbar />
      <div class="card-area-wrapper">
        <div v-if="loadData" class="spinner-container">
          <b-spinner variant="light"></b-spinner>
          <div class="loading-text">Loading posts</div>
        </div>
        <div v-if="posts.length === 0 && !loadData" class="no-data">
            <b-icon class="no-data-icon" icon="exclamation-triangle"></b-icon>
            <span>No Card Found</span>
        </div>
        <div v-else-if="!loadData" v-for="(post, index) in orderedPosts" :key="index">
          <Card :post="post" />
        </div>
      </div>
      <Pagination v-if="posts.length > 0" :rows="filtered ? posts.length : total" currentPage="1" />
    </div>
    <Login :loggedIn="loggedIn" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Filterbar from "@/components/FilterBar.vue";
import Card from "@/components/Card.vue";
import Pagination from "@/components/Pagination.vue";
import Login from "@/components/Login.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Navbar,
    Filterbar,
    Card,
    Login,
    Pagination
  },
  data() {
    return {
    };
  },
  mounted() {
      if (localStorage.getItem("token")) {
        document.getElementById("app").classList.remove("blur");
        this.fetchPosts();
      } else {
        document.getElementById("app").classList.add("blur");
        this.loginState(true)
      }
  },
  computed: {
    ...mapGetters(["currUser", "posts", "loggedIn", "loadData", "total", "filtered"]),
    orderedPosts() {
      return this.posts;
    }
  },
  methods: {
    ...mapActions(["fetchPosts", "loginState", "logoutUser", "totalPosts", "totalUsers"]),
    logout() {
      document.getElementById("app").classList.add("blur");
      this.logoutUser();
    },
  },
};
</script>

<style>

@import './fonts/font.css';

html, body {
  overflow: hidden;
}

.form-control:focus {
  border-color: inherit !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

body {
  color: #fcf0f3 !important;
  background-color: #02252f !important;
  font-family:"Quicksand", Helvetica, Arial !important;
  font-family:"Quicksand-light", Helvetica, Arial !important;
}
.card-area-wrapper {
  padding: 0px 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  max-height: 70vh;
  min-height: 70vh;
  overflow: hidden;
  overflow-y: scroll;
  margin: 25px 0px;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner-container .spinner-border {
  width: 5rem;
  height: 5rem;
}

.spinner-container .loading-text {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

#app {
  font-family: "Quicksand-light", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}
.blur {
  filter: blur(5px);
}

.no-data{
 display: flex;
    text-align: center;
    font-size: 22px;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    color: #f3fcf0;
    font-weight: bold;
}

.no-data svg {
    font-size: 4rem;
    margin-bottom: 15px;
    color: greenyellow;
}
</style>
